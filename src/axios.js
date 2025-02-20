import axios from 'axios';

// Configuración global de Axios
const api = axios.create({
  baseURL: 'http://backend.projectegb5.ddaw.es/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  withCredentials: true // Si usas autenticación con cookies
});

export default api;
