// src/api/config/axiosConfig.js
import axios from "axios";

// Determine the base URL based on the environment
const API_BASE_URL = "http://localhost:8080"; // Base URL without /api

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
    // Get the token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // You can also add other dynamic headers here
    // config.headers['X-Custom-Header'] = 'someValue';
    return config;
  },
  (error) => {
    console.error("Axios Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor: for handling global responses or errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Check if response has data and success flag
    if (response.data && typeof response.data.success === 'boolean') {
      if (!response.data.success) {
        // If API indicates failure, reject with error message
        return Promise.reject({
          response: {
            data: response.data,
            status: response.status
          }
        });
      }
    }
    return response;
  },
  (error) => {
    console.error("Axios Response Error:", error.response || error);

    if (error.response) {
      const { status, data } = error.response;

      // Log detailed error information
      console.error("Error Details:", {
        status,
        data,
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      });

      if (status === 401) {
        // Handle Unauthorized errors
        console.error("Unauthorized access - 401");
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (status === 403) {
        console.error("Forbidden access - 403");
      } else if (status === 404) {
        console.error("Resource not found - 404");
      } else if (status >= 500) {
        console.error("Server error - 5xx");
      }

      // Return standardized error object
      return Promise.reject({
        status,
        message: data?.message || data?.error || 'An error occurred',
        data
      });
    } else if (error.request) {
      // Network error
      console.error("Network error or no response received:", error.request);
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.'
      });
    } else {
      // Setup error
      console.error("Error setting up request:", error.message);
      return Promise.reject({
        status: 0,
        message: error.message || 'An unexpected error occurred'
      });
    }
  }
);

export default axiosInstance;
