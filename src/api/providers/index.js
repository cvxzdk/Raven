// src/api/providers/index.js
import { AnthropicProvider } from './anthropic.js';
import { OpenAIProvider } from './openai.js';
import { GroqProvider } from './groq.js';

const providers = new Map();

export const registerProvider = (name, client) => {
  switch (name) {
    case 'anthropic':
      providers.set(name, new AnthropicProvider(client));
      break;
    case 'openai':
      providers.set(name, new OpenAIProvider(client));
      break;
    case 'groq':
      providers.set(name, new GroqProvider(client));
      break;
    default:
      throw new Error(`Unknown provider: ${name}`);
  }
};

export const getProvider = (name) => {
  const provider = providers.get(name);
  if (!provider) {
    throw new Error(`Provider not initialized: ${name}`);
  }
  return provider;
};