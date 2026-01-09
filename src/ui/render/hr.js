import {
  PAGE_WIDTH,
  INNER_PADDING,
  CONTENT_WIDTH,
  fg,
  bgDark,
  reset,
  printWithBorders,
  addSpacing
} from './utils.js';

export const renderHR = () => {
  addSpacing();

  const hrContent = ' '.repeat(INNER_PADDING)
    + fg(244)
    + '─'.repeat(CONTENT_WIDTH)
    + reset
    + bgDark
    + ' '.repeat(INNER_PADDING);

  printWithBorders(hrContent);
};