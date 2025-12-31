// src/ui/render/tables.js
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

const isTableSeparator = (line) => {
  const trimmed = line.trim();
  if (!trimmed.includes('|')) return false;
  const withoutSeparatorChars = trimmed.replace(/[\|\s\-:]/g, '');
  return withoutSeparatorChars.length === 0;
};

export const renderTable = (rows, hasHeader = true) => {
  if (!rows || rows.length === 0) return;

  addSpacing();

  const colCount = rows[0].length;
  const colWidths = Array(colCount).fill(Math.floor((CONTENT_WIDTH - 2) / colCount) - 3);
  const tableColor = fg(250);

  // Top border
  let top = ' '.repeat(INNER_PADDING) + tableColor + '┌';
  colWidths.forEach((w, i) => {
    top += '─'.repeat(w + 2) + (i < colCount - 1 ? '┬' : '┐');
  });
  top += reset + bgDark + ' '.repeat(INNER_PADDING);
  printWithBorders(top);

  // Rows
  rows.forEach((row, rowIndex) => {
    const wrappedCells = row.map((cell, i) => wrapText(String(cell), colWidths[i]));
    const maxLines = Math.max(...wrappedCells.map(c => c.length));

    for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
      let r = ' '.repeat(INNER_PADDING) + tableColor + '│' + reset + bgDark;
      wrappedCells.forEach((cellLines, colIdx) => {
        const text = cellLines[lineIdx] || '';
        r += ' ' + text.padEnd(colWidths[colIdx]) + ' ' + tableColor + '│' + reset + bgDark;
      });
      r += ' '.repeat(INNER_PADDING);
      printWithBorders(r);
    }

    if ((hasHeader && rowIndex === 0) || (rowIndex < rows.length - 1)) {
      let sep = ' '.repeat(INNER_PADDING) + tableColor + '├';
      colWidths.forEach((w, i) => {
        sep += '─'.repeat(w + 2) + (i < colCount - 1 ? '┼' : '┤');
      });
      sep += reset + bgDark + ' '.repeat(INNER_PADDING);
      printWithBorders(sep);
    }
  });

  // Bottom border
  let bottom = ' '.repeat(INNER_PADDING) + tableColor + '└';
  colWidths.forEach((w, i) => {
    bottom += '─'.repeat(w + 2) + (i < colCount - 1 ? '┴' : '┘');
  });
  bottom += reset + bgDark + ' '.repeat(INNER_PADDING);
  printWithBorders(bottom);
};

export const renderTableFromMarkdown = (tableLines) => {
  const filteredLines = tableLines.filter(line => !isTableSeparator(line));
  if (filteredLines.length === 0) return;

  const dataRows = filteredLines.map(l =>
    l.split('|').slice(1, -1).map(c => c.trim())
  );

  renderTable(dataRows, true);
};