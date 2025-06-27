// Check if user is authenticated
import axios from "axios";
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Returns true if token exists, false otherwise
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

// Set up axios defaults
export const setupAxiosInterceptors = () => {
  axios.interceptors.request.use(
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
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
};
