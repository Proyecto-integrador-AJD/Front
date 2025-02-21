<template>
    <div class="container elemento-show">
      <h2>Detalles de la Llamada</h2>
      <div class="card">
        <div class="card-body">
          <p><strong>Fecha:</strong> {{ call.date }}</p>
          <p><strong>Paciente:</strong> {{ getPatientFullNameById(call.patientId) }}</p>
          <p><strong>Teleoperador:</strong> {{ getUserFullNameById(call.userId) }}</p>
          <p><strong>Tipo de Llamada:</strong> {{ call.type }}</p>
          <p><strong>Subtipo:</strong> {{ call.subType  }}</p>
          <p><strong>Alerta:</strong> {{ call.alertId }}</p>
          <p><strong>Duración:</strong> {{ call.duration }} minutos</p>
          <p><strong>Descripción:</strong> {{ call.description }}</p>
        </div>
      </div>
  
      <BackButton />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapState, mapActions } from 'pinia';
  import { useDataStore } from '../stores/data';
  const API = import.meta.env.VITE_URL_API;
  import BackButton from './BackButton.vue';
  
  export default {
    components: {
      BackButton,
    },
    computed: {
    ...mapState(useDataStore, ['getPatientFullNameById', 'loadCall', 'getUserFullNameById']),
  },
    props: ['id'],
    data() {
      return {
        call: {},
      };
    },
    async mounted() {
      this.call = await this.loadCall(this.id);
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 600px;
    margin: auto;
  }
  .card {
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 10px;
  }
  </style>
