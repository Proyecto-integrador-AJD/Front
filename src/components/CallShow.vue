<template>
    <div class="container">
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
  
      <button class="btn btn-secondary mt-3" @click="$router.push('/calls')">Volver</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapState, mapActions } from 'pinia';
  import { useDataStore } from '../stores/data';
  const API = import.meta.env.VITE_URL_API;
  
  export default {
    computed: {
    ...mapState(useDataStore, ['getPatientFullNameById', 'findCallById', 'getUserFullNameById']),
  },
    props: ['id'],
    data() {
      return {
        call: {},
      };
    },
    mounted() {
      this.call = this.findCallById(this.id);
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
