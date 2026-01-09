export class StreamHandler {
  constructor() {
    this.buffer = '';
    this.isStreaming = false;
  }

  /**
   * @param {Function} onChunk - Callback for each chunk
   * @param {Function} onComplete - Callback when complete
   */
  start(onChunk, onComplete) {
    this.isStreaming = true;
    this.buffer = '';
    this.onChunk = onChunk;
    this.onComplete = onComplete;
  }

  /**
   * @param {string} chunk - Text chunk
   */
  handleChunk(chunk) {
    if (!this.isStreaming) return;
    
    this.buffer += chunk;
    if (this.onChunk) {
      this.onChunk(chunk);
    }
  }

  complete() {
    this.isStreaming = false;
    if (this.onComplete) {
      this.onComplete(this.buffer);
    }
  }

  stop() {
    this.isStreaming = false;
    this.buffer = '';
  }

  getBuffer() {
    return this.buffer;
  }
}