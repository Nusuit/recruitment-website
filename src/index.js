import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
// Import main styles
import './styles/base/variables.css';
import './styles/global.css';
import './styles/layouts.css';
import './styles/App.css';

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('root');
  
  if (container) {
    const root = createRoot(container);
    
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error('Không tìm thấy phần tử có id="root". Không thể render ứng dụng React.');
  }
});