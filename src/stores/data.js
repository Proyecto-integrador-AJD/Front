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
      const zone = state.zones.find((item) => item.id === id);  
      if (zone) return zone.name;  
      return 'Desconocido'; 
    }
  },

  actions: {
    async loadPatients() {
      try {
        const responseP = await axios.get(API + '/patients');
        this.patients = responseP.data;
      } catch (error) {
        console.error("Error al cargar pacientes:", error);
      }
    },

    async loadZones() {
      try {
        const responseZ = await axios.get(API + '/zones');
        this.zones = responseZ.data;
      } catch (error) {
        console.error("Error al cargar zonas:", error);
      }
    }
  }
});
