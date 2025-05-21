import React from "react";
import ReactDOM from "react-dom"; // Import ReactDOM directly
import App from "./App";
import "./styles/global.scss"; // Import the new main SCSS file
import "./fontawesome"; // Import Font Awesome configuration

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("root");

  if (container) {
    // Use ReactDOM.render for React 17
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      container
    );
  } else {
    console.error(
      'Không tìm thấy phần tử có id="root". Không thể render ứng dụng React.'
    );
  }
});
