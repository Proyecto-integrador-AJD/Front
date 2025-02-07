<script>
export default {
  props: {
    selectedDate: String,
    selectedEvents: Array,
  },
  methods: {
    closeModal() {
      this.$emit('close'); // Emite un evento para cerrar el modal
    },
  },
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal">
      <h2>Detalles del Día</h2>
      <p>Fecha seleccionada: {{ selectedDate }}</p>
      <ul>
        <li v-for="(event, index) in selectedEvents" :key="index">
          {{ event.title }}
        </li>
      </ul>
      <button @click="closeModal">Cerrar</button>
    </div>
  </div>
</template>

<style scoped>
/* Asegura que el modal esté visible y bien centrado */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

/* Diseño del modal */
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  max-width: 80%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  position: relative;
}
</style>


  
  

  