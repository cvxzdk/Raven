// example-usage.js
// Example of how to use the renderer

const {
  startDocument,
  endDocument,
  renderHeader,
  renderText,
  renderCodeBlock,
  renderBulletList,
  renderTable,
  renderQuiz,
  renderHR,
  renderComment,
  addSpacing
} = require('./render');

// Start the document
startDocument();

// Render a header
renderHeader('Welcome to the Renderer', 1);

// Render some text
renderText('This is a modular markdown renderer for CLI applications with beautiful formatting.');

// Render a code block with line numbers and syntax highlighting
renderCodeBlock(`const greeting = "Hello World";
function sayHello(name) {
  console.log(greeting + ", " + name);
  return true;
}
sayHello("User");`, 'javascript');

// Render a header
renderHeader('Features', 2);

// Render bullet points
renderBulletList([
  'Modular architecture with separate files for each feature',
  'Syntax highlighting for code blocks',
  'Line numbers in code blocks',
  'Beautiful table rendering',
  'Quiz support for interactive content'
]);

// Render a table
renderTable([
  ['Feature', 'Status', 'Priority'],
  ['Headers', 'Complete', 'High'],
  ['Code Blocks', 'Complete', 'High'],
  ['Tables', 'Complete', 'Medium']
], true);

// Render a quiz
renderQuiz(
  'What is the capital of France?',
  ['London', 'Paris', 'Berlin', 'Madrid'],
  1 // Paris is correct
);

// Add a comment
renderComment('// This is a comment line');

// Horizontal rule
renderHR();

// End the document
endDocument();