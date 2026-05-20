import axios from 'axios';

const defaultBaseURL = typeof window !== 'undefined'
  ? (import.meta.env.DEV ? 'http://localhost:5000/api' : `${window.location.origin}/api`)
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
