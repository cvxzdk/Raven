import { stdin, stdout } from 'process';
import readline from 'readline';
import { Input } from '../components/Input.js';
import { getHeader, BOX_WIDTH } from '../components/header.js';
import { initializeClients, getCurrentProvider, getCurrentModel, validateApiConfig } from '../../api/client.js';
import { registerProvider, getProvider } from '../../api/providers/index.js';
import { ContextManager } from '../../api/context.js';
import { parseMarkdown } from '../components/output.js';

import {
  renderHeader,
  renderText,
  renderHR,
  addSpacing,
  renderMessage,
  renderParsedContent,
  renderEmptyLine,
  PAGE_WIDTH,
  getLeftPadding,
  printWithBorders,
  INNER_PADDING,
  bgDark,
  reset
} from '../render/render.js';

function renderCenteredInput(inputLines) {
  const leftPadding = ' '.repeat(getLeftPadding());
  inputLines.forEach(line => {
    console.log(leftPadding + line);
  });
}

// ASCII header with centering
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

  const validation = validateApiConfig();
  if (!validation.isValid) {
    console.error('Configuration error:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    console.error('\nRun "node cli.js config set <key> <value>" to configure');
    process.exit(1);
  }

  const providerName = getCurrentProvider();
  const modelName = getCurrentModel();

  const clients = initializeClients();

  if (!clients[providerName]) {
    console.error(`Provider '${providerName}' client not initialized`);
    process.exit(1);
  }

  registerProvider(providerName, clients[providerName]);
  const provider = getProvider(providerName);

  const context = new ContextManager();

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

      context.addMessage('user', text);
      
      const inputHeightBeforeClear = currentInputHeight;
      input.clear();

      for (let i = 0; i < inputHeightBeforeClear; i++) {
        process.stdout.write('\x1b[1A'); 
        process.stdout.write('\x1b[2K'); 
      }

      renderMessage('user', text, parseMarkdown);

      try {
        const messages = context.getMessages(providerName);
        let fullResponse = '';

        context.addMessage('assistant', '');

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

        context.updateLastMessage(fullResponse);

        const blocks = parseMarkdown(fullResponse);
        renderParsedContent(blocks);
        addSpacing();

      } catch (error) {
        context.updateLastMessage(`Error: ${error.message}`);
        renderText(`Error: ${error.message}`);
        addSpacing();
      }

      isProcessing = false;

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

  // events
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
      const oldHeight = currentInputHeight;
      const { lines: newInputLines, heightChanged } = input.render();
      
      if (heightChanged) {
        currentInputHeight = newInputLines.length;
      }
      

      for (let i = 0; i < oldHeight; i++) {
        process.stdout.write('\x1b[1A');
        process.stdout.write('\x1b[2K');
      }

      renderCenteredInput(newInputLines);
    }
  });


  console.clear();
  

  renderASCIIHeader(modelName, currentPath);
  
  renderHR();
  addSpacing();

  context.addMessage('assistant', 'Hello! How can I help you today?');
  renderMessage('assistant', 'Hello! How can I help you today?', parseMarkdown);

  renderHR();
  renderText('Type your message (Ctrl+C to quit):');
  renderEmptyLine();
  const { lines: inputLines } = input.render();
  currentInputHeight = inputLines.length;
  renderCenteredInput(inputLines);
}