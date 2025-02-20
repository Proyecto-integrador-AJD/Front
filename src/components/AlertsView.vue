<template>
  <div class="row">
    <table v-if="hasAlertsCurrent()" class="table table-striped table-hover">
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
    <div v-else class="div-wrapper">
      <h2>No hay alertas para hoy</h2>
    </div>
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

    hasAlertsCurrent() {
      return this.alertsCurrent && this.alertsCurrent.length > 0;
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

<style>
  .div-wrapper {
  text-align: center;
  background: #fcfcfc;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  border: 2px solid #66c2ff;
}
</style>

  
  