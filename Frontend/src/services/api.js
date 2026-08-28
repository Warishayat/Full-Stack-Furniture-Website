import axios from 'axios';

const API = axios.create({
  baseURL: ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:8000'
    : 'https://full-stack-furniture-website-oxz9.onrender.com',
  timeout: 60000,
});
API.interceptors.request.use(
  (config) => {
    let token = null;

    try {
      const storedUser = localStorage.getItem('user');
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        token = storedToken;
      } else if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        token = parsedUser?.token || null;
      }
    } catch (error) {
      console.error('Error parsing authentication token from localStorage:', error);
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default API;