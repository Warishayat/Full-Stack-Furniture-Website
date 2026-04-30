import axios from 'axios';

const API = axios.create({
  baseURL: window.location.hostname === 'localhost' 
    ? 'http://localhost:8000' 
    : 'https://full-stack-furniture-website.onrender.com',
});


API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export default API;
