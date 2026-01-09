import {
  PAGE_WIDTH,
  INNER_PADDING,
  CONTENT_WIDTH,
  bgDark,
  reset,
  fg,
  italic,
  printWithBorders,
  stripAnsi,
  wrapText,
  addSpacing
} from './utils.js';
import { applyInlineStyles, stripInlineStyles } from './textStyles.js';

export const renderText = (text, wrap = true) => {
  const maxWidth = CONTENT_WIDTH;

  if (wrap) {
    // Strip markdown for width calculation
    const plainText = stripInlineStyles(text);
    const lines = wrapText(plainText, maxWidth);
    
    let charIndex = 0;
    lines.forEach(line => {
      const endIndex = charIndex + line.length;
      const originalSegment = text.substring(charIndex, endIndex);
      const styledSegment = applyInlineStyles(originalSegment);
      
      const plainLength = stripInlineStyles(styledSegment).length;
      const content = ' '.repeat(INNER_PADDING)
        + styledSegment
        + ' '.repeat(Math.max(0, maxWidth - plainLength))
        + ' '.repeat(INNER_PADDING);
      printWithBorders(content);
      
      charIndex = endIndex;
    });
  } else {
    const plainText = stripInlineStyles(text);
    const displayLine = plainText.length > maxWidth
      ? text.substring(0, maxWidth - 3) + '...'
      : text;

    const styledLine = applyInlineStyles(displayLine);
    const plainLength = stripInlineStyles(styledLine).length;
    const content = ' '.repeat(INNER_PADDING)
      + styledLine
      + ' '.repeat(Math.max(0, maxWidth - plainLength))
      + ' '.repeat(INNER_PADDING);
    printWithBorders(content);
  }
};

export const renderEmptyLine = () => {
  const content = ' '.repeat(INNER_PADDING)
    + ' '.repeat(CONTENT_WIDTH)
    + ' '.repeat(INNER_PADDING);
  printWithBorders(content);
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
    + ' '.repeat(Math.max(0, maxWidth - displayLine.length))
    + reset
    + bgDark
    + ' '.repeat(INNER_PADDING);

  printWithBorders(content);
};