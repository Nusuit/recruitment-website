import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// Import main styles
import './styles/variables.css';
import './styles/global.css';
import './styles/layouts.css';
import './styles/App.css';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  
  if (container) {
    const root = createRoot(container);
    
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>
    );
  } else {
    console.error('Không tìm thấy phần tử có id="root". Không thể render ứng dụng React.');
  }
});