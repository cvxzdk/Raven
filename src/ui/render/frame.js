import {
  fg,
  bgDark,
  reset,
  BORDER_CHAR,
  stripAnsi
} from './utils.js';

const getBorderColor = () => fg(243);

const IDEAL_PAGE_WIDTH = 100;
const IDEAL_INNER_PADDING = 5;
const MIN_INNER_PADDING = 1;
const MINIMUM_CONTENT_WIDTH = 20;



export const getTerminalSize = () => {
  return {
    width: process.stdout.columns || 80,
    height: process.stdout.rows || 24
  };
};


export const calculateDimensions = () => {
  const termWidth = getTerminalSize().width;
  
  let pageWidth, innerPadding, contentWidth, leftPadding;

  if (termWidth >= IDEAL_PAGE_WIDTH + (IDEAL_INNER_PADDING * 2) + 2) {
    pageWidth = IDEAL_PAGE_WIDTH;
    innerPadding = IDEAL_INNER_PADDING;
    contentWidth = pageWidth - (innerPadding * 2);
    leftPadding = Math.floor((termWidth - pageWidth - 2) / 2);
  }
  else if (termWidth >= MINIMUM_CONTENT_WIDTH + 10) {

    const availableWidth = termWidth - 2;
    
    innerPadding = Math.max(
      MIN_INNER_PADDING, 
      Math.floor(availableWidth * 0.05)
    );
    
    pageWidth = availableWidth - (innerPadding * 2);
    contentWidth = pageWidth - (innerPadding * 2);
    
    leftPadding = Math.max(0, Math.floor((termWidth - pageWidth - 2) / 2));
  }
  else {
    innerPadding = MIN_INNER_PADDING;
    pageWidth = Math.max(MINIMUM_CONTENT_WIDTH, termWidth - 4);
    contentWidth = pageWidth - (innerPadding * 2);
    leftPadding = 1; // Minimal centering for very small terminals
  }
  
  return {
    pageWidth,
    contentWidth,
    innerPadding,
    leftPadding,
    terminalWidth: termWidth,
    isSmallTerminal: termWidth < 60,
    isMediumTerminal: termWidth >= 60 && termWidth < 100,
    isLargeTerminal: termWidth >= 100
  };
};

export const getCurrentDimensions = () => calculateDimensions();

export const createTopBorder = () => {
  const { innerPadding, contentWidth } = calculateDimensions();
  return ' '.repeat(innerPadding)
    + getBorderColor()
    + '┌'
    + '─'.repeat(contentWidth)
    + '┐'
    + reset
    + bgDark
    + ' '.repeat(innerPadding);
};

export const createBottomBorder = () => {
  const { innerPadding, contentWidth } = calculateDimensions();
  return ' '.repeat(innerPadding)
    + getBorderColor()
    + '└'
    + '─'.repeat(contentWidth)
    + '┘'
    + reset
    + bgDark
    + ' '.repeat(innerPadding);
};

export const createSeparator = () => {
  const { innerPadding, contentWidth } = calculateDimensions();
  return ' '.repeat(innerPadding)
    + getBorderColor()
    + '├'
    + '─'.repeat(contentWidth)
    + '┤'
    + reset
    + bgDark
    + ' '.repeat(innerPadding);
};

export const createLeftBorder = () => {
  return bgDark + getBorderColor() + BORDER_CHAR + reset + bgDark;
};

export const createRightBorder = () => {
  return getBorderColor() + BORDER_CHAR + reset;
};

export const wrapWithBorders = (content) => {
  const { leftPadding } = calculateDimensions();
  const leftBorder = createLeftBorder();
  const rightBorder = createRightBorder();
  
  return ' '.repeat(leftPadding) + leftBorder + content + rightBorder;
};

export const padContent = (content, align = 'left') => {
  const { contentWidth } = calculateDimensions();
  const plainContent = stripAnsi(content);
  const currentLength = plainContent.length;
  
  if (currentLength >= contentWidth) {
    const truncated = plainContent.substring(0, contentWidth - 3) + '...';
    return truncated;
  }
  
  const padding = contentWidth - currentLength;
  
  switch (align) {
    case 'center':
      const leftPad = Math.floor(padding / 2);
      const rightPad = padding - leftPad;
      return ' '.repeat(leftPad) + content + ' '.repeat(rightPad);
    case 'right':
      return ' '.repeat(padding) + content;
    default: 
      return content + ' '.repeat(padding);
  }
};

export const wrapTextToWidth = (text) => {
  const { contentWidth } = calculateDimensions();
  
  if (!text || text.length === 0) return [''];
  
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';
  
  for (const word of words) {
    if (word.length > contentWidth) {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      for (let i = 0; i < word.length; i += contentWidth - 3) {
        const chunk = word.substring(i, i + contentWidth - 3);
        lines.push(chunk + (i + contentWidth - 3 < word.length ? '...' : ''));
      }
      continue;
    }
    
    const testLine = currentLine ? currentLine + ' ' + word : word;
    
    if (testLine.length <= contentWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) lines.push(currentLine);
  return lines.length > 0 ? lines : [''];
};

export const createFrame = (lines, title = null) => {
  const { innerPadding, contentWidth } = calculateDimensions();
  const frameLines = [];
  frameLines.push(createTopBorder());
  if (title) {
    const titleLength = stripAnsi(title).length;
    const titleLine = ' '.repeat(innerPadding)
      + getBorderColor()
      + '│ '
      + reset
      + bgDark
      + fg(250)
      + title
      + reset
      + bgDark
      + ' '.repeat(Math.max(0, contentWidth - titleLength - 2))
      + getBorderColor()
      + ' │'
      + reset
      + bgDark
      + ' '.repeat(innerPadding);
    
    frameLines.push(titleLine);
    frameLines.push(createSeparator());
  }
  
  lines.forEach(line => {
    frameLines.push(line);
  });
  
  frameLines.push(createBottomBorder());
  
  return frameLines;
};

export const getFrameDimensions = () => {
  const dims = calculateDimensions();
  return {
    pageWidth: dims.pageWidth,
    contentWidth: dims.contentWidth,
    innerPadding: dims.innerPadding,
    leftPadding: dims.leftPadding,
    totalWidth: dims.pageWidth + 2,
    terminalWidth: dims.terminalWidth
  };
};

export const onTerminalResize = (callback) => {
  process.stdout.on('resize', () => {
    const newDims = calculateDimensions();
    callback(newDims);
  });
};

export const handleResize = (redrawCallback) => {
  onTerminalResize(() => {
    console.clear();
    redrawCallback();
  });
};