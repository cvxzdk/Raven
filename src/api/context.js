export class ContextManager {
  constructor(maxMessages = 50) {
    this.messages = [];
    this.maxMessages = maxMessages;
    this.systemPrompt = null;
  }

  setSystemPrompt(prompt) {
    this.systemPrompt = prompt;
  }

  addMessage(role, content) {
    this.messages.push({ role, content });
    
    if (this.messages.length > this.maxMessages) {
      this.messages = this.messages.slice(-this.maxMessages);
    }
  }

  /**
   * @param {string} content - New content
   */
  updateLastMessage(content) {
    if (this.messages.length > 0) {
      this.messages[this.messages.length - 1].content = content;
    }
  }

  removeLastMessage() {
    if (this.messages.length > 0) {
      this.messages.pop();
    }
  }

  getMessages(provider = 'anthropic') {
    if (provider === 'anthropic') {
      return this.messages;
    } else {
      const messages = [...this.messages];
      if (this.systemPrompt) {
        messages.unshift({ role: 'system', content: this.systemPrompt });
      }
      return messages;
    }
  }

  getSystemPrompt() {
    return this.systemPrompt;
  }

  clear() {
    this.messages = [];
  }

  getMessageCount() {
    return this.messages.length;
  }

  getLastMessages(n) {
    return this.messages.slice(-n);
  }

  export() {
    return {
      systemPrompt: this.systemPrompt,
      messages: this.messages,
    };
  }

  import(data) {
    this.systemPrompt = data.systemPrompt || null;
    this.messages = data.messages || [];
  }
}