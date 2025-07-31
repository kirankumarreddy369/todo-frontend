// src/api/axiosInstance.js
import axios from 'axios';

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Add token to Authorization header
AxiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default AxiosInstance;
