import React from 'react';
import {marked} from 'marked';

// Define the props type

// Create the MarkdownRenderer component
const MarkdownRenderer = ({ markdown }) => {
  // Convert Markdown to HTML
  const htmlContent = marked(markdown);

  return (
    <div style={{textAlign:"left"}}
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
export default MarkdownRenderer