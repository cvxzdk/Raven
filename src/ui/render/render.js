export * from './utils.js';
export * from './frame.js';
export * from './headers.js';
export * from './comments.js';
export * from './bullets.js';
export * from './tables.js';
export * from './codeblocks.js';
export * from './quiz.js';
export * from './hr.js';
export * from './text.js';
export * from './textStyles.js';

import { printPageBorder, addSpacing } from './utils.js';
import {
  renderHeader,
  resetHeaderCounters
} from './headers.js';
import {
  renderText
} from './text.js';
import {
  renderCodeBlock
} from './codeblocks.js';
import {
  renderBulletList,
  renderOrderedList
} from './bullets.js';
import {
  renderTableFromMarkdown
} from './tables.js';
import {
  renderHR
} from './hr.js';
import {
  renderComment
} from './comments.js';
import {
  renderEmptyLine,
  renderBlockquote
} from './text.js';

export {
  getTerminalSize,
  calculateDimensions,
  getCurrentDimensions,
  createTopBorder,
  createBottomBorder,
  createSeparator,
  createLeftBorder,
  createRightBorder,
  wrapWithBorders,
  padContent,
  wrapTextToWidth,
  createFrame,
  getFrameDimensions,
  onTerminalResize,
  handleResize
} from './frame.js';

/**
 * @param {Array} blocks - Array of parsed block objects from parseMarkdown()
 */
export function renderParsedContent(blocks) {
  for (const block of blocks) {
    switch (block.type) {
      case 'header':
        renderHeader(block.content, block.level);
        break;
      
      case 'text':
        renderText(block.content);
        break;
      
      case 'codeblock':
        renderCodeBlock(block.content, block.language);
        break;
      
      case 'bulletlist':
        renderBulletList(block.items);
        break;
      
      case 'orderedlist':
        renderOrderedList(block.items);
        break;
      
      case 'table':
        renderTableFromMarkdown(block.content);
        break;
      
      case 'blockquote':
        renderBlockquote(block.content);
        break;
      
      case 'hr':
        renderHR();
        break;
      
      case 'comment':
        renderComment(block.content);
        break;
      
      case 'empty':
        renderEmptyLine();
        break;
      
      default:
        break;
    }
  }
}

/**
 * @param {string} role - 'user' or 'assistant'
 * @param {string} content - Raw message content
 * @param {Function} parseFunction - Function to parse content
 */
export function renderMessage(role, content, parseFunction) {
  const rolePrefix = role === 'user' ? '👤 You' : '🤖 Assistant';
  renderHeader(rolePrefix, 2);
  
  if (parseFunction) {
    const blocks = parseFunction(content);
    renderParsedContent(blocks);
  } else {
    renderText(content);
  }
  
  addSpacing();
}

export const startDocument = () => {
  printPageBorder();
};

export const endDocument = () => {
  printPageBorder();
};