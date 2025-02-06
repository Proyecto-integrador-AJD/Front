<template>
    <div id="app">
      <button @click="openModal">Abrir Modal</button>
  
      <Modal ref="modal">
        <h2>Contenido del Modal</h2>
        <p>Este es un ejemplo de contenido personalizado dentro del modal.</p>
      </Modal>
    </div>
  </template>
  
  <script>
  import Modal from './Modal.vue';
  
  export default {
    components: {
      Modal,
    },
    methods: {
      openModal() {
        this.$refs.modal.openModal(); // Abre el modal al hacer clic en el botón
      },
    },
  };
  </script>
  