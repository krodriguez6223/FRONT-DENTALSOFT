import axios from 'axios';

const API = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('token');

const axiosInstance = axios.create({
  baseURL: API,
  headers: {
    'x-access-token': token || '',
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : undefined
  }
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    return Promise.reject(error);
  }
);

export default axiosInstance;