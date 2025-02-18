import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';
const API = import.meta.env.VITE_URL_API;
// const token = '86|K9Y4Vx2jXjywZqr9PmODTtzh48OoHsAi7NioDoxR09e0bfa0';
// axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

export const useDataStore = defineStore('data', {
  state: () => ({
    auth: useAuthStore(),
    patients: [],
    patientsCurrent: [],
    zones: [],
    calls: [],
    alerts: [],
    alertTypes: [],
    alertsCurrent: [],
    prefixes: [],
    languages: [],
    users: [],
    user: [],
    relationships: [],
    isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  }),

  getters: {
    getZoneById: (state) => (id) => {
      return state.zones.find(z => String(z.id) === String(id));
    },
    getPatientFullNameById: (state) => (id) => {
      const patient = state.patients.find(p => String(p.id) === String(id));
      return patient ? `${patient.name} ${patient.lastName}` : 'Desconocido';
    },
    getPatientById: (state) => (id) => {
      return state.patients.find(p => String(p.id) === String(id));
    },
    getUserFullNameById: (state) => (id) => {
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
      
      this.auth.loadTokenFromStorage();
      try {
        // const responseP = await axios.get(API + '/patients');
        // this.patients = responseP.data.data;
        await this.loadPatients();
        // const responseD = await axios.get(API + '/users');
        // this.users = responseD.data.data;
        await this.loadUsers();
        // const responseZ = await axios.get(API + '/zones');
        // this.zones = responseZ.data.data;
        await this.loadZones();
        // const responseC = await axios.get(API + '/calls');
        // this.calls = responseC.data.data;
        await this.loadCalls();
        // const responseA = await axios.get(API + '/alerts');
        // this.alerts = responseA.data.data;
        await this.loadAlerts();
        // const responsePr = await axios.get(API + '/prefix');
        // this.prefixes = responsePr.data.data;
        await this.loadPrefixes();
        // const response = await axios.get(API + '/language');
        // this.languages = response.data.data;
        await this.loadLanguages();
        // const responseR = await axios.get(API + '/relationship');
        // this.relationships = response.data.data;
        await this.loadRelationships();
        await this.loadUser();
        await this.loadAlertTypes();
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    },


    async loadUser() {
      this.auth.loadTokenFromStorage();
      try {
        const responseU = await axios.get(API + '/user');
        this.user = responseU.data.data;
      } catch (error) {
        console.error("Error al cargar usuario:", error);
      }
    },

    async loadPatients() {
      this.auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/patients');
        this.patients = responseP.data.data;
        
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    },
    async loadPatient(id) {
      this.auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/patients/' + id);
        return responseP.data.data;
        } catch (error) {
          console.error("Error al cargar pacientes:", error);
      }
    },
    async loadPatientsCurrentUser() {
      this.auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/patients/current');
        this.patientsCurrent = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    },
    async loadUsers() {
      this.auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/users');
        this.users = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar usuarios:", error);
      }
    },

    async loadZones() {
      this.auth.loadTokenFromStorage();
      try {
        const responseZ = await axios.get(API + '/zones');
        this.zones = responseZ.data.data;
      } catch (error) {
        console.error("Error al cargar zonas:", error);
      }
    },

    async loadCalls() {
      this.auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/calls');
        this.calls = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar llamadas:", error);
      }
    },
    async loadCall(id) {
      this.auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/calls/' + id);
        return responseP.data.data;
      } catch (error) {
        console.error("Error al cargar llamadas:", error);
      }
    },

    async loadAlerts() {
      this.auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/alerts');
        this.alerts = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar alertas:", error);
      }
    },

    async loadAlert(id) {
      this.auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/alerts/' + id);
        return responseP.data.data;
      } catch (error) {
        console.error("Error al cargar alertas:", error);
      }
    },
    async loadAlertsCurrent() {
      this.auth.loadTokenFromStorage();
      try {
        const responseP = await axios.get(API + '/alerts/user');
        this.alertsCurrent = responseP.data.data;
      } catch (error) {
        console.error("Error al cargar alertas:", error);
      }
    },

    async loadPrefixes() {
      this.auth.loadTokenFromStorage();
      try {
        const responsePr = await axios.get(API + '/prefix');
        this.prefixes = responsePr.data.data;
      } catch (error) {
        console.error("Error al cargar prefijos:", error);
      }
    },

    async loadLanguages() {
      this.auth.loadTokenFromStorage();
      try {
        const response = await axios.get(API + '/language');
        
        this.languages = response.data.data;
      } catch (error) {
        console.error('Error al cargar los idioma:', error);
      }
    },

    async loadRelationships() {
      this.auth.loadTokenFromStorage();
      try {
        const responseR = await axios.get(API + '/relationship');
        this.relationships = responseR.data.data;  
      } catch (error) {
        console.error('Error al cargar las relaciones:', error);
      }
    },

    async loadAlertTypes() {
      this.auth.loadTokenFromStorage();
      try {
        let response = await axios.get(API + '/alert/types');
        this.alertTypes = response.data.data;
      } catch (error) {
        console.error('Error al cargar los tipos de alerta:', error);
      }
    },


    
    async loadAlertById(id) {
      this.auth.loadTokenFromStorage();
      try {
        const response = await axios.get(API + '/alerts/' + id);
        return response.data.data;
      } catch (error) {
        console.error('Error al cargar alerta:', error);
      }
    },
    
    async loadCallById(id) {
      this.auth.loadTokenFromStorage();
      try {
        const response = await axios.get(API + '/calls/' + id);
        return response.data.data;
      } catch (error) {
        console.error('Error al cargar Calls:', error);
      }
    },
    async loadPatientById(id) {
      this.auth.loadTokenFromStorage();
      try {
        const response = await axios.get(API + '/patients/' + id);
        return response.data.data;
      } catch (error) {
        console.error('Error al cargar Patients:', error);
      }
    },
  }
});
