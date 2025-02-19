<template>
    <div class="container" v-if="alert">
      <h2>Detalles de la Alerta</h2>
      <div class="card">
        <div class="card-body">
          <p><strong>Fecha de inicio:</strong> {{ formatDate(alert.startDate) }}</p> 
          <p><strong>Paciente:</strong> <button type="button" @click="showPatient(alert.patientId)">{{ getPatientFullNameById(alert.patientId) }}</button></p>
          <p><strong>Tipo de Llamada:</strong> {{ alert.type }}</p>
          <p><strong>Subtipo:</strong> {{ alert.subType }}</p>
          <p><strong>Duración:</strong> {{ alert.duration }} minutos</p>
          <p><strong>Descripción:</strong> {{ alert.description }}</p>
          
       
          <p><strong>Es recurrente:</strong> {{ alert.isRecurring ? 'Sí' : 'No' }}</p>
          <p v-if="alert.isRecurring">
            <strong>Tipo de recurrencia:</strong> {{ alert.recurrenceType || 'No especificado' }}
          </p>
          <p v-if="alert.isRecurring">
            <strong>Recurrencia:</strong> {{ alert.recurrence || 'No especificado' }}
          </p>
        </div>
      </div>
  
      <BackButton />
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapState } from 'pinia';
  import { useDataStore } from '../stores/data';
  import BackButton from './BackButton.vue';
  
  const API = import.meta.env.VITE_URL_API;
  
  export default {
    components: {
      BackButton,
    },
    computed: {
      ...mapState(useDataStore, ['getPatientFullNameById', 'getUserFullNameById', 'loadAlert']),
    },
    props: ['id'],
    data() {
      return {
        alert: {}, 
      };
    },
    methods: {
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString(); 
      },
      showPatient(patientId) {
        this.$router.push({ name: 'viewPatient', params: { id: patientId } });
      },
    },
    async mounted() {
      this.alert = await this.loadAlert(this.id);
      console.log("Alerta cargada:", this.alert);
      
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