import {
  PAGE_WIDTH,
  INNER_PADDING,
  CONTENT_WIDTH,
  fg,
  bgDark,
  reset,
  printWithBorders,
  stripAnsi,
  addSpacing
} from './utils.js';

import { highlight } from 'cli-highlight';


function wrapLineWithAnsi(line, maxWidth) {
  const plainLine = stripAnsi(line);
  
  if (plainLine.length <= maxWidth) {
    return [line];
  }
  
  const wrappedLines = [];
  let currentPlainText = '';
  let currentLineWithAnsi = '';
  let ansiState = ''; 
  let inAnsi = false;
  let ansiBuffer = '';
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '\x1b') {
      inAnsi = true;
      ansiBuffer = char;
      continue;
    }
    
    if (inAnsi) {
      ansiBuffer += char;
      if (char === 'm') {
        inAnsi = false;
        ansiState = ansiBuffer; 
        currentLineWithAnsi += ansiBuffer;
        ansiBuffer = '';
      }
      continue;
    }
    
    currentPlainText += char;
    currentLineWithAnsi += char;
    
    if (currentPlainText.length >= maxWidth) {
      wrappedLines.push(currentLineWithAnsi + reset);
      currentPlainText = '';
      currentLineWithAnsi = ansiState; 
    }
  }

  if (currentPlainText.length > 0) {
    wrappedLines.push(currentLineWithAnsi);
  }
  
  return wrappedLines.length > 0 ? wrappedLines : [''];
}

export const renderCodeBlock = (code, language = 'javascript') => {
  addSpacing();
  
  const codeColor = fg(244);
  const lineNumColor = fg(240);
  
  const lines = code.split('\n');
  const maxLineNum = lines.length;
  const lineNumWidth = String(maxLineNum).length;
  const codeWidth = CONTENT_WIDTH - lineNumWidth - 5;
  
  const topBorder = ' '.repeat(INNER_PADDING) 
    + codeColor 
    + '┌' 
    + '─'.repeat(CONTENT_WIDTH - 2) 
    + '┐' 
    + reset 
    + bgDark 
    + ' '.repeat(INNER_PADDING);
  printWithBorders(topBorder);
  
  const langText = language || 'text';
  const langLine = ' '.repeat(INNER_PADDING) 
    + codeColor 
    + '│ ' 
    + reset 
    + bgDark 
    + fg(250) 
    + langText 
    + reset 
    + bgDark 
    + ' '.repeat(CONTENT_WIDTH - 4 - langText.length) 
    + codeColor 
    + ' │' 
    + reset 
    + bgDark 
    + ' '.repeat(INNER_PADDING);
  printWithBorders(langLine);
  
  lines.forEach((line, index) => {
    let highlightedLine = line;

    if (line.trim()) {
      try {
        highlightedLine = highlight(line, { 
          language: language,
          ignoreIllegals: true
        });
        highlightedLine = highlightedLine.replace(/\n$/, '');
      } catch (e) {
        highlightedLine = line;
      }
    }
    
    const lineNum = String(index + 1).padStart(lineNumWidth, ' ');
    
    const wrappedLines = wrapLineWithAnsi(highlightedLine, codeWidth);
    
    wrappedLines.forEach((wrappedLine, wrapIndex) => {
      const displayLineNum = wrapIndex === 0 ? lineNum : ' '.repeat(lineNumWidth);
      const visibleLen = stripAnsi(wrappedLine).length;
      const padding = Math.max(0, codeWidth - visibleLen);
      
      const codeLine = ' '.repeat(INNER_PADDING) 
        + codeColor 
        + '│ '
        + lineNumColor 
        + displayLineNum 
        + reset
        + bgDark
        + ' '
        + wrappedLine 
        + reset
        + bgDark
        + ' '.repeat(padding)
        + ' '
        + codeColor 
        + '│'
        + reset 
        + bgDark 
        + ' '.repeat(INNER_PADDING);
      
      printWithBorders(codeLine);
    });
  });
  
  const bottomBorder = ' '.repeat(INNER_PADDING) 
    + codeColor 
    + '└' 
    + '─'.repeat(CONTENT_WIDTH - 2) 
    + '┘' 
    + reset 
    + bgDark 
    + ' '.repeat(INNER_PADDING);
  printWithBorders(bottomBorder);
};