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
          <th>Saliente/Entrante</th>
          <th>Subtipo</th>
          <th>Fecha</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="call in filteredCalls" :key="call.id">
          <td>{{ getPatientNameById(call.patientId) }}</td>
          <td>{{ getUserNameById(call.userId) }}</td>
          <td>{{ call.incoming == 1 ? 'Entrante' : 'Saliente' }}</td>
          <td>{{ call.subType }}</td>
          <td>{{ formatDate(call.date) }}</td>
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

      <!-- Filtro por Paciente -->
      <div class="form-group">
        <label for="patientSelect">Paciente:</label>
        <div class="select-container">
          <select id="patientSelect" v-model="selectedPatientId" class="form-control">
            <option value="">Todos</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.name }} {{ patient.lastName }}
            </option>
          </select>
        </div>
      </div>

      <!-- Filtro por Teleoperador -->
      <div class="form-group">
        <label for="teleoperadorSelect">Teleoperador:</label>
        <div class="select-container">
          <select id="teleoperadorSelect" v-model="selectedTeleoperadorId" class="form-control">
            <option value="">Todos</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.name }} {{ user.lastName }}
            </option>
          </select>
        </div>
      </div>

      <!-- Selección única para Saliente o Entrante -->
      <div class="form-group">
        <label>Tipo de llamada:</label>
        <div>
          <label>
            <input
              type="radio"
              name="callDirection"
              value="0"
              v-model="selectedCallDirection"
            />
            Saliente
          </label>
          <label style="margin-left: 1em;">
            <input
              type="radio"
              name="callDirection"
              value="1"
              v-model="selectedCallDirection"
            />
            Entrante
          </label>
        </div>
      </div>

      <!-- Opciones para llamadas Salientes -->
      <div class="form-group" v-if="selectedCallDirection === '0'">
        <label for="salienteOptions">Opciones Saliente:</label>
        <select id="salienteOptions" v-model="selectedSalienteOption" class="form-control">
          <option value="">Seleccione...</option>
          <option value="No planificades">No planificades</option>
          <option value="Planificades o agendades">Planificades o agendades</option>
        </select>
      </div>

      <!-- Opciones para llamadas Entrantes -->
      <div class="form-group" v-if="selectedCallDirection === '1'">
        <label for="entranteOptions">Opciones Entrante:</label>
        <select id="entranteOptions" v-model="selectedEntranteOption" class="form-control">
          <option value="">Seleccione...</option>
          <optgroup label="Atenció d’emergències">
            <option value="Emergències socials">Emergències socials</option>
            <option value="Emergències sanitàries">Emergències sanitàries</option>
            <option value="Crisi de soledat o angoixa">Crisi de soledat o angoixa</option>
            <option value="Alarma sense resposta">Alarma sense respuesta</option>
          </optgroup>
          <optgroup label="Comunicacions no urgents">
            <option value="Notificar absències o retorns">Notificar absències o retorns</option>
            <option value="Modificar dades personales">Modificar dades personales</option>
            <option value="Cridades accidentals">Cridades accidentals</option>
            <option value="Petició d’información">Petició d’información</option>
            <option value="Formulació de suggeriments, queixes o reclamacions">
              Formulació de suggeriments, queixes o reclamacions
            </option>
            <option value="Cridades socials">Cridades socials</option>
            <option value="Registrar cites mèdiques arran d’una crida">
              Registrar cites mèdiques arran d’una crida
            </option>
            <option value="Altres tipus de crides">Altres tipus de crides</option>
          </optgroup>
        </select>
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
      // "" sin selección, "0" para Saliente y "1" para Entrante
      selectedCallDirection: "",
      selectedSalienteOption: "",
      selectedEntranteOption: "",
    };
  },
  computed: {
    ...mapState(useDataStore, [
      'calls',
      'patients',
      'users',
      'getPatientNameById',
      'getUserNameById',
    ]),
    filteredCalls() {
      let filtered = this.calls;

      // Filtrado por paciente
      if (this.selectedPatientId) {
        filtered = filtered.filter(
          (call) => Number(call.patientId) === Number(this.selectedPatientId)
        );
      }

      // Filtrado por teleoperador
      if (this.selectedTeleoperadorId) {
        filtered = filtered.filter(
          (call) => Number(call.userId) === Number(this.selectedTeleoperadorId)
        );
      }

      // Filtrado por dirección (Saliente o Entrante)
      if (this.selectedCallDirection !== "") {
        filtered = filtered.filter(
          (call) => Number(call.incoming) === Number(this.selectedCallDirection)
        );
      }

      // Filtrado adicional según la opción seleccionada
      if (this.selectedCallDirection === "0" && this.selectedSalienteOption) {
        filtered = filtered.filter((call) => call.type === this.selectedSalienteOption);
      }
      if (this.selectedCallDirection === "1" && this.selectedEntranteOption) {
        // Aquí filtramos por subType para llamadas entrantes
        filtered = filtered.filter((call) => call.subType === this.selectedEntranteOption);
      }

      return filtered;
    },
  },
  methods: {
    ...mapActions(useDataStore, ['loadCalls', 'loadPatients', 'loadUsers']),
    toggleFilter() {
      if (this.isFiltering) {
        // Resetear todos los filtros
        this.isFiltering = false;
        this.selectedPatientId = null;
        this.selectedTeleoperadorId = null;
        this.selectedCallDirection = "";
        this.selectedSalienteOption = "";
        this.selectedEntranteOption = "";
      } else {
        this.isModalOpen = true;
      }
    },
    applyFilter() {
      this.isFiltering = true;
      this.isModalOpen = false;
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
  },
  mounted() {
    this.loadUsers();
    this.loadPatients();
    this.loadCalls();
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

















  