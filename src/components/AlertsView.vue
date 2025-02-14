<template>
    <div class="row">
      <div class="mb-3">
        <button class="btn btn-primary" @click="$router.push('/edit-call')">
          Hacer llamada
        </button>
       
      </div>
  
      <table class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>Paciente</th>
            <th>Tipo</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="alert in alerts" :key="alert.id">
            <td>{{ getPatientNameById(alert.patientId) }}</td>
            <td>{{ alert.type }}</td>
            <td>{{ formatDate(alert.startDate) }}</td>
            <td>
              <button class="btn btn-info" @click="$router.push('/view-alert/' + alert.id)">
                Ver
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
     
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from 'pinia';
  import { useDataStore } from '../stores/data';
  
  export default {
    components: {
   
    },
    data() {

    },
    computed: {
      ...mapState(useDataStore, [
        'alerts',
        'patients',
        'getPatientNameById',
       
      ]),
     
    },
    methods: {
      ...mapActions(useDataStore, ['loadCalls', 'loadPatients', 'loadAlerts']),
   
      formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString();
      },
    },
    mounted() {
      this.loadAlerts();
      this.loadPatients();
      this.loadCalls();
    },
  };
  </script>
  
  