const path = require('path');
const fs = require('fs');

// Try multiple .env locations
const envLocations = [
  path.join(process.cwd(), '.env'),                                          // Current directory
  path.join(__dirname, '..', '.env'),                                        // Project directory  
  path.join(process.env.USERPROFILE || process.env.HOME, '.raven', '.env'), // ~/.raven/.env
  path.join(process.env.APPDATA || process.env.HOME, 'raven', '.env')       // AppData/raven/.env
];

// Load first .env file found
for (const envPath of envLocations) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
    break;
  }
}

const config = {
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    apiUrl: 'https://api.groq.com/openai/v1/chat/completions',
    maxTokens: 2048,
    temperature: 0.7
  },
  
  cache: {
    maxSize: parseInt(process.env.CACHE_MAX_SIZE) || 100,
    ttl: parseInt(process.env.CACHE_TTL_SECONDS) || 300
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

if (!config.groq.apiKey) {
  console.error('\nError: GROQ_API_KEY not found!\n');
  console.log('Setup options:\n');
  console.log('Option 1 - Set environment variable (recommended):');
  console.log('  setx GROQ_API_KEY "your_key_here"\n');
  console.log('Option 2 - Create config file:');
  console.log('  mkdir %USERPROFILE%\\.raven');
  console.log('  echo GROQ_API_KEY=your_key_here > %USERPROFILE%\\.raven\\.env\n');
  console.log('Get your API key: https://console.groq.com/keys\n');
  process.exit(1);
}

module.exports = config;