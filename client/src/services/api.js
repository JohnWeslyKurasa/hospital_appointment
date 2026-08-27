import axios from 'axios';

// Render production backend URL fallback
const RENDER_BACKEND_URL = 'https://hosipital-appionment.onrender.com/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || RENDER_BACKEND_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Auth token into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('medicare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
