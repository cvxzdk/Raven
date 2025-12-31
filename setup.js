const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n╔════════════════════════════════════════╗');
console.log('║      RAVEN CLI SETUP WIZARD            ║');
console.log('╚════════════════════════════════════════╝\n');

rl.question('Enter your Groq API key (get it from https://console.groq.com/keys): ', (apiKey) => {
  if (!apiKey || apiKey.trim() === '') {
    console.log('\nError: API key is required!');
    process.exit(1);
  }

  const homeDir = process.env.USERPROFILE || process.env.HOME;
  const configDir = path.join(homeDir, '.raven');
  const envFile = path.join(configDir, '.env');

  // Create directory if it doesn't exist
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  // Create .env file
  const envContent = `GROQ_API_KEY=${apiKey.trim()}
GROQ_MODEL=llama-3.3-70b-versatile
CACHE_MAX_SIZE=100
CACHE_TTL_SECONDS=300
LOG_LEVEL=info
`;

  fs.writeFileSync(envFile, envContent, 'utf8');

  console.log('\n✓ Configuration saved to:', envFile);
  console.log('\n✓ Setup complete! You can now use "raven" from anywhere.\n');
  console.log('Try it: raven\n');

  rl.close();
});