<template>
  <div class="login-container">
    <h2>Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <input type="text" v-model="username" placeholder="Username" class="input-login"/>
        <input type="password" v-model="password" placeholder="Password" class="input-login"/><br>
        <button class="btn btn-primary button-login" type="submit" :disabled="loading">
          {{ loading ? "Cargando..." : "Iniciar Sesión" }}
        </button>
        <button class="btn btn-primary button-login" @click="$router.push('/register')" :disabled="loading">
          {{ loading ? "Cargando..." : "Resgistrarse" }}
        </button>
      </form>
  </div>
</template>

<script>
import { useAuthStore } from "../stores/auth";
import { useDataStore } from "../stores/data";
import axios from "axios";

export default {
  name: "LoginView",
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    async handleLogin() {
      const authStore = useAuthStore();
      const dataStore = useDataStore();
      try {
        const API = import.meta.env.VITE_URL_API;
        const response = await axios.post(`${API}/login`, {
          username: this.username,
          password: this.password,
        });

        if (response.status === 200) {
          const token = response.data.data.token;

          authStore.setToken(token); // Llama a la función para guardar el token
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          console.log(authStore.token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          await dataStore.loadUser();
          const user = dataStore.user; 
           // Buscamos al usuario logueado por su email
          console.log(token);
          
          if(user){
            localStorage.setItem("user", JSON.stringify(user));
            this.$router.push("/index"); // Redirige al usuario después de iniciar sesión
        }else{
          alert("Usuario no encontrado");
        }
      }

        
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Credenciales incorrectas o error al iniciar sesión");
      }
    },
  },
  created() {
    // Carga el token almacenado si es necesario
    const authStore = useAuthStore();
    authStore.loadTokenFromStorage();
  },
  mounted() {
    document.body.classList.add("login-page");
  },
  beforeUnmount() {
    document.body.classList.remove("login-page");
  }
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
  
  
    
  
  
    