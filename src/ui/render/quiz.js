// src/ui/render/quiz.js
// Convert to ES modules

import {
  PAGE_WIDTH,
  INNER_PADDING,
  CONTENT_WIDTH,
  fg,
  bgDark,
  bold,
  reset,
  printWithBorders,
  wrapText,
  addSpacing
} from './utils.js';

export const renderQuiz = (question, options, correctAnswer = null) => {
  addSpacing();

  const quizColor = fg(111);
  const optionColor = fg(250);
  const correctColor = fg(46);

  const maxWidth = CONTENT_WIDTH - 4;

  // Top border
  const topBorder = ' '.repeat(INNER_PADDING)
    + quizColor
    + '┌'
    + '─'.repeat(CONTENT_WIDTH - 2)
    + '┐'
    + reset
    + bgDark
    + ' '.repeat(INNER_PADDING);
  printWithBorders(topBorder);

  // Question label
  const labelLine = ' '.repeat(INNER_PADDING)
    + quizColor
    + '│ '
    + bold
    + 'QUIZ'
    + reset
    + bgDark
    + ' '.repeat(CONTENT_WIDTH - 7)
    + quizColor
    + ' │'
    + reset
    + bgDark
    + ' '.repeat(INNER_PADDING);
  printWithBorders(labelLine);

  // Separator
  const sep = ' '.repeat(INNER_PADDING)
    + quizColor
    + '├'
    + '─'.repeat(CONTENT_WIDTH - 2)
    + '┤'
    + reset 
    + bgDark
    + ' '.repeat(INNER_PADDING);
  printWithBorders(sep);

  // Question text
  const wrappedQuestion = wrapText(question, maxWidth);
  wrappedQuestion.forEach(line => {
    const content = ' '.repeat(INNER_PADDING)
      + quizColor
      + '│ '
      + reset
      + bgDark
      + bold
      + line
      + reset
      + bgDark
      + ' '.repeat(maxWidth - line.length)
      + quizColor
      + ' │'
      + reset
      + bgDark
      + ' '.repeat(INNER_PADDING);
    printWithBorders(content);
  });

  // Empty line
  const emptyLine = ' '.repeat(INNER_PADDING)
    + quizColor
    + '│ '
    + reset
    + bgDark
    + ' '.repeat(maxWidth)
    + quizColor
    + ' │'
    + reset 
    + bgDark
    + ' '.repeat(INNER_PADDING);
  printWithBorders(emptyLine);

  // Options
  options.forEach((option, index) => {
    const letter = String.fromCharCode(65 + index);
    const isCorrect = correctAnswer !== null && index === correctAnswer;
    const color = isCorrect ? correctColor : optionColor;
    const marker = isCorrect ? '✓ ' : '  ';

    const optionText = `${letter}. ${option}`;
    const wrappedOption = wrapText(optionText, maxWidth - 2);

    wrappedOption.forEach((line, idx) => {
      const prefix = idx === 0 ? marker : '  ';
      const content = ' '.repeat(INNER_PADDING)
        + quizColor
        + '│ '
        + color
        + prefix
        + line
        + reset
        + bgDark 
        + ' '.repeat(maxWidth - line.length - 2)
        + quizColor
        + ' │'
        + reset
        + bgDark
        + ' '.repeat(INNER_PADDING);
      printWithBorders(content);
    });
  });

  // Bottom border
  const bottomBorder = ' '.repeat(INNER_PADDING)
    + quizColor
    + '└'
    + '─'.repeat(CONTENT_WIDTH - 2)
    + '┘'
    + reset
    + bgDark
    + ' '.repeat(INNER_PADDING);
  printWithBorders(bottomBorder);
};