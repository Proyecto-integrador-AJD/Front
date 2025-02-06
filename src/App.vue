<script>
import { useDataStore } from './stores/data';
import { mapActions, mapState } from 'pinia';


export default {
 name:'App',
computed:{
    ...mapState(useDataStore, ['users'])
  },
}
</script>

<template>
  <div class="container">
    <header>
      <nav>
        <RouterLink to="/">Inicio</RouterLink> 
        <RouterLink to="/patients">Usuarios</RouterLink>
        <RouterLink to="/calls">Llamadas</RouterLink>
        <RouterLink to="/calendar">Calendario</RouterLink>
      
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

