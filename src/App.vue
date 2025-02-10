<script>
import { useDataStore } from './stores/data';
import { mapState } from 'pinia';
import { useRoute, useRouter } from 'vue-router'; 
import { ref, watch } from 'vue'; 

export default {
  name: 'App',
  computed: {
    ...mapState(useDataStore, ['users']),
    isAuthenticated() {
      return localStorage.getItem('isAuthenticated') === 'true'; // Comprobar si el usuario está autenticado
    }
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const isLogin = ref(false); 

    // Usamos un watch para observar los cambios en la ruta
    watch(route, (newRoute) => {
      isLogin.value = newRoute.name === 'login'; // Verificamos si la ruta actual es la de login
    }, { immediate: true });

    const logout = () => {
      localStorage.removeItem('isAuthenticated'); // Eliminar autenticación
      localStorage.removeItem('username'); // Eliminar nombre de usuario
      router.push('/'); // Redirigir a la página de login
    }

    return {
      isLogin,
      logout,
    };
  }
}
</script>

<template>
  <div class="container">
    <header>
      <!-- Solo mostrar el nav si está autenticado y no estamos en la página de login -->
      <nav v-if="isAuthenticated && !isLogin">
        <RouterLink to="/index">Inicio</RouterLink>
        <RouterLink to="/patients">Usuarios</RouterLink>
        <RouterLink to="/calls">Llamadas</RouterLink>
        <RouterLink to="/calendar">Calendario</RouterLink>
        <button @click="logout" class="btn btn-primary">Cerrar Sesión</button>

      </nav>
    </header>

    <RouterView />

    <footer></footer>
  </div>
</template>




<style scoped>
header {
  background-color: #66c2ff;
  padding: 15px;
  text-align: center;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

nav {
  display: flex;
  justify-content: center;
  gap: 15px;
}

nav a {
  color: black;
  font-weight: bold;
  text-decoration: none;
  padding: 5px 10px;
  transition: background 0.3s ease-in-out;
}

nav a:hover {
  background-color: #89DCFF;
  border-radius: 5px;
}

.container {
  padding-top: 60px;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
