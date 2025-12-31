// src/ui/render/headers.js
// Convert to ES modules

import {
  PAGE_WIDTH,
  INNER_PADDING,
  fg,
  bgDark,
  bold,
  reset,
  printWithBorders,
  addSpacing
} from './utils.js';

// Heading colors - shades of blue
const headingColors = {
  1: fg(33),  // bright blue
  2: fg(39),  // lighter blue/cyan
  3: fg(27),  // medium blue
};

// Heading counters: [level1, level2, level3]
let headingCounters = [0, 0, 0];

export const renderHeader = (text, level = 1) => {
  if (level < 1 || level > 3) {
    throw new Error('Header level must be between 1 and 3');
  }

  addSpacing();

  // Update counters
  headingCounters[level - 1]++;
  for (let i = level; i < headingCounters.length; i++) {
    headingCounters[i] = 0;
  }

  // Generate number
  const number = headingCounters.slice(0, level).join('.');
  const headingText = `${number} ${text}`;

  // Format with colors
  const maxHeadingWidth = PAGE_WIDTH - (INNER_PADDING * 2);
  const displayText = headingText.length > maxHeadingWidth
    ? headingText.substring(0, maxHeadingWidth - 3) + '...'
    : headingText;

  const content = ' '.repeat(INNER_PADDING)
    + headingColors[level]
    + bold
    + displayText
    + ' '.repeat(maxHeadingWidth - displayText.length)
    + reset
    + bgDark
    + ' '.repeat(INNER_PADDING);

  printWithBorders(content);
};

export const resetHeaderCounters = () => {
  headingCounters = [0, 0, 0];
};