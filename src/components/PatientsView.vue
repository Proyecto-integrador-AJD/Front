<template>
  <div class="row">
    <div class="mb-3">
      <button class="btn btn-primary" @click="$router.push('/edit-patient')">
        Dar de Alta
      </button>
    </div>

    <table class="table table-striped table-hover">
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
</template>

<script>
import axios from 'axios';
import { useDataStore } from '../stores/data';
import { mapState, mapActions } from 'pinia';

const API = import.meta.env.VITE_URL_API;

export default {
  computed: {
    ...mapState(useDataStore, ['patients', 'getZoneById']),
  },
  mounted() {
    this.loadPatients();
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

/* .table {
  width: 100%;
  height: 8vh;
  width: 900vh;
  border-collapse: collapse;
  table-layout: fixed;
} */

.table th, .table td {
  padding: 15px;

}

.table th {
  background-color: #66c2ff;
}

@media (max-width: 600px) {
  table {
    display: block;
  }
  tr {
    display: flex;
    flex-direction: column;
    background: #f8f8f8;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px;
  }
  td {
    border: none;
    padding: 5px;
  }

  thead {
    display: table-header-group;
  }

  tbody {
    display: table-row-group;
  }
}

</style>















  