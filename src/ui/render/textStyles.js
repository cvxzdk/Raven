import { fg, bold, italic, underline, reset, stripAnsi } from './utils.js';

const codeColor = fg(107);
const linkColor = fg(117);
const strikeColor = fg(8);

export const applyInlineStyles = (text) => {
  if (!text) return text;
  
  let result = text;

  result = result.replace(/__(.+?)__/g, (match, content) => {
    return `${bold}${underline}${content}${reset}`;
  });

  result = result.replace(/\*\*(.+?)\*\*/g, (match, content) => {
    return `${bold}${content}${reset}`;
  });

  result = result.replace(/~~(.+?)~~/g, (match, content) => {
    return `${strikeColor}${content}${reset}`;
  });

  result = result.replace(/`([^`]+)`/g, (match, content) => {
    return `${codeColor}${content}${reset}`;
  });

  result = result.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match, text, url) => {
    return `${linkColor}${text}${reset}`;
  });
  
  result = result.replace(/(?<!_)_([^_]+?)_(?!_)/g, (match, content) => {
    return `${underline}${content}${reset}`;
  });

  result = result.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, (match, content) => {
    return `${italic}${content}${reset}`;
  });

  return result;
};

export const stripInlineStyles = (text) => {
  if (!text) return text;
  
  let result = text;
  
  result = result.replace(/__(.+?)__/g, '$1');
  result = result.replace(/\*\*(.+?)\*\*/g, '$1');
  result = result.replace(/~~(.+?)~~/g, '$1');
  result = result.replace(/`([^`]+)`/g, '$1');
  result = result.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '$1');
  result = result.replace(/(?<!_)_([^_]+?)_(?!_)/g, '$1');
  result = result.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '$1');
  
  return result;
}

export const getStyledTextLength = (text) => {
  const withoutMarkdown = stripInlineStyles(text);
  const withoutAnsi = stripAnsi(withoutMarkdown);
  return withoutAnsi.length;
};