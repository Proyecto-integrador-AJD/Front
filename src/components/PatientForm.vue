<template>
  <div class="row">
    <Form novalidate :validation-schema="mySchema" @submit="handleSubmit">
      <fieldset>
        <legend>{{ title }}</legend>

        <div class="form-group">
          <label>Nombre:</label>
          <Field v-model="patient.name" name="nombrePacient" class="form-control" />
          <ErrorMessage class="error" name="nombrePacient" />
        </div>

        <div class="form-group">
          <label>Apellido:</label>
          <Field v-model="patient.lastName" name="apellido" class="form-control" />
          <ErrorMessage class="error" name="apellido" />
        </div>

        <div class="form-group">
          <label>Fecha de nacimiento:</label>
          <Field v-model="patient.birthDate" name="fecha" type="date" class="form-control" />
          <ErrorMessage class="error" name="fecha" />
        </div>

        <div class="form-group">
          <label>Dirección:</label>
          <div class="form-group-multiple">
            <Field v-model="patient.addressStreet" name="calle" type="text" class="form-control" placeholder="Calle" />
            <Field v-model="patient.addressNumber" name="numero" type="text" class="form-control" placeholder="Número" />
            <Field v-model="patient.addressFloor" name="piso" type="text" class="form-control" placeholder="Piso" />
            <Field v-model="patient.addressDoor" name="puerta" type="text" class="form-control" placeholder="Puerta" />
            <Field v-model="patient.addressPostalCode" name="codigoPostal" type="text" class="form-control" placeholder="Código Postal" />
            <Field v-model="patient.addressCity" name="ciudad" type="text" class="form-control" placeholder="Ciudad" />
            <Field v-model="patient.addressProvince" name="provincia" type="text" class="form-control" placeholder="Provincia" />
            <Field v-model="patient.addressCountry" name="pais" type="text" class="form-control" placeholder="País" />
          </div>
          <ErrorMessage class="error" name="direccion" />
        </div>

        <div class="form-group">
          <label>DNI:</label>
          <Field v-model="patient.dni" name="dni" class="form-control" />
          <ErrorMessage class="error" name="dni" />
        </div>

        <div class="form-group">
          <label>Número Sanitario:</label>
          <Field v-model="patient.healthCardNumber" name="sanitario" class="form-control" />
          <ErrorMessage class="error" name="sanitario" />
        </div>

        <div class="form-group">
          <label>Teléfono:</label>
          <div class="phone-group">
            <Field v-model="patient.prefix" name="prefijo" type="text" class="form-control" placeholder="Prefijo" />
            <Field v-model="patient.phone" name="telefono" type="text" class="form-control" placeholder="Teléfono" />
          </div>
          <ErrorMessage class="error" name="telefono" />
        </div>

        <div class="form-group">
          <label>Correo:</label>
          <Field v-model="patient.email" name="correo" class="form-control" />
          <ErrorMessage class="error" name="correo" />
        </div>

        <div class="form-group">
            <label>Zona:</label>
            <Field as="select" v-model="patient.zoneId" name="zona" class="form-control">
            <option 
            v-for="zone in zones" :key="zone.id" :value="zone.id">{{ zone.name }}</option>
            </Field>
            <ErrorMessage class="error" name="zona" />
          </div>

        <div class="form-group">
          <label>Situación personal familiar:</label>
          <Field v-model="patient.situationPersonalFamily" name="situacionPersonal" class="form-control" />
          <ErrorMessage class="error" name="situacionPersonal" />
        </div>

        <div class="form-group">
          <label>Situación sanitaria:</label>
          <Field v-model="patient.healthSituation" name="situacionSanitaria" class="form-control" />
          <ErrorMessage class="error" name="situacionSanitaria" />
        </div>

        <div class="form-group">
          <label>Situacion de Alojamiento:</label>
          <div class="form-group-multiple">
            <Field v-model="patient.housingSituationType" name="tipo" type="text" class="form-control" placeholder="Tipo" />
            <Field v-model="patient.housingSituationStatus" name="estado" type="text" class="form-control" placeholder="Estado" />
            <Field v-model="patient.housingSituationNumberOfRooms" name="habitacion" type="text" class="form-control" placeholder="Habitación" />
            <Field v-model="patient.housingSituationLocation" name="localizacion" type="text" class="form-control" placeholder="Localización" />
          </div>
          <ErrorMessage class="error" name="alojamiento" />
        </div>

        <div class="form-group">
          <label>Autonomía:</label>
          <Field v-model="patient.personalAutonomy" name="autonomia" class="form-control" />
          <ErrorMessage class="error" name="autonomia" />
        </div>

        <div class="form-group">
          <label>Situación económica:</label>
          <Field v-model="patient.economicSituation" name="situacionEconomica" class="form-control" />
          <ErrorMessage class="error" name="situacionEconomica" />
        </div>

        <div class="form-group" v-for="(contact, index) in patient.emergencyContacts" :key="index">
          <label>Contacto de emergencia:</label>
          <Field v-model="contact.name" :name="'nombre' + index" placeholder="Nombre" class="form-control" />
          <Field v-model="contact.lastName" :name="'apellido' + index" placeholder="Apellido" class="form-control" />
          <Field v-model="contact.prefix" :name="'prefix' + index" type="text" placeholder="Prefijo" class="form-control" />
          <Field v-model="contact.phone" :name="'telefono' + index" type="text" placeholder="Teléfono" class="form-control" />
          <Field v-model="contact.relationship" :name="'relacion' + index" placeholder="Relación" class="form-control" />
          <ErrorMessage class="error" :name="'contacto' + index" />
        </div>

        <button type="submit" class="btn btn-primary">Guardar</button>
        <button type="button" class="btn btn-danger" @click="handleCancel">Cancelar</button>
      </fieldset>
    </Form>
  </div>
