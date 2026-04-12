import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:7000/api",
  // baseURL:""
});

// Add a request interceptor to attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Wait backend auth expects 'Bearer'
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
