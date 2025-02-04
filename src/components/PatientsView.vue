<template>
  <div class="row">
    <div class="mb-3">
      <button class="btn btn-primary" @click="$router.push('/edit-patient')">
        Alta
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
          <td>{{ patient.zoneId }}</td>
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
    ...mapState(useDataStore, ['patients', 'getZoneNameById']),
  },

  mounted() {
    this.loadZones();
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














  