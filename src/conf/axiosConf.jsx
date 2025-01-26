import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: API,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para peticiones
axiosInstance.interceptors.request.use(
    (config) => {
        // Obtener el token actual en cada petición
        const token = localStorage.getItem('token');
        
        if (token) {
            config.headers['x-access-token'] = token;
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);



export default axiosInstance;