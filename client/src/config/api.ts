/**
 * API Configuration
 * Centralized configuration for API endpoints and axios setup
 */

import axios from 'axios';

// API Base URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    ME: '/auth/me',
    UPDATE_PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    LOGOUT: '/auth/logout',
  },
  
  // Products
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: (id: string) => `/products/${id}`,
    GET_FEATURED: '/products/featured',
    GET_BY_CATEGORY: (category: string) => `/products/category/${category}`,
    GET_CATEGORIES: '/products/categories',
    CREATE: '/products',
    UPDATE: (id: string) => `/products/${id}`,
    DELETE: (id: string) => `/products/${id}`,
  },
  
  // Orders
  ORDERS: {
    GET_ALL: '/orders',
    GET_BY_ID: (id: string) => `/orders/${id}`,
    CREATE: '/orders',
    UPDATE_STATUS: (id: string) => `/orders/${id}/status`,
  },
  
  // Users (Admin)
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
  },
  
  // Avatars
  AVATARS: {
    UPLOAD: '/avatars/upload',
    GET_ME: '/avatars/me',
    DELETE_ME: '/avatars/me',
  },
  
  // Health Check
  HEALTH: '/health',
};

export default api;