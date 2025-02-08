<template>
    <div class="login-container">
      <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <input v-model="nom" type="text" placeholder="Nombre" required />
        <input v-model="password" type="password" placeholder="Contraseña" required />
        <button class="btn btn-primary" id="iniciarButton" type="submit" :disabled="loading">
          {{ loading ? "Cargando..." : "Iniciar Sesión" }}
        </button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
  
    
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  export default {
    setup() {
      const nom = ref("");
      const password = ref("");
      const loading = ref(false);
      const error = ref(null);
      const router = useRouter();
  
      const handleLogin = async () => {
        loading.value = true;
        error.value = null;
  
        setTimeout(() => {
          localStorage.setItem("token", "token"); // Simulación de login
          localStorage.setItem("isAuthenticated", "true"); // Guardar autenticación
          router.push("/index"); // Redirigir al index
          loading.value = false;
        }, 1000);
      };
  
  
  
      return { nom, password, handleLogin, loading, error };
    },
  };
  </script>
  
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
  
  
    