import {
  PAGE_WIDTH,
  INNER_PADDING,
  CONTENT_WIDTH,
  bgDark,
  reset,
  printWithBorders,
  stripAnsi,
  wrapText,
  addSpacing
} from './utils.js';
import { applyInlineStyles } from './textStyles.js';

export const renderText = (text, wrap = true) => {
  const maxWidth = CONTENT_WIDTH;

  const styledText = applyInlineStyles(text);

  if (wrap) {
    const plainText = stripAnsi(text);
    const lines = wrapText(plainText, maxWidth);
    
    let charIndex = 0;
    lines.forEach(line => {
      const endIndex = charIndex + line.length;
      const originalSegment = text.substring(charIndex, endIndex);
      const styledSegment = applyInlineStyles(originalSegment);
      
      const content = ' '.repeat(INNER_PADDING)
        + styledSegment
        + ' '.repeat(maxWidth - stripAnsi(styledSegment).length)
        + ' '.repeat(INNER_PADDING);
      printWithBorders(content);
      
      charIndex = endIndex;
    });
  } else {
    const plainLine = stripAnsi(styledText);
    const displayLine = plainLine.length > maxWidth
      ? plainLine.substring(0, maxWidth - 3) + '...'
      : plainLine;

    const styledLine = applyInlineStyles(displayLine);
    const content = ' '.repeat(INNER_PADDING)
      + styledLine
      + ' '.repeat(maxWidth - stripAnsi(styledLine).length)
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