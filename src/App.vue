<script>
import { useDataStore } from './stores/data'; 
import { useRoute, useRouter } from 'vue-router'; 
import { ref, computed, watch, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    const store = useDataStore();
    const router = useRouter();
    const route = useRoute();
    const isLogin = ref(false);

    // Verificamos si estamos en la página de login usando watch
    watch(route, (newRoute) => {
      isLogin.value = newRoute.name === 'login'; // Comprobamos si la ruta es la de login
    }, { immediate: true });

    // Acción de logout
    const logout = () => {
      store.logout(); // Llamamos a la acción logout del store
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('username');
      router.push('/'); // Redirigimos al login
    };

    // Cargar datos iniciales cuando se monta el componente
    onMounted(() => {
      store.loadInitialData();
    });

    // Computed para verificar si el usuario está autenticado
    const isAuthenticated = computed(() => {
      return store.isAuthenticated || localStorage.getItem('isAuthenticated') === 'true';
    });

    return {
      isLogin,
      logout,
      isAuthenticated
    };
  }
};
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
