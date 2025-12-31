// src/api/cache.js
// API response caching

/**
 * Simple in-memory cache for API responses
 */
export class ResponseCache {
  constructor(maxSize = 100, ttl = 3600000) { // 1 hour default TTL
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  /**
   * Generate cache key from request
   * @param {Object} request - Request parameters
   */
  generateKey(request) {
    return JSON.stringify({
      provider: request.provider,
      model: request.model,
      messages: request.messages,
    });
  }

  /**
   * Get cached response
   * @param {Object} request - Request parameters
   */
  get(request) {
    const key = this.generateKey(request);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.response;
  }

  /**
   * Set cached response
   * @param {Object} request - Request parameters
   * @param {Object} response - Response data
   */
  set(request, response) {
    const key = this.generateKey(request);
    
    // Remove oldest if at max size
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size() {
    return this.cache.size;
  }

  /**
   * Remove expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}