import axios from "axios";

/**
 * 1. Create an Axios Instance
 * This centralizes the configuration so you don't have to repeat the 
 * baseURL in every file.
 */
const api = axios.create({
  // The 'home address' of your backend server
  baseURL: "http://localhost:5000", 
  // You can also add a timeout here (e.g., timeout: 5000)
});

/**
 * 2. Request Interceptor
 * This function runs automatically BEFORE every outgoing request.
 * Think of it as a "Security Gate" that attaches your ID badge to every message.
 */
api.interceptors.request.use(
  (config) => {
    // Retrieve the stored authentication token from the browser's local storage
    const token = localStorage.getItem("token");

    // If a token exists, attach it to the 'Authorization' header
    if (token) {
      /**
       * 'Bearer' is the standard prefix for JSON Web Tokens (JWT).
       * It tells the server: "The bearer of this token is authorized."
       */
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Return the modified config so the request can proceed
    return config;
  },
  (error) => {
    // This handles cases where the request configuration itself failed
    return Promise.reject(error);
  }
);

// Export the instance so it can be used throughout the app (e.g., import api from './api')
export default api;