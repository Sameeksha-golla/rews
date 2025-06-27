// Check if user is authenticated
import axios from "axios";
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;
  
  // Additional validation could be added here if needed
  // For now, just check if token exists
  return true;
};

// Get the stored authentication token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Get the current user
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Logout the user
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/";
};

// Flag to prevent multiple setup calls
let interceptorsSetup = false;

// Set up axios defaults - with safeguards against repeated setup
export const setupAxiosInterceptors = () => {
  // Only set up interceptors once to prevent memory leaks and loops
  if (interceptorsSetup) return;
  
  // Add request interceptor for auth token
  const requestInterceptor = axios.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor to handle 401 Unauthorized responses
  // Added a simple debounce mechanism to prevent logout loops
  let logoutInProgress = false;
  const responseInterceptor = axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 && !logoutInProgress) {
        logoutInProgress = true;
        // Add small delay to prevent immediate re-authentication attempts
        setTimeout(() => {
          logout();
          logoutInProgress = false;
        }, 100);
      }
      return Promise.reject(error);
    }
  );
  
  interceptorsSetup = true;
};
