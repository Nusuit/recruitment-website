// src/index.js
import React from "react";
import { createRoot } from "react-dom/client"; // Import createRoot từ react-dom/client
import App from "./App";
import "./styles/global.scss"; // Import global.scss
import "./fontawesome"; // Import Font Awesome configuration

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");

  if (container) {
    const root = createRoot(container); // Tạo root.
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    ); // Render ứng dụng.
  } else {
    console.error(
      'Không tìm thấy phần tử có id="root". Không thể render ứng dụng React.'
    );
  }
});
