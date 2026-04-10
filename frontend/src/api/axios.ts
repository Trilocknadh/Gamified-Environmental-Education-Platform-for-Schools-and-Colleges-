import axios from 'axios';

const api = axios.create({
  baseURL:"https://gamified-environmental-education-w0n5.onrender.com/api"
  //baseURL: 'http://localhost:5000/api',
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
