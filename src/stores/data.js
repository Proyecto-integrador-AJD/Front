import { defineStore } from 'pinia'
import axios from 'axios'

const API = import.meta.env.VITE_URL_API

export const useDataStore = defineStore('data', {
  state: () => ({
    patients: [],
    zones: [],
  }),

  getters: {
    getZoneNameById: (state) => (id) => {
      const zone = state.zones.find(z => String(z.id) === String(id));
      return zone ? zone.name : 'Desconocido';
    },
    getPatientNameById: (state) => (id) => {
      const patient = state.patients.find(p => String(p.id) === String(id));
      return patient ? `${patient.name} ${patient.lastName}` : 'Desconocido';
    },

    getUserNameById: (state) => (id) => {
      const user = state.users.find(u => String(u.id) === String(id));
      return user ? `${user.name} ${user.lastName}` : 'Desconocido';
    }

    
    
  },

  actions: {
    async loadPatients() {
      try {
        const responseP = await axios.get(API + '/patients');
        this.patients = responseP.data;
        //this.patients = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    },
    async loadUsers() {
      try {
        const responseP = await axios.get(API + '/users');
        this.users = responseP.data;
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    },

    async loadZones() {
      try {
        const responseZ = await axios.get(API + '/zones');
        this.zones = responseZ.data;
      } catch (error) {
        console.error("Error al cargar zonas:", error);
      }
    },

    async loadCalls() {
      try {
        const responseP = await axios.get(API + '/calls');
        this.calls = responseP.data;
      } catch (error) {
        console.error("Error al cargar llamadas:", error);
      }
    },
  }
});
