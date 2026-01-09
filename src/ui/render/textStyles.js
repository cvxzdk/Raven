import { fg, bold, italic, underline, reset, stripAnsi } from './utils.js';

const codeColor = fg(107);
const linkColor = fg(117);
const strikeColor = fg(8);

export const applyInlineStyles = (text) => {
  if (!text) return text;
  
  let result = text;

  // Process in order of specificity (most specific first)
  
  // Bold + underline (__text__)
  result = result.replace(/__(.+?)__/g, (match, content) => {
    return `${bold}${underline}${content}${reset}`;
  });
  
  // Bold (**text**)
  result = result.replace(/\*\*(.+?)\*\*/g, (match, content) => {
    return `${bold}${content}${reset}`;
  });
  
  // Strikethrough (~~text~~) - before single underscores
  result = result.replace(/~~(.+?)~~/g, (match, content) => {
    return `${strikeColor}${content}${reset}`;
  });
  
  // Inline code (`code`) - should NOT process other markdown inside
  result = result.replace(/`([^`]+)`/g, (match, content) => {
    return `${codeColor}${content}${reset}`;
  });
  
  // Links ([text](url))
  result = result.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, (match, text, url) => {
    return `${linkColor}${text}${reset}`;
  });
  
  // Underline (_text_) - must not match __ (already processed)
  result = result.replace(/(?<!_)_([^_]+?)_(?!_)/g, (match, content) => {
    return `${underline}${content}${reset}`;
  });
  
  // Italic (*text*) - must not match ** (already processed)
  result = result.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, (match, content) => {
    return `${italic}${content}${reset}`;
  });

  return result;
};

export const stripInlineStyles = (text) => {
  if (!text) return text;
  
  let result = text;
  
  // Remove markdown syntax in same order
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