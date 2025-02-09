import './assets/main.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import PrimeVue from 'primevue/config';


import router from './router';

const app = createApp(App);

app.use(PrimeVue);

app.use(createPinia());

app.use(router);

app.mount('#app');
