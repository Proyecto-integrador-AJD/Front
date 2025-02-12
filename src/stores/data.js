import { defineStore } from 'pinia'
import axios from 'axios'

const API = import.meta.env.VITE_URL_API
const token='13|JL9fQNAK6Tz9PFYLcGYBAkL5W6978ri8KzCtWu5z43b80763';

axios.defaults.headers.common['Authorization']=`Bearer ${token}`;

export const useDataStore = defineStore('data', {
  state: () => ({
    patients: [],
    zones: [],
    calls:[],
    alerts:[],
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
    },
    
    getPatientPhoneById: (state) => (id) => {
      const patient = state.patients.find(p => String(p.id) === String(id));
      return patient ? patient.phone : 'No disponible';
    },

    
    
  },

  actions: {
    async loadInitialData() {
      try {
        const responseP = await axios.get(API + '/patients');
        this.patients = responseP.data.data;
        const responseD = await axios.get(API + '/users');
        this.users = responseD.data.data;
        const responseZ = await axios.get(API + '/zones');
        this.zones = responseZ.data.data;
        const responseC = await axios.get(API + '/calls');
        this.calls = responseC.data.data;
        const responseA = await axios.get(API + '/alerts');
        this.alerts = responseA.data.data;
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    },
    async loadPatients() {calls
      try {
        const responseP = await axios.get(API + '/patients');
        //this.patients = responseP.data;
        
        this.patients = responseP.data.data;
        
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    },
    async loadUsers() {
      try {
        const responseP = await axios.get(API + '/users');
        this.users = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    },

    async loadZones() {
      try {
        const responseZ = await axios.get(API + '/zones');
        this.zones = responseZ.data.data;
      } catch (error) {
        console.error("Error al cargar zonas:", error);
      }
    },

    async loadCalls() {
      try {
        const responseP = await axios.get(API + '/calls');
        this.calls = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar llamadas:", error);
      }
    },

    async loadAlerts() {
      try {
        const responseP = await axios.get(API + '/alerts');
        this.alerts = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar alertas:", error);
      }
    },
  }
});
