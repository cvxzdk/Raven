// src/ui/render/bullets.js
// Convert to ES modules

import {
  PAGE_WIDTH,
  INNER_PADDING,
  CONTENT_WIDTH,
  fg,
  bgDark,
  reset,
  printWithBorders,
  wrapText,
  addSpacing
} from './utils.js';

export const renderBulletList = (items) => {
  addSpacing();
  
  const bulletColor = fg(250);
  const maxWidth = CONTENT_WIDTH - 4;
  
  items.forEach(item => {
    const wrappedLines = wrapText(item, maxWidth);
    
    wrappedLines.forEach((line, idx) => {
      const bullet = idx === 0 ? '• ' : '  ';
      const content = ' '.repeat(INNER_PADDING) 
        + bulletColor 
        + bullet 
        + reset 
        + bgDark 
        + line 
        + ' '.repeat(maxWidth - line.length) 
        + ' '.repeat(INNER_PADDING);
      
      printWithBorders(content);
    });
  });
};

export const renderOrderedList = (items) => {
  addSpacing();
  
  const numberColor = fg(250);
  const maxNumWidth = String(items.length).length + 2;
  const maxWidth = CONTENT_WIDTH - maxNumWidth - 2;
  
  items.forEach((item, index) => {
    const wrappedLines = wrapText(item, maxWidth);
    const num = `${index + 1}. `;
    
    wrappedLines.forEach((line, idx) => {
      const prefix = idx === 0 ? num : ' '.repeat(num.length);
      const content = ' '.repeat(INNER_PADDING) 
        + numberColor 
        + prefix 
        + reset 
        + bgDark 
        + line 
        + ' '.repeat(maxWidth - line.length) 
        + ' '.repeat(INNER_PADDING);
      
      printWithBorders(content);
    });
  });
};