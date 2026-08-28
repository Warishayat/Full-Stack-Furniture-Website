import axios from 'axios';

const API = axios.create({
  baseURL: ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://localhost:8000'
    : 'https://full-stack-furniture-website-oxz9.onrender.com',
  timeout: 60000,
});


API.interceptors.request.use((req) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {}

  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
