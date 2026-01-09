import {
  fg,
  bgDark,
  reset,
  BORDER_CHAR,
  stripAnsi
} from './utils.js';

// Define borderColor as a function to avoid circular dependency issues
const getBorderColor = () => fg(243);

// Flexible dimension constants
const IDEAL_PAGE_WIDTH = 100;
const IDEAL_INNER_PADDING = 5;
const MIN_INNER_PADDING = 1;
const MINIMUM_CONTENT_WIDTH = 20; // Absolute minimum for content


//Get current terminal dimensions
export const getTerminalSize = () => {
  return {
    width: process.stdout.columns || 80,
    height: process.stdout.rows || 24
  };
};

/**
 * Calculate responsive dimensions that adapt to any terminal size
 * Intelligently scales down content while maintaining readability
 */
export const calculateDimensions = () => {
  const termWidth = getTerminalSize().width;
  
  let pageWidth, innerPadding, contentWidth, leftPadding;
  
  // Case 1: Large terminal - use ideal dimensions
  if (termWidth >= IDEAL_PAGE_WIDTH + (IDEAL_INNER_PADDING * 2) + 2) {
    pageWidth = IDEAL_PAGE_WIDTH;
    innerPadding = IDEAL_INNER_PADDING;
    contentWidth = pageWidth - (innerPadding * 2);
    leftPadding = Math.floor((termWidth - pageWidth - 2) / 2);
  }
  // Case 2: Medium terminal - scale down proportionally
  else if (termWidth >= MINIMUM_CONTENT_WIDTH + 10) {
    // Reserve space for borders (2) and minimum padding
    const availableWidth = termWidth - 2;
    
    // Scale padding proportionally (but not below minimum)
    innerPadding = Math.max(
      MIN_INNER_PADDING, 
      Math.floor(availableWidth * 0.05)
    );
    
    // Calculate page width with available space
    pageWidth = availableWidth - (innerPadding * 2);
    contentWidth = pageWidth - (innerPadding * 2);
    
    // Center the content
    leftPadding = Math.max(0, Math.floor((termWidth - pageWidth - 2) / 2));
  }
  // Case 3: Very small terminal - use full width with minimal padding
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

// Get current dimensions (will recalculate on each call for responsiveness)
export const getCurrentDimensions = () => calculateDimensions();


//Create top border
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

//Create bottom border
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

//Create middle separator
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

//Create left border
export const createLeftBorder = () => {
  return bgDark + getBorderColor() + BORDER_CHAR + reset + bgDark;
};

//Create right border
export const createRightBorder = () => {
  return getBorderColor() + BORDER_CHAR + reset;
};


//Wrap content with left and right borders (responsive)
export const wrapWithBorders = (content) => {
  const { leftPadding } = calculateDimensions();
  const leftBorder = createLeftBorder();
  const rightBorder = createRightBorder();
  
  return ' '.repeat(leftPadding) + leftBorder + content + rightBorder;
};


//Pad content to fit within frame
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

//Wrap text to fit content width
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

//Create a frame with borders
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

//Get frame dimensions
export const getFrameDimensions = () => {
  const dims = calculateDimensions();
  return {
    pageWidth: dims.pageWidth,
    contentWidth: dims.contentWidth,
    innerPadding: dims.innerPadding,
    leftPadding: dims.leftPadding,
    totalWidth: dims.pageWidth + 2, // Including borders
    terminalWidth: dims.terminalWidth
  };
};

//Listen for terminal resize events
export const onTerminalResize = (callback) => {
  process.stdout.on('resize', () => {
    const newDims = calculateDimensions();
    callback(newDims);
  });
};

//Clear and redraw on resize
export const handleResize = (redrawCallback) => {
  onTerminalResize(() => {
    console.clear();
    redrawCallback();
  });
};