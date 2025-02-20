<script>
import { useDataStore } from './stores/data'; 
import { useAuthStore } from './stores/auth';
import { useRoute, useRouter } from 'vue-router'; 
import { ref, computed, watch, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    const store = useDataStore();
    const auth = useAuthStore();
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
      auth.logout();
    };

    // Cargar datos iniciales cuando se monta el componente
    onMounted(async () => {
      await store.loadInitialData();
    });

    // Computed para verificar si el usuario está autenticado
    const isAuthenticated = computed(() => {
      return auth.isAuthenticated || localStorage.getItem('isAuthenticated') === 'true';
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
    <header v-if="isAuthenticated && !isLogin">
      <!-- Solo mostrar el nav si está autenticado y no estamos en la página de login -->
      <nav>
        <RouterLink class="menu-item" to="/index">Inicio</RouterLink>
        <RouterLink class="menu-item" to="/patients">Usuarios</RouterLink>
        <RouterLink class="menu-item" to="/calls">Llamadas</RouterLink>
        <RouterLink class="menu-item" to="/alerts">Alertas</RouterLink>
        <RouterLink class="menu-item" to="/calendar">Calendario</RouterLink>
        <button @click="logout" class="menu-button">Cerrar Sesión</button>
      </nav>
    </header>

    <RouterView class="margin-container"/>

    <footer></footer>
  </div>
</template>





<style scoped>
/* header {
  background-color: #66c2ff;
  padding: 15px;
  text-align: center;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
} */
 
.margin-container {
 margin-top: 60px;
 margin-bottom: 40px;
}

@media (max-width: 671px) {
  .margin-container {
    margin-top: 115px;
    margin-bottom: 40px;
  }
}

@media (max-width: 576px) {
  .margin-container {
    margin-top: 0;
    margin-bottom: 20px;
  }
}

nav {
  display: flex;
  justify-content: center;
  text-align: center;
  gap: 15px;
}

nav a {
  color: black;
  font-weight: bold;
  text-decoration: none;
  padding: 5px 10px;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
}

nav a:hover {
  background-color: #85d2f3;
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
