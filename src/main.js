import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import { useAuthStore } from './stores/auth';
import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

// Asegúrate de que el token esté bien configurado
const API = import.meta.env.VITE_URL_API;  // La URL base de tu API


const app = createApp(App);

app.use(createPinia());
app.use(router);


app.mount('#app');
