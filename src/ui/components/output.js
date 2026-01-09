// src/ui/components/output.js
// Parses markdown content into structured data for rendering

/**
 * Parse markdown content into structured blocks
 * Returns array of parsed blocks with type and content
 */
export function parseMarkdown(content) {
  const lines = content.split('\n');
  const blocks = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Code blocks
    if (trimmedLine.startsWith('```')) {
      const language = trimmedLine.slice(3).trim() || 'text';
      const codeLines = [];
      i++;
      
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      
      if (codeLines.length > 0) {
        blocks.push({
          type: 'codeblock',
          language,
          content: codeLines.join('\n')
        });
      }
      i++; // Skip closing ```
      continue;
    }
    
    // Tables
    if (trimmedLine.includes('|') && trimmedLine.split('|').length > 2) {
      const tableLines = [lines[i]];
      i++;
      
      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      
      blocks.push({
        type: 'table',
        content: tableLines
      });
      continue;
    }
    
    // Headers (# ## ###)
    if (trimmedLine.match(/^#{1,3}\s/)) {
      const match = trimmedLine.match(/^(#{1,3})\s+(.*)/);
      if (match) {
        const level = match[1].length;
        const text = match[2];
        blocks.push({
          type: 'header',
          level,
          content: text
        });
        i++;
        continue;
      }
    }
    
    // Bullet lists (-, *, +)
    if (trimmedLine.match(/^[-*+]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].trim().match(/^[-*+]\s/)) {
        items.push(lines[i].trim().replace(/^[-*+]\s/, ''));
        i++;
      }
      blocks.push({
        type: 'bulletlist',
        items
      });
      continue;
    }
    
    // Numbered lists (1. 2. 3. etc)
    if (trimmedLine.match(/^\d+\.\s/)) {
      const items = [];
      while (i < lines.length && lines[i].trim().match(/^\d+\.\s/)) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      blocks.push({
        type: 'orderedlist',
        items
      });
      continue;
    }
    
    // Blockquotes (>)
    if (trimmedLine.startsWith('>')) {
      blocks.push({
        type: 'blockquote',
        content: trimmedLine.replace(/^>\s?/, '')
      });
      i++;
      continue;
    }
    
    // Horizontal rules (---, ***, ___)
    if (trimmedLine.match(/^(---+|\*\*\*+|___+)$/)) {
      blocks.push({
        type: 'hr'
      });
      i++;
      continue;
    }
    
    // Comments (//)
    if (trimmedLine.startsWith('//')) {
      blocks.push({
        type: 'comment',
        content: line
      });
      i++;
      continue;
    }
    
    // Empty lines
    if (trimmedLine === '') {
      blocks.push({
        type: 'empty'
      });
      i++;
      continue;
    }
    
    // Regular text
    blocks.push({
      type: 'text',
      content: line
    });
    i++;
  }
  
  return blocks;
}