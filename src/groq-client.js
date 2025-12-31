const axios = require('axios');
const NodeCache = require('node-cache');
const config = require('./config');
const logger = require('./logger');

class GroqClient {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      maxKeys: config.cache.maxSize,
      checkperiod: 120
    });
    
    this.stats = {
      totalRequests: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errors: 0
    };
  }

  _generateCacheKey(messages, model) {
    const content = JSON.stringify({ messages, model });
    return Buffer.from(content).toString('base64').substring(0, 64);
  }

  async _makeRequest(messages, options = {}) {
    const payload = {
      model: options.model || config.groq.model,
      messages: messages,
      max_tokens: options.maxTokens || config.groq.maxTokens,
      temperature: options.temperature !== undefined ? options.temperature : config.groq.temperature,
      stream: false
    };

    logger.debug('Groq API Request:', JSON.stringify(payload, null, 2));

    try {
      const response = await axios.post(config.groq.apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${config.groq.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      logger.debug('Groq API Response:', JSON.stringify(response.data, null, 2));
      
      return response.data;
    } catch (error) {
      this.stats.errors++;
      
      if (error.response) {
        logger.error(`Groq API Error: ${error.response.status} - ${error.response.statusText}`);
        logger.debug('Error details:', error.response.data);
        throw new Error(`Groq API Error: ${error.response.data.error?.message || error.response.statusText}`);
      } else if (error.request) {
        logger.error('Network Error: No response from Groq API');
        throw new Error('Network Error: Could not reach Groq API');
      } else {
        logger.error('Request Error:', error.message);
        throw error;
      }
    }
  }

  async chat(messages, options = {}) {
    this.stats.totalRequests++;
    
    const cacheKey = this._generateCacheKey(messages, options.model || config.groq.model);
    
    if (!options.skipCache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        this.stats.cacheHits++;
        logger.debug('Cache hit');
        return cached;
      }
    }
    
    this.stats.cacheMisses++;
    logger.debug('Cache miss - making API request');
    
    const response = await this._makeRequest(messages, options);
    
    if (!options.skipCache && response.choices && response.choices[0]) {
      this.cache.set(cacheKey, response);
    }
    
    return response;
  }

  getStats() {
    return {
      ...this.stats,
      cacheSize: this.cache.keys().length,
      cacheHitRate: this.stats.totalRequests > 0 
        ? ((this.stats.cacheHits / this.stats.totalRequests) * 100).toFixed(2) + '%'
        : '0%'
    };
  }

  clearCache() {
    const keysDeleted = this.cache.keys().length;
    this.cache.flushAll();
    logger.info(`Cleared ${keysDeleted} items from cache`);
    return keysDeleted;
  }
}

module.exports = new GroqClient();