const chalk = require('chalk');
const config = require('./config');

const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

const currentLevel = levels[config.logging.level] || levels.info;

class Logger {
  debug(message, ...args) {
    if (currentLevel <= levels.debug) {
      console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
    }
  }

  info(message, ...args) {
    if (currentLevel <= levels.info) {
      console.log(chalk.blue(`[INFO] ${message}`), ...args);
    }
  }

  warn(message, ...args) {
    if (currentLevel <= levels.warn) {
      console.log(chalk.yellow(`[WARN] ${message}`), ...args);
    }
  }

  error(message, ...args) {
    if (currentLevel <= levels.error) {
      console.error(chalk.red(`[ERROR] ${message}`), ...args);
    }
  }

  spinner(text) {
    const ora = require('ora');
    return ora(text).start();
  }
}

module.exports = new Logger();