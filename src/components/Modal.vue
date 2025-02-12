<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal">
      <slot></slot>
      <button @click="closeModal">Cerrar</button>
    </div>
  </div>

  <div v-if="isModalOpen" class="modal-overlay">
      <div class="modal">
        <!-- Botón para cerrar el modal -->
        <button @click="closeModal">Cerrar</button>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    modelValue: Boolean
  },
  computed: {
    isOpen: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    closeModal() {
      this.isOpen = false;
    }
  }
};
</script>

<style scoped>
/* Asegura que el modal esté visible y bien centrado */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex !important;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que esté por encima de todo */
}

/* Diseño del modal más grande */
.modal {
  background: #ffffff;
  padding: 30px;
  border-radius: 8px;
  text-align: center;
  width: 80%; 
  height: 80%; 
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 1001;
  position: relative;
  overflow: hidden; 
  display: flex; 
  flex-direction: column;
  justify-content: space-between; 
}


/* Asegura que el modal no esté oculto */
.modal-overlay, .modal {
  opacity: 1 !important;
  visibility: visible !important;
  display: flex !important;
  flex-direction: column;
}

/* Estilo para el nuevo botón */
button {
  background-color: #007bff;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover {
  background-color: #0056b3;
}
</style>
