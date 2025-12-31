// src/ui/render/text.js
// Convert to ES modules

import {
  PAGE_WIDTH,
  INNER_PADDING,
  CONTENT_WIDTH,
  bgDark,
  underline,
  reset,
  fg,
  italic,
  printWithBorders,
  stripAnsi,
  wrapText,
  addSpacing
} from './utils.js';

const underlineInlineCode = (line) => {
  return line.replace(/`([^`]+)`/g, (_, code) => underline + code + reset + bgDark);
};

export const renderText = (text, wrap = true) => {
  const maxWidth = CONTENT_WIDTH;

  const processedText = underlineInlineCode(text);

  if (wrap) {
    const plainText = stripAnsi(processedText);
    const lines = wrapText(plainText, maxWidth);

    lines.forEach(line => {
      const content = ' '.repeat(INNER_PADDING)
        + line
        + ' '.repeat(maxWidth - line.length)
        + ' '.repeat(INNER_PADDING);
      printWithBorders(content);
    });
  } else {
    const plainLine = stripAnsi(processedText);
    const displayLine = plainLine.length > maxWidth
      ? plainLine.substring(0, maxWidth - 3) + '...'
      : plainLine;

    const content = ' '.repeat(INNER_PADDING)
      + displayLine
      + ' '.repeat(maxWidth - displayLine.length)
      + ' '.repeat(INNER_PADDING);
    printWithBorders(content);
  }
};

export const renderEmptyLine = () => {
  printWithBorders(' '.repeat(PAGE_WIDTH));
};

export const renderBlockquote = (text) => {
  addSpacing();

  const maxWidth = CONTENT_WIDTH;
  const displayLine = text.length > maxWidth
    ? text.substring(0, maxWidth - 3) + '...'
    : text;

  const content = ' '.repeat(INNER_PADDING)
    + fg(244)
    + italic
    + displayLine
    + ' '.repeat(maxWidth - displayLine.length)
    + reset
    + bgDark
    + ' '.repeat(INNER_PADDING);

  printWithBorders(content);
};