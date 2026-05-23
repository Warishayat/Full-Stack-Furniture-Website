import axios from 'axios';

const API = axios.create({
  baseURL: ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:8000' 
    : 'http://localhost:1000',
  timeout: 60000, // 60 seconds timeout
});


API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
