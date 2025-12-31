// src/ui/views/chat.js
// COMPLETE FIX - Syntax highlighting + stable input

import { stdin, stdout } from 'process';
import readline from 'readline';
import { Input } from '../components/Input.js';
import { getHeader, BOX_WIDTH } from '../components/header.js';
import { initializeClients, getCurrentProvider, getCurrentModel, validateApiConfig } from '../../api/client.js';
import { registerProvider, getProvider } from '../../api/providers/index.js';
import { ContextManager } from '../../api/context.js';

// IMPORT YOUR BEAUTIFUL RENDER SYSTEM
import {
  renderHeader,
  renderText,
  renderCodeBlock,
  renderBulletList,
  renderOrderedList,
  renderTable,
  renderTableFromMarkdown,
  renderHR,
  renderComment,
  renderEmptyLine,
  renderBlockquote,
  addSpacing,
  resetHeaderCounters,
  startDocument,
  endDocument,
  PAGE_WIDTH,
  getLeftPadding,
  printWithBorders,
  INNER_PADDING,
  bgDark,
  reset
} from '../render/index.js';

// Parse and render message content with markdown support
function renderMessageContent(content) {
  const lines = content.split('\n');
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Code blocks
    if (trimmedLine.startsWith('```')) {
      const language = trimmedLine.slice(3).trim() || 'text';
      const codeLines = [];
      i++;
      
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      
      if (codeLines.length > 0) {
        renderCodeBlock(codeLines.join('\n'), language);
      }
      i++; // Skip closing ```
      continue;
    }
    
    // Tables
    if (trimmedLine.includes('|') && trimmedLine.split('|').length > 2) {
      const tableLines = [lines[i]];
      i++;
      
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      
      renderTableFromMarkdown(tableLines);
      continue;
    }
    
    // Headers (###)
    if (trimmedLine.match(/^#{1,3}\s/)) {
      const match = trimmedLine.match(/^(#{1,3})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        renderHeader(text, level);
        i++;
        continue;
      }
    }
    
    // Bullet lists
    if (trimmedLine.match(/^[-*+]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].trim().match(/^[-*+]\s/)) {
        items.push(lines[i].trim().replace(/^[-*+]\s/, ''));
        i++;
      }
      renderBulletList(items);
      continue;
    }
    
    // Numbered lists
    if (trimmedLine.match(/^\d+\.\s/)) {
      const items = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      renderOrderedList(items);
      continue;
    }
    
    // Blockquotes
    if (trimmedLine.startsWith('>')) {
      renderBlockquote(trimmedLine.replace(/^>\s?/, ''));
      i++;
      continue;
    }
    
    // Horizontal rules
    if (trimmedLine.match(/^(---+|\*\*\*+|___+)$/)) {
      renderHR();
      i++;
      continue;
    }
    
    // Comments
    if (trimmedLine.startsWith('//')) {
      renderComment(line);
      i++;
      continue;
    }
    
    // Empty lines
    if (trimmedLine === '') {
      renderEmptyLine();
      i++;
      continue;
    }
    
    // Regular text
    renderText(line);
    i++;
  }
}

// Render a message with role header
function renderStyledMessage(role, content) {
  const rolePrefix = role === 'user' ? '👤 You' : '🤖 Assistant';
  renderHeader(rolePrefix, 2);
  renderMessageContent(content);
  addSpacing();
}

// Render input with proper centering to match render system
function renderCenteredInput(inputLines) {
  const leftPadding = ' '.repeat(getLeftPadding());
  inputLines.forEach(line => {
    console.log(leftPadding + line);
  });
}

// Render the ASCII header with centering
function renderASCIIHeader(modelName, currentPath) {
  const headerContent = getHeader(modelName, currentPath);
  const headerLines = headerContent.split('\n');
  const leftPadding = ' '.repeat(getLeftPadding());
  
  headerLines.forEach(line => {
    console.log(leftPadding + line);
  });
  console.log('');
}

