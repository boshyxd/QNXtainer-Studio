import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import the main CSS file with Tailwind directives
import App from './App'; // No need for .jsx extension, TypeScript resolves it

// Ensure the element exists and assert its type as HTMLElement
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);