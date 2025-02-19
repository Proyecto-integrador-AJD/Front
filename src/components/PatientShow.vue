<template>
  <div class="container">
    <h2>Detalles del Paciente</h2>
    <div class="card">
      <div class="card-body">
        <p><strong>Nombre:</strong> {{ patient.name }} {{ patient.lastName }}</p>
        <p><strong>Fecha de nacimiento:</strong> {{ patient.birthDate }}</p>
        <p><strong>Dirección:</strong> {{ patient.addressStreet }}, numero {{ patient.addressNumber }},
          piso {{ patient.addressFloor }}, puerta {{ patient.addressDoor }}, CP {{ patient.addressPostalCode }}, ciudad:
          {{ patient.addressCity }},
          provincia: {{ patient.addressProvince }}, pais: {{ patient.addressCountry }}</p>
        <p><strong>DNI:</strong> {{ patient.dni }}</p>
        <p><strong>Numero sanitario:</strong> {{ patient.healthCardNumber }}</p>
        <p><strong>Teléfono:</strong> {{ patient.prefix }} {{ patient.phone }}</p>
        <p><strong>Correo:</strong> {{ patient.email }}</p>
        <!-- <p><strong>Zona:</strong> {{ getZoneName(patient.zoneId) }}</p> -->
        <p><strong>Situación Personal:</strong> {{ patient.situationPersonalFamily }}</p>
        <p><strong>Situación Sanitaria:</strong> {{ patient.healthSituation }}</p>
        <p><strong>Situación de Alojamiento:</strong> {{ patient.housingSituationType }}, {{
          patient.housingSituationStatus }},
          {{ patient.housingSituationNumberOfRooms }} habitaciones, {{ patient.housingSituationLocation }}</p>
        <p><strong>Autonomia:</strong> {{ patient.personalAutonomy }}</p>
        <p><strong>Situacion Economica:</strong> {{ patient.economicSituation }}</p>

        <h4>Contactos de Emergencia</h4>
        <ul>
          <li v-for="(contact, index) in patient.emergencyContacts" :key="index">
            {{ contact.name }} {{ contact.lastName }} - {{ contact.phone }} ({{ contact.relationship }})
          </li>
        </ul>
      </div>
    </div>

    <BackButton />
  </div>
</template>

<script>
import axios from 'axios';
import { mapState, mapActions } from 'pinia';
import { useDataStore } from '../stores/data';
import BackButton from './BackButton.vue';
const API = import.meta.env.VITE_URL_API;

export default {
  components: {
    BackButton,
  },
  computed: {
    ...mapState(useDataStore, ['getZoneById', 'loadPatient']),
  },
  props: ['id'],
  data() {
    return {
      patient: {},
    };
  },
  async mounted() {
    this.patient = await this.loadPatient(this.id);
    console.log(this.patient);
  },
  methods: {
    getZoneName(zoneId) {
      const zone = this.getZoneById(zoneId);
      return zone.name;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

.card {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 10px;
}
</style>