</template>

<script>
import { useDataStore } from '../stores/data';
import { mapState } from 'pinia';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import axios from 'axios';

const API = import.meta.env.VITE_URL_API;

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: ['id'],
  async mounted() {
    if (this.id) {
      const response = await axios.get(API + '/patients/' + this.id);
      this.patient = response.data;
    }
  },
  computed: {
    ...mapState(useDataStore, ['zones']),
    title() {
      return this.id ? 'Editar paciente' : 'Añadir paciente';
    },
  },
  data() {
    return {
      mySchema: yup.object({}),
      patient: {
        name: '',
        birthDate: '',
        addressStreet: '',
        addressNumber: '',
        addressFloor: '',
        addressDoor: '',
        addressPostalCode: '',
        addressCity: '',
        addressProvince: '',
        addressCountry: '',
        dni: '',
        healthCardNumber: '',
        prefix: '',
        phone: '',
        email: '',
        zoneId: '',
        situationPersonalFamily: '',
        healthSituation: '',
        housingSituationType: '',
        housingSituationStatus: '',
        housingSituationNumberOfRooms: '',
        housingSituationLocation: '',
        personalAutonomy: '',
        economicSituation: '',
        emergencyContacts: [{ name: '', lastName: '', prefix: '', phone: '', relationship: '' }],
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        if (this.id) {
          await axios.put(`${API}/patients/${this.id}`, this.patient);
        } else {
          await axios.post(`${API}/patients/`, this.patient);
        }
        this.$router.push('/patients');
      } catch (error) {
        alert('Error en la solicitud');
      }
    },
    handleCancel() {
      this.$router.push('/patients');
    },
  },
};
</script>

<style scoped>
.row {
  width: 90vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

}

Form {
  width: 90%;
  max-width: 1200px;
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.form-group label {
  font-weight: bold;
  text-align: right; 
  white-space: nowrap;
  margin-bottom: 5px; 
}

.form-group-multiple {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.phone-group {
  display: flex;
  gap: 10px;
}

.form-control {
  width: 100%;
  max-width: 220px; 
  padding: 6px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.error {
  color: red;
  font-size: 0.875rem;
}
</style>


  