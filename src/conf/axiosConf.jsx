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

// Interceptor para respuestas
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Manejar errores de autenticación
            if (error.response.status === 401) {
                // Token expirado o inválido
                localStorage.clear(); // Limpiar todo el localStorage
                window.location.replace('/login');
                return Promise.reject(new Error('Sesión expirada. Por favor, inicie sesión nuevamente.'));
            }

            // Manejar errores de permisos
            if (error.response.status === 403) {
                return Promise.reject(new Error('No tienes permisos para realizar esta acción'));
            }

            // Manejar otros errores del servidor
            if (error.response.data && error.response.data.message) {
                return Promise.reject(new Error(error.response.data.message));
            }
        }

        // Manejar errores de red u otros errores
        return Promise.reject(new Error('Error de conexión. Por favor, intente nuevamente.'));
    }
);

export default axiosInstance;