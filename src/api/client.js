import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import Groq from 'groq-sdk';
import { getConfig } from '../commands/env.js';

export const getApiKeysFromEnv = () => {
  return {
    anthropicApiKey: getConfig('ANTHROPIC_API_KEY'),
    openaiApiKey: getConfig('OPENAI_API_KEY'),
    groqApiKey: getConfig('GROQ_API_KEY'),
  };
};

export const getCurrentProvider = () => {
  return getConfig('DEFAULT_PROVIDER') || 'groq';
};

export const getCurrentModel = () => {
  return getConfig('DEFAULT_MODEL') || 'llama-3.3-70b-versatile';
};

export const initializeClients = () => {
  const keys = getApiKeysFromEnv();
  const clients = {};

  if (keys.anthropicApiKey) {
    clients.anthropic = new Anthropic({
      apiKey: keys.anthropicApiKey,
    });
  }

  if (keys.openaiApiKey) {
    clients.openai = new OpenAI({
      apiKey: keys.openaiApiKey,
    });
  }

  if (keys.groqApiKey) {
    clients.groq = new Groq({
      apiKey: keys.groqApiKey,
    });
  }

  return clients;
};

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