// src/ui/components/output.js
// Output/message display component for chat interface

import { BOX_WIDTH } from './header.js';

/**
 * Output/Message display component
 */
export class Output {
  constructor({ maxMessages = 100 }) {
    this.messages = [];
    this.maxMessages = maxMessages;
    this.scrollOffset = 0;
  }

  /**
   * Add a message to the output
   * @param {Object} message - Message object
   * @param {string} message.role - 'user' or 'assistant'
   * @param {string} message.content - Message content
   * @param {Date} message.timestamp - Message timestamp
   */
  addMessage(role, content, timestamp = new Date()) {
    this.messages.push({
      role,
      content,
      timestamp,
      rendered: false,
    });

    // Trim old messages if exceeding max
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }

    // Auto-scroll to bottom when new message arrives
    this.scrollToBottom();
  }

  /**
   * Update the last message (for streaming)
   * @param {string} content - Updated content
   */
  updateLastMessage(content) {
    if (this.messages.length > 0) {
      const lastMessage = this.messages[this.messages.length - 1];
      lastMessage.content = content;
      lastMessage.rendered = false;
    }
  }

  /**
   * Get the last message
   */
  getLastMessage() {
    return this.messages.length > 0 
      ? this.messages[this.messages.length - 1] 
      : null;
  }

  /**
   * Render output to fit in available space
   * @param {number} availableHeight - Height available for rendering
   */
  render(availableHeight) {
    const lines = [];
    const textWidth = BOX_WIDTH - 4; // Account for borders and padding

    // Convert messages to wrapped lines with styling
    const allLines = [];
    
    for (const message of this.messages) {
      // Add role indicator
      const rolePrefix = message.role === 'user' ? '> You' : '> Assistant';
      const roleColor = message.role === 'user' ? '\x1b[36m' : '\x1b[35m'; // Cyan for user, Magenta for assistant
      const reset = '\x1b[0m';
      
      allLines.push({
        content: `${roleColor}${rolePrefix}${reset}`,
        isRole: true,
        role: message.role,
      });

      // Wrap message content
      const wrappedContent = this.wrapText(message.content, textWidth);
      wrappedContent.forEach(line => {
        allLines.push({
          content: line,
          isRole: false,
          role: message.role,
        });
      });

      // Add spacing between messages
      allLines.push({
        content: '',
        isRole: false,
        role: null,
      });
    }

    // Calculate visible lines based on scroll offset
    const totalLines = allLines.length;
    const maxVisibleLines = availableHeight;
    
    // Adjust scroll offset if needed
    this.scrollOffset = Math.max(0, Math.min(this.scrollOffset, totalLines - maxVisibleLines));
    
    const visibleLines = allLines.slice(this.scrollOffset, this.scrollOffset + maxVisibleLines);

    // Render visible lines with borders
    const topBorder = '┌' + '─'.repeat(BOX_WIDTH) + '┐';
    const bottomBorder = '└' + '─'.repeat(BOX_WIDTH) + '┘';
    const emptyLine = '│ ' + ' '.repeat(BOX_WIDTH - 2) + ' │';

    lines.push(topBorder);

    for (let i = 0; i < maxVisibleLines; i++) {
      if (i < visibleLines.length) {
        const line = visibleLines[i];
        const content = line.content || '';
        
        // Strip ANSI codes for length calculation
        const plainContent = this.stripAnsi(content);
        const paddedContent = content + ' '.repeat(Math.max(0, BOX_WIDTH - 2 - plainContent.length));
        
        lines.push('│ ' + paddedContent + ' │');
      } else {
        lines.push(emptyLine);
      }
    }

    lines.push(bottomBorder);

    return {
      lines,
      totalLines,
      visibleLines: maxVisibleLines,
      canScrollUp: this.scrollOffset > 0,
      canScrollDown: this.scrollOffset + maxVisibleLines < totalLines,
    };
  }

  /**
   * Scroll up by N lines
   * @param {number} amount - Number of lines to scroll
   */
  scrollUp(amount = 1) {
    this.scrollOffset = Math.max(0, this.scrollOffset - amount);
  }

  /**
   * Scroll down by N lines
   * @param {number} amount - Number of lines to scroll
   */
  scrollDown(amount = 1) {
    this.scrollOffset += amount;
  }

  /**
   * Scroll to top
   */
  scrollToTop() {
    this.scrollOffset = 0;
  }

  /**
   * Scroll to bottom
   */
  scrollToBottom() {
    this.scrollOffset = Number.MAX_SAFE_INTEGER; // Will be clamped in render()
  }

  /**
   * Page up (scroll by visible height)
   * @param {number} pageHeight - Height of visible area
   */
  pageUp(pageHeight) {
    this.scrollUp(Math.max(1, pageHeight - 1));
  }

  /**
   * Page down (scroll by visible height)
   * @param {number} pageHeight - Height of visible area
   */
  pageDown(pageHeight) {
    this.scrollDown(Math.max(1, pageHeight - 1));
  }

  /**
   * Clear all messages
   */
  clear() {
    this.messages = [];
    this.scrollOffset = 0;
  }

  /**
   * Get message count
   */
  getMessageCount() {
    return this.messages.length;
  }

  /**
   * Export messages
   */
  export() {
    return this.messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp,
    }));
  }

  /**
   * Import messages
   * @param {Array} messages - Array of message objects
   */
  import(messages) {
    this.messages = messages.map(msg => ({
      ...msg,
      rendered: false,
    }));
    this.scrollToBottom();
  }

  /**
   * Wrap text to multiple lines
   * @param {string} text - Text to wrap
   * @param {number} maxWidth - Maximum line width
   */
  wrapText(text, maxWidth) {
    if (!text) return [''];
    
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      
      if (testLine.length <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
        }
        
        // Handle words longer than maxWidth
        if (word.length > maxWidth) {
          let remaining = word;
          while (remaining.length > maxWidth) {
            lines.push(remaining.substring(0, maxWidth - 3) + '...');
            remaining = remaining.substring(maxWidth - 3);
          }
          currentLine = remaining;
        } else {
          currentLine = word;
        }
      }
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines.length > 0 ? lines : [''];
  }

  /**
   * Strip ANSI escape codes from string
   * @param {string} str - String with ANSI codes
   */
  stripAnsi(str) {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
  }

  /**
   * Get scroll position info
   */
  getScrollInfo() {
    return {
      offset: this.scrollOffset,
      canScrollUp: this.scrollOffset > 0,
      atBottom: false, // Will be calculated in render()
    };
  }
}