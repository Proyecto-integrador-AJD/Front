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
        <tr v-for="alert in alertsCurrent" :key="alert.id">
          <td>{{ getPatientFullNameById(alert.patientId) }}</td>
          <td>{{ alert.type }}</td>
          <td>{{ formatDate(alert.startDate) }}</td>
          <td>
            <button class="btn btn-info" @click="$router.push('/view-alert/' + alert.id)">
              Ver
            </button>
            <button v-if="isToday(alert.startDate, alert.recurrenceType)"
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
      'alertsCurrent',
    ]),
  },
  methods: {
    ...mapActions(useDataStore, ['loadCalls', 'loadPatients', 'loadAlerts', 'loadAlertsCurrent']),
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    isToday(dateString, recurrenceType) {
      debugger
      const date = new Date(dateString);
      const today = new Date();

      if (recurrenceType === 'daily') {
        return true;
      }
      
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
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
    this.loadAlertsCurrent();
  },
};
</script>



  
  