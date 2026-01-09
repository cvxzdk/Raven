import { fg, bold, italic, underline, reset, visibleLength } from './utils.js';

const codeColor = fg(107);
const linkColor = fg(117);
const strikeColor = fg(8);

export const applyInlineStyles = (text) => {
  if (!text) return text;
  
  let result = text;

  result = result.replace(/__(.+?)__/g, `${bold}${underline}$1${reset}`);
  
  result = result.replace(/\*\*(.+?)\*\*/g, `${bold}$1${reset}`);
  
  result = result.replace(/_(.+?)_/g, `${underline}$1${reset}`);
  
  result = result.replace(/\*(.+?)\*/g, `${italic}$1${reset}`);
  
  result = result.replace(/~~(.+?)~~/g, `${strikeColor}$1${reset}`);
  
  result = result.replace(/`([^`]+)`/g, `${codeColor}$1${reset}`);
  
  result = result.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, `${linkColor}$1${reset}`);

  return result;
};

export const stripInlineStyles = (text) => {
  if (!text) return text;
  
  let result = text;
  
  result = result.replace(/__(.+?)__/g, '$1');
  result = result.replace(/\*\*(.+?)\*\*/g, '$1');
  result = result.replace(/_(.+?)_/g, '$1');
  result = result.replace(/\*(.+?)\*/g, '$1');
  result = result.replace(/~~(.+?)~~/g, '$1');
  result = result.replace(/`([^`]+)`/g, '$1');
  result = result.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '$1');
  
  return result;
};

export const getStyledTextLength = (text) => {
  return visibleLength(stripInlineStyles(text));
};
