// src/ui/components/header.js

const BOX_WIDTH = 100; // Match the renderer's PAGE_WIDTH

/**
 * Generates the header content as a string
 * @param {string} modelName - name of the AI model to display
 * @param {string} currentPath - Current path 
 * @returns {string} formatted header with borders
 */
export function getHeader(modelName = 'Claude', currentPath = '') {
  const topBorder = '┌' + '─'.repeat(BOX_WIDTH) + '┐';
  const bottomBorder = '└' + '─'.repeat(BOX_WIDTH) + '┘';
  
  const line1 = '██████    ████  ██░░██  ██████  ██  ░░██  v0.1.0';
  const line2 = `██  ██  ██  ██  ██░░██  ██      ████░░██  ${modelName}`;
  const line3 = `████    ██████  ██  ██  ████    ██░░████  ${currentPath}`;
  const line4 = `██  ██  ██  ██    ██    ██████  ██░░  ██`;

  
  return [
    topBorder,
    `│ ${line1.padEnd(BOX_WIDTH - 2, ' ')} │`,
    `│ ${line2.padEnd(BOX_WIDTH - 2, ' ')} │`,
    `│ ${line3.padEnd(BOX_WIDTH - 2, ' ')} │`,
    `│ ${line4.padEnd(BOX_WIDTH - 2, ' ')} │`,
    bottomBorder
  ].join('\n');
}

export { BOX_WIDTH };