// src/api/config/axiosConfig.js
import axios from "axios";

// Determine the base URL based on the environment
// You should use environment variables for this in a real application
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api"; // Default for development

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // You can add other default headers here
  },
  // timeout: 10000, // Optional: request timeout
});

// Request interceptor: for adding auth tokens or other headers to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get the token from localStorage (or your state management solution)
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // You can also add other dynamic headers here
    // config.headers['X-Custom-Header'] = 'someValue';
    return config;
  },
  (error) => {
    // Handle request errors
    console.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: for handling global responses or errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // You can transform response data here if needed
    return response; // Usually, you just return the response
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error("Axios Response Error:", error.response || error.message);

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;

      if (status === 401) {
        // Handle Unauthorized errors (e.g., token expired or invalid)
        // Option 1: Redirect to login
        // localStorage.removeItem('token');
        // localStorage.removeItem('user');
        // window.location.href = '/login'; // Force reload to clear state

        // Option 2: Try to refresh token if you have a refresh token mechanism
        // return refreshTokenAndRetry(error.config);

        // For now, just log and reject
        console.error(
          "Unauthorized access - 401. Redirecting or refreshing token might be needed."
        );
      } else if (status === 403) {
        // Handle Forbidden errors
        console.error("Forbidden access - 403.");
      } else if (status === 404) {
        console.error("Resource not found - 404.");
      } else if (status >= 500) {
        // Handle Server errors
        console.error("Server error - 5xx.");
      }
      // You might want to return a standardized error object or message
      // return Promise.reject(data?.message || data?.error || 'An error occurred');
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Network error or no response received:", error.request);
      // return Promise.reject('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }

    // It's important to reject the promise so that the calling code's .catch() block is executed
    return Promise.reject(error);
  }
);

export default axiosInstance;
