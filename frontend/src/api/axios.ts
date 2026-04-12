import axios from 'axios';
export const BASE_URL = "https://gamified-environmental-education-w0n5.onrender.com";


const api = axios.create({
  baseURL: `${BASE_URL}/api`
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

