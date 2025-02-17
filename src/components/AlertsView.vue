<template>
  <div class="row">
    <div class="mb-3">
     
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
          <td>{{ getPatientFullNameById(alert.patientId) }}</td>
          <td>{{ alert.type }}</td>
          <td>{{ formatDate(alert.startDate) }}</td>
          <td>
            <button class="btn btn-info" @click="$router.push('/view-alert/' + alert.id)">
              Ver
            </button>
            <button 
              class="btn btn-primary ml-2" 
              @click="handleCallClick(alert.id)"
            >
              Hacer llamada
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
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState(useDataStore, [
      'alerts',
      'patients',
      'getPatientFullNameById',
    ]),
  },
  methods: {
    ...mapActions(useDataStore, ['loadCalls', 'loadPatients', 'loadAlerts']),
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    
    handleCallClick(alertId) {
      // Redirige a la pantalla de llamada con los parámetros alertId y patientId
      this.$router.push({
        name: 'addCall',
        query: { alertId }
      });
    },
  },
  mounted() {
    this.loadAlerts();
    this.loadPatients();
    this.loadCalls();
  },
};
</script>



  
  