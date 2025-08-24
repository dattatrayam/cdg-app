// /frontend/lib/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL:  'http://localhost:5500/' || 'https://cdg-app-backend.onrender.com/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Response interceptor for logging errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });
    return Promise.reject(error);
  }
);

export default api;
