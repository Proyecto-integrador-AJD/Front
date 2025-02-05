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
            <td>{{ call.patientId }}</td>
            <td>{{ call.userId}}</td>
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
      ...mapState(useDataStore, ['calls']),
    },
  
    mounted() {
      this.loadCalls();
    },
  
    methods: {
      ...mapActions(useDataStore, ['loadCalls']),
  

    }
  };
  </script>