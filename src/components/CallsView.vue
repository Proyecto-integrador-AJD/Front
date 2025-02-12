<template>
  <div class="row">
    <div class="mb-3">
      <button class="btn btn-primary" @click="$router.push('/edit-call')">
        Hacer llamada
      </button>
      <button class="btn btn-primary" @click="toggleFilter">
        {{ isFiltering ? 'Dejar de Filtrar' : 'Filtrar' }}
      </button>
    </div>

    <table class="table table-striped table-hover">
      <thead class="thead-dark">
        <tr>
          <th>Paciente</th>
          <th>Teleoperador</th>
          <th>Tipo</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="call in filteredCalls" :key="call.id">
          <td>{{ getPatientNameById(call.patientId) }}</td>
          <td>{{ getUserNameById(call.userId) }}</td>
          <td>{{ call.type }}</td>
          <td>{{ call.date }}</td>
          <td>
            <button class="btn btn-info" @click="$router.push('/view-call/' + call.id)">
              Ver
            </button>
            <button class="btn btn-secondary" @click="$router.push('/edit-call/' + call.id)">
              Editar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal de filtro -->
    <Modal :modelValue="isModalOpen" @update:modelValue="isModalOpen = $event">
      <h3>Filtrar Llamadas</h3>

      <div class="form-group">
        <label for="patientSelect">Paciente:</label>
        <div class="select-container">
          <select id="patientSelect" v-model="selectedPatientId" class="form-control">
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.name }} {{ patient.lastName }}
            </option>
          </select>
        </div>

        <label for="teleoperadorSelect">Teleoperador:</label>
        <div class="select-container">
          <select id="teleoperadorSelect" v-model="selectedTeleoperadorId" class="form-control">
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }} {{ user.lastName }}
            </option>
          </select>
        </div>

        <label for="tipoSelect">Tipo:</label>
        <div class="select-container">
          <select v-if="calls && calls.length" id="tipoSelect" v-model="selectedTipoId" class="form-control">
            <option v-for="call in calls" :key="call.id" :value="call.type">
              {{ call.type }}
            </option>
          </select>
        </div>
      </div>

      <button class="btn btn-primary mt-3" @click="applyFilter">Aplicar Filtro</button>
    </Modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import Modal from './Modal.vue';
import { useDataStore } from '../stores/data';

export default {
  components: {
    Modal,
  },
  data() {
    return {
      isModalOpen: false,
      isFiltering: false,
      selectedPatientId: null,
      selectedTeleoperadorId: null,
      selectedTipoId: null,
    };
  },
  computed: {
    ...mapState(useDataStore, ['calls', 'patients', 'users', 'getPatientNameById', 'getUserNameById']),
    filteredCalls() {
      // Verifica si estamos filtrando
      if (!this.isFiltering) return this.calls; // Si no hay filtro, devuelve todas las llamadas

      return this.calls.filter(call => {
        // Aseguramos que todos los valores sean números antes de compararlos
        const matchesPatient = this.selectedPatientId
          ? Number(call.patientId) === Number(this.selectedPatientId)
          : true;

        const matchesTeleoperador = this.selectedTeleoperadorId
          ? Number(call.userId) === Number(this.selectedTeleoperadorId)
          : true;
        
        const matchesTipo = this.selectedTipoId
          ? call.type === this.selectedTipoId
          : true;

        return matchesPatient && matchesTeleoperador && matchesTipo;
      });
    },
  },
  methods: {
    ...mapActions(useDataStore, ['loadCalls', 'loadPatients', 'loadUsers']),
    toggleFilter() {
      if (this.isFiltering) {
        // Si estamos filtrando, se resetean los filtros y se desactiva el filtro
        this.isFiltering = false;
        this.selectedPatientId = null;
        this.selectedTeleoperadorId = null;
        this.selectedTipoId = null;
      } else {
        // Si no estamos filtrando, se abre el modal
        this.isModalOpen = true;
      }
    },
    applyFilter() {
      this.isFiltering = true;
      this.isModalOpen = false;
    },
  },
  mounted() {
    //this.loadUsers();
    //this.loadPatients();
   // this.loadCalls();
  },
};
</script>

<style scoped>
/* Estilo para el contenedor de select para centrarlo */
.select-container {
  display: flex;
  justify-content: center;
}

.form-group {
  margin-bottom: 20px;
}

select.form-control {
  max-width: 300px;  /* Ajusta el ancho del select */
  font-size: 0.875rem; /* Ajusta el tamaño de la fuente */
}

button {
  margin-top: 15px;
}
</style>

















  