const readline = require('readline');
const chalk = require('chalk');
const groqClient = require('./groq-client');
const logger = require('./logger');

class Chat {
  constructor() {
    this.conversationHistory = [];
    this.systemPrompt = {
      role: 'system',
      content: 'You are Raven, an expert AI coding assistant. Help users with coding questions, explain concepts, generate code, debug issues, and provide guidance. Be concise but thorough.'
    };
    this.rl = null;
  }

  clearScreen() {
    console.clear();
    process.stdout.write('\x1Bc');
  }

  centerText(text, width = null) {
    const termWidth = width || process.stdout.columns || 80;
    // Strip ANSI codes to get real text length
    const strippedText = text.replace(/\x1B\[[0-9;]*m/g, '');
    const padding = Math.max(0, Math.floor((termWidth - strippedText.length) / 2));
    return ' '.repeat(padding) + text;
  }

  showWelcome() {
    this.clearScreen();
    
    const termWidth = process.stdout.columns || 80;
    const boxText = '═══════════════════════════════════════════';
    const titleText = '          RAVEN AI CHAT MODE           ';
    
    console.log();
    console.log(this.centerText(chalk.bold.green('╔' + boxText + '╗')));
    console.log(this.centerText(chalk.bold.green('║') + chalk.bold.white(titleText) + chalk.bold.green('║')));
    console.log(this.centerText(chalk.bold.green('╚' + boxText + '╝')));
    console.log();
    console.log(this.centerText(chalk.gray('Type your message and press Enter')));
    console.log(this.centerText(chalk.gray('Commands: /clear (new chat), /exit (quit)')));
    console.log();
  }

  async sendMessage(userMessage) {
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    const messages = [this.systemPrompt, ...this.conversationHistory];
    const spinner = logger.spinner('Thinking...');

    try {
      const response = await groqClient.chat(messages, { skipCache: true });
      const assistantMessage = response.choices[0].message.content;
      
      spinner.stop();
      
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage
      });

      return assistantMessage;
    } catch (error) {
      spinner.stop();
      throw error;
    }
  }

  async start() {
    this.showWelcome();

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.bold.cyan('You: ')
    });

    this.rl.prompt();

    this.rl.on('line', async (input) => {
      const message = input.trim();

      if (!message) {
        this.rl.prompt();
        return;
      }

      if (message === '/exit' || message === '/quit') {
        console.log(chalk.yellow('\nGoodbye!\n'));
        this.rl.close();
        process.exit(0);
      }

      if (message === '/clear' || message === '/new') {
        this.conversationHistory = [];
        this.showWelcome();
        this.rl.prompt();
        return;
      }

      if (message === '/help') {
        console.log(chalk.cyan('\nCommands:'));
        console.log('  /clear or /new  - Start new conversation');
        console.log('  /exit or /quit  - Exit Raven');
        console.log('  /help           - Show this help\n');
        this.rl.prompt();
        return;
      }

      try {
        const response = await this.sendMessage(message);
        console.log(chalk.bold.magenta('\nRaven: ') + chalk.white(response) + '\n');
      } catch (error) {
        console.log(chalk.red('\nError: ') + error.message + '\n');
      }

      this.rl.prompt();
    });

    this.rl.on('close', () => {
      console.log(chalk.yellow('\nGoodbye!\n'));
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log(chalk.yellow('\n\nGoodbye!\n'));
      process.exit(0);
    });
  }
}

module.exports = Chat;