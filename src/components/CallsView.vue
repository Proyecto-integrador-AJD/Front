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
            <th>Teleoperador</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="call in calls" :key="call.id">
            <td>{{ getPatientNameById(call.patientId) }}</td>
            <td>{{ getUserNameById(call.userId)}}</td>
            <td>{{ call.date}}</td>
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
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { useDataStore } from '../stores/data';
  import { mapState, mapActions } from 'pinia';
  
  const API = import.meta.env.VITE_URL_API;
  
  export default {
    computed: {
      ...mapState(useDataStore, ['calls', 'getPatientNameById', 'getUserNameById']),
    },
  
    mounted() {
      this.loadUsers();
      this.loadPatients();
      this.loadCalls();
    },
  
    methods: {
      ...mapActions(useDataStore, ['loadCalls', 'loadPatients', 'loadUsers']),
  

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

.table {
  width: 100%;
  height: 8vh;
  width: 900vh;
  border-collapse: collapse;
  table-layout: fixed;
}

.table th, .table td {
  padding: 15px;
  white-space: nowrap;
}

.table th {
  background-color: #66c2ff;
}

</style>















  