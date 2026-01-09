import { calculateDimensions } from '../render/frame.js';

const IDEAL_BOX_WIDTH = 100; // Ideal width when terminal is large enough

/**
 * @param {string} modelName - name of the AI model to display
 * @param {string} currentPath - Current path 
 * @returns {string} formatted header with borders
 */
export function getHeader(modelName = 'Claude', currentPath = '') {
  const { pageWidth, terminalWidth } = calculateDimensions();
  
  const boxWidth = Math.min(pageWidth, IDEAL_BOX_WIDTH);
  const topBorder = '┌' + '─'.repeat(boxWidth) + '┐';
  const bottomBorder = '└' + '─'.repeat(boxWidth) + '┘';
  
  let lines = [];

  if (boxWidth < 80 || terminalWidth < 80) {
    const compactLine1 = 'RAVEN v0.1.0';
    const compactLine2 = `Model: ${modelName}`;
    const compactLine3 = `Path: ${currentPath}`;
    
    lines = [
      topBorder,
      `│ ${compactLine1.padEnd(boxWidth - 2, ' ')} │`,
      `│ ${compactLine2.padEnd(boxWidth - 2, ' ')} │`,
      `│ ${compactLine3.padEnd(boxWidth - 2, ' ')} │`,
      bottomBorder
    ];
  }
  else {
    const line1 = '██████    ████  ██░░██  ██████  ██  ░░██  v0.1.0';
    const line2 = `██  ██  ██  ██  ██░░██  ██      ████░░██  ${modelName}`;
    const line3 = `████    ██████  ██  ██  ████    ██░░████  ${currentPath}`;
    const line4 = `██  ██  ██  ██    ██    ██████  ██░░  ██`;
    
    lines = [
      topBorder,
      `│ ${line1.padEnd(boxWidth - 2, ' ')} │`,
      `│ ${line2.padEnd(boxWidth - 2, ' ')} │`,
      `│ ${line3.padEnd(boxWidth - 2, ' ')} │`,
      `│ ${line4.padEnd(boxWidth - 2, ' ')} │`,
      bottomBorder
    ];
  }
  
  return lines.join('\n');
}

export { IDEAL_BOX_WIDTH as BOX_WIDTH };