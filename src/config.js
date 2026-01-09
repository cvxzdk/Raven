import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV_PATH = path.join(__dirname, '../../.env');

function parseEnvFile() {
  if (!fs.existsSync(ENV_PATH)) {
    return {};
  }
  
  const content = fs.readFileSync(ENV_PATH, 'utf-8');
  const config = {};
  
  content.split('\n').forEach(line => {
    line = line.trim();
    
    if (!line || line.startsWith('#')) return;
    
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      let value = valueParts.join('=').trim();
      
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      config[key.trim()] = value;
    }
  });
  
  return config;
}

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

export function getConfig(key) {
  const config = parseEnvFile();
  return config[key] || process.env[key] || null;
}


export function setConfig(key, value) {
  const config = parseEnvFile();
  config[key] = value;
  writeEnvFile(config);
}

export function getAllConfig() {
  return parseEnvFile();
}

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
    console.log('Created .env file - please add your API keys');
  }
}

export function displayConfig() {
  const config = getAllConfig();
  
  console.log('\nCurrent Configuration:\n');
  
  console.log('API Keys:');
  console.log(`  ANTHROPIC_API_KEY: ${config.ANTHROPIC_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`  OPENAI_API_KEY: ${config.OPENAI_API_KEY ? '✓ Set' : '✗ Not set'}`);
  console.log(`  GROQ_API_KEY: ${config.GROQ_API_KEY ? '✓ Set' : '✗ Not set'}`);
  
  console.log('\nDefault Settings:');
  console.log(`  DEFAULT_PROVIDER: ${config.DEFAULT_PROVIDER || 'not set'}`);
  console.log(`  DEFAULT_MODEL: ${config.DEFAULT_MODEL || 'not set'}`);
  console.log('\nEdit .env file or use: raven config-set <key> <value>\n');
}