// src/api/streaming.js
// Handle streaming responses

/**
 * Stream handler for real-time responses
 */
export class StreamHandler {
  constructor() {
    this.buffer = '';
    this.isStreaming = false;
  }

  /**
   * Start streaming
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
   * Handle incoming chunk
   * @param {string} chunk - Text chunk
   */
  handleChunk(chunk) {
    if (!this.isStreaming) return;
    
    this.buffer += chunk;
    if (this.onChunk) {
      this.onChunk(chunk);
    }
  }

  /**
   * Complete streaming
   */
  complete() {
    this.isStreaming = false;
    if (this.onComplete) {
      this.onComplete(this.buffer);
    }
  }

  /**
   * Stop streaming
   */
  stop() {
    this.isStreaming = false;
    this.buffer = '';
  }

  /**
   * Get current buffer
   */
  getBuffer() {
    return this.buffer;
  }
}