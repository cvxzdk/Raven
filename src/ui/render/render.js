// src/ui/render/index.js
// Main export file - ES modules

export * from './utils.js';
export * from './headers.js';
export * from './comments.js';
export * from './bullets.js';
export * from './tables.js';
export * from './codeblocks.js';
export * from './quiz.js';
export * from './hr.js';
export * from './text.js';

// Document control functions
import { printPageBorder } from './utils.js';

export const startDocument = () => {
  printPageBorder();
};

export const endDocument = () => {
  printPageBorder();
};