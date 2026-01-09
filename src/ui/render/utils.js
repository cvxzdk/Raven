
import { calculateDimensions, wrapWithBorders as frameWrapWithBorders } from './frame.js';

// Export dynamic getters from frame.js
export const getPageWidth = () => calculateDimensions().pageWidth;
export const getInnerPadding = () => calculateDimensions().innerPadding;
export const getContentWidth = () => calculateDimensions().contentWidth;
export const getLeftPadding = () => calculateDimensions().leftPadding;

// Keep these for backward compatibility
export const PAGE_WIDTH = 100;
export const INNER_PADDING = 5;
export const CONTENT_WIDTH = 90;

// 256-color helpers
export const fg = (n) => `\x1b[38;5;${n}m`;
export const bgDark = '\x1b[48;5;235m';
export const bold = '\x1b[1m';
export const italic = '\x1b[3m';
export const underline = '\x1b[4m';
export const reset = '\x1b[0m';

// Border characters
export const BORDER_CHAR = '│';
export const borderColor = fg(243);

// Get terminal width
export const getTerminalWidth = () => {
  return process.stdout.columns || 122;
};

// Strip ANSI codes for accurate length
export const stripAnsi = (str) => {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
};

// Get visible length
export const visibleLength = (str) => {
  return stripAnsi(str).length;
};

// Print line with page borders and centering
export const printWithBorders = (content) => {
  const leftPadding = ' '.repeat(getLeftPadding());
  const leftBorder = bgDark + borderColor + BORDER_CHAR;
  const rightBorder = borderColor + BORDER_CHAR + reset;

  const contentLen = visibleLength(content);
  const padding = PAGE_WIDTH - contentLen;
  const paddedContent = bgDark + content + ' '.repeat(Math.max(0, padding));

  console.log(leftPadding + leftBorder + paddedContent + rightBorder);
};

// Print top/bottom page border
export const printPageBorder = () => {
  const leftPadding = ' '.repeat(getLeftPadding());
  const line = bgDark + borderColor + BORDER_CHAR + '═'.repeat(PAGE_WIDTH) + BORDER_CHAR + reset;
  console.log(leftPadding + line);
};

// Wrap text to multiple lines - FIXED to handle long URLs and words
export const wrapText = (text, maxWidth) => {
  if (text.length <= maxWidth) return [text];

  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (word.length > maxWidth) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      
      for (let i = 0; i < word.length; i += maxWidth) {
        const chunk = word.substring(i, i + maxWidth);
        lines.push(chunk);
      }
      continue;
    }
    
    const testLine = currentLine ? currentLine + ' ' + word : word;
    if (testLine.length <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [''];
};

// Responsive text wrapping - uses terminal dimensions
export const wrapTextResponsive = (text) => {
  const { contentWidth } = calculateDimensions();
  return wrapText(text, contentWidth);
};

// Add spacing between sections (flexible for any terminal size)
export const addSpacing = () => {
  const { contentWidth } = calculateDimensions();
  const spacing = Math.max(1, Math.floor(contentWidth / 3));
  printWithBorders(' '.repeat(spacing));
};