import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter

const container = document.getElementById('root');
const root = createRoot(container);

// Removed StrictMode to prevent double mounting of components which can cause reloading issues
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
