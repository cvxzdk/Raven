#!/usr/bin/env node

import { program } from 'commander';
import { startChat } from './src/ui/views/chat.js';
import { initializeConfig, getConfig, setConfig, displayConfig } from './src/commands/env.js';

initializeConfig();

program
  .name('raven')
  .description('Raven CLI - AI Chat Interface')
  .version('0.1.0');

program
  .command('chat')
  .description('Start chat interface')
  .action(async () => {
    try {
      await startChat();
    } catch (error) {
      console.error('Failed to start chat:', error.message);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Manage configuration')
  .action(() => {
    displayConfig();
  });

program
  .command('config-set <key> <value>')
  .description('Set configuration value')
  .action((key, value) => {
    setConfig(key, value);
    console.log('Set', key);
  });

program
  .command('config-get <key>')
  .description('Get configuration value')
  .action((key) => {
    const value = getConfig(key);
    console.log(value || '(not set)');
  });

program.parse();