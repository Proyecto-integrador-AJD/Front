<template>
  <div class="row">
    <div class="mb-3">
      <button class="btn btn-primary" @click="$router.push('/edit-patient')">
        Dar de Alta
      </button>
    </div>

    <div class="table-responsive">
      <table id="patientTable" class="table table-striped table-hover">
        <thead class="thead-dark">
          <tr>
            <th>Nombre</th>
            <th>DNI</th>
            <th>Teléfono</th>
            <th>Zona</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in patients" :key="patient.id">
            <td>{{ patient.name }} {{ patient.lastName }}</td>
            <td>{{ patient.dni }}</td>
            <td>{{ patient.phone }}</td>
            <td>{{ getZoneById(patient.zoneId).name}}</td>
            <td>
              <button class="btn btn-info" @click="$router.push('/view-patient/' + patient.id)">
                Ver
              </button>
              <button class="btn btn-secondary" @click="$router.push('/edit-patient/' + patient.id)">
                Editar
              </button>
              <button class="btn btn-danger" @click="delPatient(patient)">
                Baja
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { useDataStore } from '../stores/data';
import { mapState, mapActions } from 'pinia';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net-dt';
import 'datatables.net-bs5';
import 'datatables.net-responsive-dt/css/responsive.dataTables.css';
import 'datatables.net-responsive-dt';


const API = import.meta.env.VITE_URL_API;

export default {
  computed: {
    ...mapState(useDataStore, ['patients', 'getZoneById']),
  },
  mounted() {
    this.loadPatients();
    this.initDataTable();
    window.addEventListener('resize', this.adjustTable);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.adjustTable);
  },
  updated() {
    this.initDataTable();
  },
  methods: {
    ...mapActions(useDataStore, ['loadZones', 'loadPatients']),

    async delPatient(patient) {
      if (confirm(`¿Seguro que deseas eliminar a ${patient.name} ${patient.lastName}?`)) {
        try {
          await axios.delete(`${API}/patients/${patient.id}`);
          
          this.loadPatients();
          alert('Paciente dado de baja con éxito');
        } catch (error) {
          alert('Error al dar de baja al paciente: ' + error.message);
        }
      }
    },

    initDataTable() {
      setTimeout(() => {
        if ($.fn.DataTable.isDataTable('#patientTable')) {
          $('#patientTable').DataTable().destroy();
        }

        $('#patientTable').DataTable({
          responsive: true, // Asegura que se active el modo responsive
          autoWidth: false,
          language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json'
          }
        });
      }, 500);
    },

    adjustTable() {
      const table = $('#patientTable').DataTable();
      if (table) {
        table.columns.adjust().responsive.recalc();
      }
    }
  }
};
</script>

<style scoped>
.full-screen {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
}

.table-container {
  flex-grow: 1;
  overflow: auto;
  width: 100%;
}

.table th, .table td {
  padding: 15px;

}

.table th {
  background-color: #66c2ff;
}
/* .table {
  width: 100%;
  height: 8vh;
  width: 900vh;
  border-collapse: collapse;
  table-layout: fixed;
} */

</style>















  