const BOX_WIDTH = 100;

export class Input {
  constructor({ minHeight = 3, maxHeight = 8, onSubmit, onHeightChange }) {
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.onSubmit = onSubmit;
    this.onHeightChange = onHeightChange;
    
    this.value = '';
    this.currentHeight = minHeight;
    this.cursorPosition = 0;
  }

  calculateRequiredHeight() {
    if (!this.value) {
      return this.minHeight;
    }

    const promptPrefix = '> ';
    const fullText = promptPrefix + this.value;
    const textWidth = BOX_WIDTH - 4;
    
    const lines = Math.ceil(fullText.length / textWidth) || 1;
    const requiredHeight = Math.min(
      Math.max(lines + 2, this.minHeight),
      this.maxHeight
    );
    
    return requiredHeight;
  }

  render() {
    const textWidth = BOX_WIDTH - 4;
    
    const newHeight = this.calculateRequiredHeight();
    const heightChanged = newHeight !== this.currentHeight;
    
    if (heightChanged) {
      this.currentHeight = newHeight;
      if (this.onHeightChange) {
        this.onHeightChange(newHeight);
      }
    }

    const lines = [];
    const topBorder = '┌' + '─'.repeat(BOX_WIDTH) + '┐';
    const bottomBorder = '└' + '─'.repeat(BOX_WIDTH) + '┘';
    const emptyLine = '│ ' + ' '.repeat(BOX_WIDTH - 2) + ' │';

    const promptPrefix = '> ';
    const fullText = promptPrefix + this.value;
    
    const wrappedLines = [];
    for (let i = 0; i < fullText.length; i += textWidth) {
      wrappedLines.push(fullText.slice(i, i + textWidth));
    }

    if (wrappedLines.length === 0) {
      wrappedLines.push(promptPrefix);
    }

    const maxVisibleLines = this.currentHeight - 2;
    const scrollOffset = Math.max(0, wrappedLines.length - maxVisibleLines);
    const visibleLines = wrappedLines.slice(scrollOffset);

    lines.push(topBorder);
    
    for (let i = 0; i < maxVisibleLines; i++) {
      if (i < visibleLines.length) {
        const line = visibleLines[i];
        const paddedLine = line.padEnd(BOX_WIDTH - 2, ' ');
        lines.push('│ ' + paddedLine + ' │');
      } else {
        lines.push(emptyLine);
      }
    }
    
    lines.push(bottomBorder);

    return { lines, heightChanged };
  }

  handleKeypress(key) {
    if (!key) return false;

    if (key.name === 'return' || key.name === 'enter') {
      if (this.value.trim() && this.onSubmit) {
        this.onSubmit(this.value.trim());
        this.value = '';
        this.cursorPosition = 0;
        return true;
      }
      return false;
    }

    if (key.name === 'backspace') {
      if (this.cursorPosition > 0) {
        this.value = this.value.slice(0, this.cursorPosition - 1) + 
                     this.value.slice(this.cursorPosition);
        this.cursorPosition--;
        return true;
      }
      return false;
    }

    if (key.name === 'delete') {
      if (this.cursorPosition < this.value.length) {
        this.value = this.value.slice(0, this.cursorPosition) + 
                     this.value.slice(this.cursorPosition + 1);
        return true;
      }
      return false;
    }

    if (key.name === 'left') {
      if (this.cursorPosition > 0) {
        this.cursorPosition--;
        return true;
      }
      return false;
    }

    if (key.name === 'right') {
      if (this.cursorPosition < this.value.length) {
        this.cursorPosition++;
        return true;
      }
      return false;
    }

    if (key.sequence && key.sequence.length === 1 && !key.ctrl && !key.meta) {
      this.value = this.value.slice(0, this.cursorPosition) + 
                   key.sequence + 
                   this.value.slice(this.cursorPosition);
      this.cursorPosition++;
      return true;
    }

    return false;
  }

  getHeight() {
    return this.currentHeight;
  }

  clear() {
    this.value = '';
    this.cursorPosition = 0;
  }
}