import { AnthropicProvider } from './anthropic.js';
import { OpenAIProvider } from './openai.js';
import { GroqProvider } from './groq.js';

const providerClasses = {
  anthropic: AnthropicProvider,
  openai: OpenAIProvider,
  groq: GroqProvider
};

const providers = new Map();

export const registerProvider = (name, client) => {
  const ProviderClass = providerClasses[name];
  if (!ProviderClass) throw new Error(`Unknown provider: ${name}`);
  providers.set(name, new ProviderClass(client));
};

export const getProvider = (name) => {
  const provider = providers.get(name);
  if (!provider) throw new Error(`Provider not initialized: ${name}`);
  return provider;
};
