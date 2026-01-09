import {
  PAGE_WIDTH,
  INNER_PADDING,
  fg,
  bgDark,
  italic,
  reset,
  printWithBorders,
  addSpacing
} from './utils.js';

export const renderComment = (text) => {
  addSpacing();

  const maxWidth = PAGE_WIDTH - (INNER_PADDING * 2);
  const displayLine = text.length > maxWidth
    ? text.substring(0, maxWidth - 3) + '...'
    : text;

  const content = ' '.repeat(INNER_PADDING)
    + italic 
    + fg(245)
    + displayLine
    + ' '.repeat(maxWidth - displayLine.length)
    + reset
    + bgDark
    + ' '.repeat(INNER_PADDING);

  printWithBorders(content);
};