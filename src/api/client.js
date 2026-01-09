// src/api/client.js
// Base API client setup

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { getConfig } from '../commands/env.js';

/**
 * Get API keys from config
 */
export const getApiKeysFromEnv = () => {
  return {
    anthropicApiKey: getConfig('ANTHROPIC_API_KEY'),
    openaiApiKey: getConfig('OPENAI_API_KEY'),
    groqApiKey: getConfig('GROQ_API_KEY'),
  };
};

/**
 * Get current provider from config
 */
export const getCurrentProvider = () => {
  return getConfig('DEFAULT_PROVIDER') || 'groq';
};

/**
 * Get current model from config
 */
export const getCurrentModel = () => {
  return getConfig('DEFAULT_MODEL') || 'llama-3.3-70b-versatile';
};

/**
 * Initialize API clients
 */
export const initializeClients = () => {
  const keys = getApiKeysFromEnv();
  const clients = {};

  // Anthropic (Claude) client
  if (keys.anthropicApiKey) {
    clients.anthropic = new Anthropic({
      apiKey: keys.anthropicApiKey,
    });
  }

  // OpenAI client
  if (keys.openaiApiKey) {
    clients.openai = new OpenAI({
      apiKey: keys.openaiApiKey,
    });
  }

  // Groq client
  if (keys.groqApiKey) {
    clients.groq = new Groq({
      apiKey: keys.groqApiKey,
    });
  }

  return clients;
};

/**
 * Validate API configuration
 */
export const validateApiConfig = () => {
  const provider = getCurrentProvider();
  const model = getCurrentModel();
  const keys = getApiKeysFromEnv();
  
  const errors = [];
  
  if (!provider) {
    errors.push('DEFAULT_PROVIDER not set');
  }
  
  if (!model) {
    errors.push('DEFAULT_MODEL not set');
  }
  
  // Check if the API key for the current provider is set
  if (provider === 'anthropic' && !keys.anthropicApiKey) {
    errors.push('ANTHROPIC_API_KEY not set for anthropic provider');
  }
  
  if (provider === 'openai' && !keys.openaiApiKey) {
    errors.push('OPENAI_API_KEY not set for openai provider');
  }
  
  if (provider === 'groq' && !keys.groqApiKey) {
    errors.push('GROQ_API_KEY not set for groq provider');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};