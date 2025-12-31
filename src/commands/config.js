// src/commands/config.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Config file path - now in project root
const CONFIG_PATH = path.join(process.cwd(), 'config.json');

// Default config
const DEFAULT_CONFIG = {
  provider: 'groq',
  model: 'llama-3.3-70b-versatile',
  apiKey: ''
};

/**
 * Load config from file
 */
export function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (error) {
    console.error('Error loading config:', error.message);
  }
  return { ...DEFAULT_CONFIG };
}

/**
 * Save config to file
 */
export function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving config:', error.message);
    return false;
  }
}

/**
 * Set a config value
 */
export function setConfig(key, value) {
  const config = loadConfig();
  
  // Validate inputs
  if (key === 'provider') {
    const validProviders = ['groq', 'anthropic', 'openai'];
    if (!validProviders.includes(value)) {
      throw new Error(`Invalid provider. Must be one of: ${validProviders.join(', ')}`);
    }
  }
  
  if (key === 'model') {
    if (!value || value.trim().length === 0) {
      throw new Error('Model cannot be empty');
    }
  }
  
  if (key === 'apiKey') {
    if (!value || value.trim().length === 0) {
      throw new Error('API key cannot be empty');
    }
  }
  
  config[key] = value;
  return saveConfig(config);
}

/**
 * Get all config values (with API key masked)
 */
export function getConfig() {
  const config = loadConfig();
  return {
    ...config,
    apiKey: config.apiKey ? `***${config.apiKey.slice(-4)}` : 'not set'
  };
}

/**
 * Get full config (with actual API key)
 */
export function getFullConfig() {
  return loadConfig();
}

/**
 * Reset config to defaults
 */
export function resetConfig() {
  return saveConfig({ ...DEFAULT_CONFIG });
}

/**
 * Validate current config
 */
export function validateConfig() {
  const config = loadConfig();
  const errors = [];
  
  if (!config.provider) {
    errors.push('Provider is not set');
  }
  
  if (!config.model) {
    errors.push('Model is not set');
  }
  
  if (!config.apiKey) {
    errors.push('API key is not set');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * CLI command handler
 */
export async function handleConfigCommand(args) {
  const [action, key, ...valueParts] = args;
  const value = valueParts.join(' ');
  
  try {
    switch (action) {
      case 'set':
        if (!key || !value) {
          console.error('Usage: config set <key> <value>');
          process.exit(1);
        }
        setConfig(key, value);
        console.log(`✓ Set ${key} = ${value}`);
        break;
        
      case 'get':
        const config = getConfig();
        console.log('Current configuration:');
        console.log(`  Provider: ${config.provider}`);
        console.log(`  Model: ${config.model}`);
        console.log(`  API Key: ${config.apiKey}`);
        break;
        
      case 'reset':
        resetConfig();
        console.log('✓ Configuration reset to defaults');
        break;
        
      case 'validate':
        const validation = validateConfig();
        if (validation.isValid) {
          console.log('✓ Configuration is valid');
        } else {
          console.error('✗ Configuration errors:');
          validation.errors.forEach(error => console.error(`  - ${error}`));
          process.exit(1);
        }
        break;
        
      default:
        console.error('Usage: config <set|get|reset|validate> [key] [value]');
        process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}