export async function startChat() {
  const currentPath = process.cwd();

  // Validate configuration
  const validation = validateApiConfig();
  if (!validation.isValid) {
    console.error('Configuration error:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nRun "node cli.js config set <key> <value>" to configure');
    process.exit(1);
  }

  const providerName = getCurrentProvider();
  const modelName = getCurrentModel();

  // Initialize API clients
  const clients = initializeClients();

  if (!clients[providerName]) {
    console.error(`Provider '${providerName}' client not initialized`);
    process.exit(1);
  }

  registerProvider(providerName, clients[providerName]);
  const provider = getProvider(providerName);

  // Initialize context
  const context = new ContextManager();

  // Set up readline for keypress events
  readline.emitKeypressEvents(stdin);
  if (stdin.isTTY) {
    stdin.setRawMode(true);
  }

  let isProcessing = false;
  let currentInputHeight = 3;

  const input = new Input({
    minHeight: 3,
    maxHeight: 8,
    onSubmit: async (text) => {
      if (!text.trim() || isProcessing) return;

      isProcessing = true;

      // Add user message
      context.addMessage('user', text);
      
      // Get current input height before clearing
      const inputHeightBeforeClear = currentInputHeight;
      input.clear();

      // Clear ONLY the input area (not the prompts)
      for (let i = 0; i < inputHeightBeforeClear; i++) {
        process.stdout.write('\x1b[1A'); // Move up
        process.stdout.write('\x1b[2K'); // Clear line
      }

      // Render the user message
      renderStyledMessage('user', text);

      // Get AI response
      try {
        const messages = context.getMessages(providerName);
        let fullResponse = '';

        // Add empty assistant message for streaming
        context.addMessage('assistant', '');

        // Start assistant message header
        renderHeader('🤖 Assistant', 2);

        if (providerName === 'anthropic') {
          const anthropicMessages = messages.filter(m => m.content.trim()).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
          }));

          const stream = await provider.client.messages.create({
            model: modelName,
            max_tokens: 4096,
            temperature: 0.7,
            messages: anthropicMessages,
            stream: true,
          });

          for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta' && chunk.delta?.text) {
              fullResponse += chunk.delta.text;
            }
          }
        } else {
          // OpenAI/Groq format
          const stream = await provider.client.chat.completions.create({
            model: modelName,
            messages: messages.filter(m => m.content.trim()),
            max_tokens: 4096,
            temperature: 0.7,
            stream: true,
          });

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              fullResponse += content;
            }
          }
        }

        // Update context with full response
        context.updateLastMessage(fullResponse);

        // Render the complete response with proper markdown
        renderMessageContent(fullResponse);
        addSpacing();

      } catch (error) {
        context.updateLastMessage(`Error: ${error.message}`);
        renderText(`Error: ${error.message}`);
        addSpacing();
      }

      isProcessing = false;

      // Show input prompt again
      renderHR();
      renderText('Type your message (Ctrl+C to quit):');
      renderEmptyLine();
      const { lines: inputLines } = input.render();
      currentInputHeight = inputLines.length;
      renderCenteredInput(inputLines);
    },
    onHeightChange: (newHeight) => {
      currentInputHeight = newHeight;
    }
  });

  // Handle keypress events
  stdin.on('keypress', (str, key) => {
    if (!key) return;

    if ((key.ctrl && key.name === 'c') || key.name === 'escape') {
      if (stdin.isTTY) {
        stdin.setRawMode(false);
      }
      console.log('\nGoodbye!');
      process.exit(0);
    }

    const needsRender = input.handleKeypress(key);
    if (needsRender && !isProcessing) {
      // Clear ONLY the input box lines
      const oldHeight = currentInputHeight;
      const { lines: newInputLines, heightChanged } = input.render();
      
      if (heightChanged) {
        currentInputHeight = newInputLines.length;
      }
      
      // Clear old input
      for (let i = 0; i < oldHeight; i++) {
        process.stdout.write('\x1b[1A');
        process.stdout.write('\x1b[2K');
      }
      
      // Render new input
      renderCenteredInput(newInputLines);
    }
  });

  // Initial render
  console.clear();
  
  // Render the ASCII logo header
  renderASCIIHeader(modelName, currentPath);
  
  // Add separator
  renderHR();
  addSpacing();

  // Welcome message
  context.addMessage('assistant', 'Hello! How can I help you today?');
  renderStyledMessage('assistant', 'Hello! How can I help you today?');

  // Show input prompt
  renderHR();
  renderText('Type your message (Ctrl+C to quit):');
  renderEmptyLine();
  const { lines: inputLines } = input.render();
  currentInputHeight = inputLines.length;
  renderCenteredInput(inputLines);
}