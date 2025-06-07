// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { JobsProvider } from './contexts/JobsContext';
import './config/chartConfig'; // Import Chart.js configuration
import './styles/global.scss'; // Import global styles
import "./fontawesome"; // Import Font Awesome configuration
import './icons';

const container = document.getElementById("root");

if (container) {
  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <JobsProvider>
          <App />
        </JobsProvider>
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error('Không tìm thấy phần tử có id="root". Không thể render ứng dụng React.');
}