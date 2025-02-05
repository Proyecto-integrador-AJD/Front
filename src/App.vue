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
        <RouterLink to="/">Inicio</RouterLink> |
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
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
