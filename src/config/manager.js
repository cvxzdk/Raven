// src/config/manager.js
// Configuration manager using .env

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to .env file in project root
const ENV_PATH = path.join(__dirname, '../../.env');

/**
 * Parse .env file into object
 */
function parseEnvFile() {
  if (!fs.existsSync(ENV_PATH)) {
    return {};
  }
  
  const content = fs.readFileSync(ENV_PATH, 'utf-8');
  const config = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    
    // Skip empty lines and comments
    if (!line || line.startsWith('#')) return;
    
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=').trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      config[key.trim()] = value;
    }
  });
  
  return config;
}

/**
 * Write config to .env file
 */
function writeEnvFile(config) {
  const lines = [];
  
  lines.push('# Raven CLI Configuration');
  lines.push('# Generated automatically - you can edit this file');
  lines.push('');
  
  lines.push('# API Keys');
  lines.push(`ANTHROPIC_API_KEY=${config.ANTHROPIC_API_KEY || ''}`);
  lines.push(`OPENAI_API_KEY=${config.OPENAI_API_KEY || ''}`);
  lines.push(`GROQ_API_KEY=${config.GROQ_API_KEY || ''}`);
  lines.push('');
  
  lines.push('# Default Settings');
  lines.push(`DEFAULT_PROVIDER=${config.DEFAULT_PROVIDER || 'groq'}`);
  lines.push(`DEFAULT_MODEL=${config.DEFAULT_MODEL || 'llama-3.3-70b-versatile'}`);
  
  fs.writeFileSync(ENV_PATH, lines.join('\n'), 'utf-8');
}

/**
 * Get configuration value
 */
export function getConfig(key) {
  const config = parseEnvFile();
  
  // Also check process.env as fallback
  return config[key] || process.env[key] || null;
}

/**
 * Set configuration value
 */
export function setConfig(key, value) {
  const config = parseEnvFile();
  config[key] = value;
  writeEnvFile(config);
}

/**
 * Get all configuration
 */
export function getAllConfig() {
  return parseEnvFile();
}

/**
 * Initialize default config if not exists
 */
export function initializeConfig() {
  if (!fs.existsSync(ENV_PATH)) {
    const defaultConfig = {
      ANTHROPIC_API_KEY: '',
      OPENAI_API_KEY: '',
      GROQ_API_KEY: '',
      DEFAULT_PROVIDER: 'groq',
      DEFAULT_MODEL: 'llama-3.3-70b-versatile'
    };
    writeEnvFile(defaultConfig);
    console.log('✅ Created .env file - please add your API keys');
  }
}

/**
 * Display current configuration
 */
export function displayConfig() {
  const config = getAllConfig();
  
  console.log('\n📋 Current Configuration:\n');
  
  console.log('API Keys:');
  console.log(`  ANTHROPIC_API_KEY: ${config.ANTHROPIC_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`  OPENAI_API_KEY: ${config.OPENAI_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`  GROQ_API_KEY: ${config.GROQ_API_KEY ? '✓ Set' : '✗ Not set'}`);
  
  console.log('\nDefault Settings:');
  console.log(`  DEFAULT_PROVIDER: ${config.DEFAULT_PROVIDER || 'not set'}`);
  console.log(`  DEFAULT_MODEL: ${config.DEFAULT_MODEL || 'not set'}`);
  console.log('\n💡 Edit .env file or use: raven config-set <key> <value>\n');
}
