/**
 * User Manager utility for handling authentication and user management
 * This version works with the backend database authentication
 */

/**
 * Get JWT token from localStorage
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Get all users from localStorage
 * @returns {Array} Array of user objects
 */
export const getAllUsers = () => {
  initializeUsers();
  return JSON.parse(localStorage.getItem("appUsers") || "[]");
};

/**
 * Authenticate a user by email and password
 * @param {string} email User email
 * @param {string} password User password
 * @returns {Object|null} User object if authenticated, null otherwise
 */
export const authenticateUser = (email, password) => {
  const users = getAllUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  return user || null;
};

/**
 * Get current logged-in user
 * @returns {Object|null} Current user object if logged in, null otherwise
 */
export const getCurrentUser = () => {
  const userJson = localStorage.getItem("user");
  if (!userJson) {
    return null;
  }
  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error parsing current user:", error);
    return null;
  }
};

/**
 * Check if current user is admin
 * @returns {boolean} True if current user is admin, false otherwise
 */
export const isAdmin = () => {
  const currentUser = getCurrentUser();
  return currentUser && currentUser.role === "admin";
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is authenticated, false otherwise
 */
export const isAuthenticated = () => {
  return !!getToken() && !!getCurrentUser();
};

/**
 * Logout current user
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/**
 * Get user by ID
 * @param {string} userId User ID
 * @returns {Object|null} User object or null if not found
 */
export const getUserById = (userId) => {
  const users = getAllUsers();
  return users.find((u) => u.id === userId) || null;
};

/**
 * Get user by email
 * @param {string} email User email
 * @returns {Object|null} User object or null if not found
 */
export const getUserByEmail = (email) => {
  const users = getAllUsers();
  return users.find((u) => u.email === email) || null;
};
