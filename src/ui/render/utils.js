// src/ui/render/utils.js
// Shared utilities for all renderers

// Page configuration
export const PAGE_WIDTH = 100;
export const INNER_PADDING = 5;
export const CONTENT_WIDTH = PAGE_WIDTH - (INNER_PADDING * 2);

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

// Calculate left padding for centering
export const getLeftPadding = () => {
  const termWidth = getTerminalWidth();
  const pageWidth = PAGE_WIDTH + 2;
  const padding = Math.max(0, Math.floor((termWidth - pageWidth) / 2));
  return padding;
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
    // If the word itself is longer than maxWidth, break it into chunks
    if (word.length > maxWidth) {
      // First, add current line if it has content
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      
      // Break the long word (like URLs) into chunks
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

// Add spacing between sections
export const addSpacing = () => {
  printWithBorders(' '.repeat(PAGE_WIDTH));
};