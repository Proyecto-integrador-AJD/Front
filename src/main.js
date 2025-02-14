import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';

// Asegúrate de que el token esté bien configurado
const API = import.meta.env.VITE_URL_API;  // La URL base de tu API


const app = createApp(App);

app.use(createPinia());
app.use(router);

const authStore = useAuthStore();



// Token predefinido para autenticación
const token = '';
axios.defaults.headers.common['Authorization'] = `Bearer ${authStore.token}`;

app.mount('#app');
