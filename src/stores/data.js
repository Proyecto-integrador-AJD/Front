import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';
const API = import.meta.env.VITE_URL_API;
// const token = '86|K9Y4Vx2jXjywZqr9PmODTtzh48OoHsAi7NioDoxR09e0bfa0';
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
const auth=useAuthStore;

export const useDataStore = defineStore('data', {
  state: () => ({
    patients: [],
    zones: [],
    calls: [],
    alerts: [],
    prefixes: [],
    languages: [],
    users: [],
    relationships: [],
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
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
    // Acción de login
    login() {
      this.isAuthenticated = true;
      localStorage.setItem('isAuthenticated', 'true');
    },

    // Acción de logout
    logout() {
      this.isAuthenticated = false;
      localStorage.removeItem('isAuthenticated');
    },

  
    async loadInitialData() {
      debugger
      auth.loadTokenFromStorage();
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
        const responsePr = await axios.get(API + '/prefix');
        this.prefixes = responsePr.data.data;
        const response = await axios.get(API + '/language');
        this.languages = response.data.data;
        const responseR = await axios.get(API + '/relationship');
        this.relationships = response.data.data;
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    },


    async loadPatients() {
      auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/patients');
        //this.patients = responseP.data;
        
        this.patients = responseP.data.data;
        
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    },
    async loadUsers() {
      auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/users');
        this.users = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    },

    async loadZones() {
      auth.loadTokenFromStorage();
      try {
        const responseZ = await axios.get(API + '/zones');
        this.zones = responseZ.data.data;
      } catch (error) {
        console.error("Error al cargar zonas:", error);
      }
    },

    async loadCalls() {
      auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/calls');
        this.calls = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar llamadas:", error);
      }
    },

    async loadAlerts() {
      auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/alerts');
        this.alerts = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar alertas:", error);
      }
    },

    async loadPrefixes() {
      auth.loadTokenFromStorage();
      try {
        const responsePr = await axios.get(API + '/prefix');
        this.prefixes = responsePr.data.data;
      } catch (error) {
        console.error("Error al cargar prefijos:", error);
      }
    },

    async loadLanguages() {
      auth.loadTokenFromStorage();
      try {
        const response = await axios.get(API + '/language');
        
        this.languages = response.data.data;  
      } catch (error) {
        console.error('Error al cargar los idioma:', error);
      }
    },

    async loadRelationships() {
      auth.loadTokenFromStorage();
      try {
        const responseR = await axios.get(API + '/relationship');
        this.relationships = responseR.data.data;  
      } catch (error) {
        console.error('Error al cargar las relaciones:', error);
      }
    },
  }
});
