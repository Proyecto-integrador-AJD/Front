<script>
import { useDataStore } from '../stores/data';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  name: 'LoginView',
  setup() {
    const store = useDataStore(); // Usamos el store de datos
    const router = useRouter();

    // Campos para el login
    const username = ref('');
    const password = ref('');

    // Acción para el login
    const login = () => {
      // Aquí podrías hacer una llamada a una API para verificar el login, 
      // por ahora simula una autenticación exitosa
      if (username.value && password.value) {
        store.login(); // Iniciar sesión
        localStorage.setItem('username', username.value); // Guardar el nombre de usuario
        router.push('/index'); // Redirigir a la página principal
      } else {
        alert('Por favor, ingrese usuario y contraseña');
      }
    };

    // Acción para redirigir a la ruta de registro
    const goToRegister = () => {
      router.push('/register'); // Redirigir a la página de registro
    };

    return {
      username,
      password,
      login,
      goToRegister,
    };
  },
};
</script>

<template>
  <div class="login">
    <h1>Iniciar sesión</h1>

    <div>
      <input
        type="text"
        id="username"
        v-model="username"
        placeholder="Nombre"
      />
    </div>

    <div>
      <input
        type="password"
        id="password"
        v-model="password"
        placeholder="Contraseña"
      />
    </div>

    <button @click="login">Iniciar sesión</button>
    
    <p>
      ¿No tienes una cuenta? <button @click="goToRegister">Regístrate</button>
    </p>
  </div>
</template>





  
  <style>
  .login-container {
    max-width: 300px;
    margin: auto;
    text-align: center;
  }
  input {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 8px;
  }
  .error {
    color: red;
    margin-top: 10px;
  }
  </style>
  
  
    
  
  
    