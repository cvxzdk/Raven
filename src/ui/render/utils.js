
import { calculateDimensions } from './frame.js';

export const getPageWidth = () => calculateDimensions().pageWidth;
export const getInnerPadding = () => calculateDimensions().innerPadding;
export const getContentWidth = () => calculateDimensions().contentWidth;
export const getLeftPadding = () => calculateDimensions().leftPadding;

export const PAGE_WIDTH = 100;
export const INNER_PADDING = 5;
export const CONTENT_WIDTH = 90;

export const fg = (n) => `\x1b[38;5;${n}m`;
export const bgDark = '\x1b[48;5;235m';
export const bold = '\x1b[1m';
export const italic = '\x1b[3m';
export const underline = '\x1b[4m';
export const reset = '\x1b[0m';

export const BORDER_CHAR = '│';
export const borderColor = fg(243);

export const getTerminalWidth = () => {
  return process.stdout.columns || 122;
};

export const stripAnsi = (str) => {
  return str.replace(/\x1b\[[0-9;]*m/g, '');
};

export const visibleLength = (str) => {
  return stripAnsi(str).length;
};

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

export const wrapTextResponsive = (text) => {
  const { contentWidth } = calculateDimensions();
  return wrapText(text, contentWidth);
};

export const addSpacing = () => {
  const { contentWidth } = calculateDimensions();
  const spacing = Math.max(1, Math.floor(contentWidth / 3));
  printWithBorders(' '.repeat(spacing));
};