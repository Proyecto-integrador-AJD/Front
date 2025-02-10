<template>
  <div class="row">
    <Form novalidate :validation-schema="mySchema" @submit="handleSubmit">
      <fieldset>
        <legend>{{ title }}</legend>

        <div class="form-group">
          <label>Paciente:</label>
          <Field as="select" v-model="call.patientId" name="paciente" class="form-control">
          <option 
          v-for="patient in patients" :key="patient.id" :value="patient.id">{{ patient.name }} {{ patient.lastName }}</option>
          </Field>
          <ErrorMessage class="error" name="paciente" />
        </div>

        <div class="form-group">
          <label>Teleoperador:</label>
          <Field as="select" v-model="call.userId" name="user" class="form-control">
          <option 
          v-for="user in users" :key="user.id" :value="user.id">{{ user.name }} {{ user.lastName }}</option>
          </Field>
          <ErrorMessage class="error" name="user" />
        </div>

        <div class="form-group">
          <label>Fecha:</label>
          <Field v-model="call.date" name="fecha" type="datetime" class="form-control" />
          <ErrorMessage class="error" name="fecha" />
        </div>

        <div class="form-group">
          <label>Tipo de llamada:</label>
          <Field v-model="call.type" name="tipo" class="form-control" />
          <ErrorMessage class="error" name="tipo" />
        </div>

        <div class="form-group">
          <label>Subtipo:</label>
          <Field v-model="call.subType" name="subtipo" class="form-control" />
          <ErrorMessage class="error" name="subtipo" />
        </div>

        <div class="form-group">
          <label>Alerta:</label>
          <Field v-model="call.alertId" name="alertId" type="number" class="form-control" />
          <ErrorMessage class="error" name="alertId" />
        </div>

        <div class="form-group">
          <label>Duración:</label>
          <Field v-model="call.duration" name="duracion" type="number" class="form-control" />
          <ErrorMessage class="error" name="duracion" />
        </div>

        <div class="form-group">
          <label>Descripción:</label>
          <Field v-model="call.description" name="descripcion" class="form-control" />
          <ErrorMessage class="error" name="descripcion" />
        </div>

        <div class="form-buttons">
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" class="btn btn-danger" @click="handleCancel">Cancelar</button>
        </div>
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
      const response = await axios.get(`${API}/calls/${this.id}`);
      this.call = response.data;
    }
  },
  computed: {
    ...mapState(useDataStore, ['patients', 'users']),
    title() {
      return this.id ? 'Editar llamada' : 'Añadir llamada';
    },
  },
  data() {
    return {
      mySchema: yup.object({}),
      call: {
        patientId: '',
        userId: '',
        date: '',
        type: '',
        subType: '',
        alertId: '',
        duration: '',
        description: '',
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        if (this.id) {
          await axios.put(`${API}/calls/${this.id}`, this.call);
        } else {
          await axios.post(`${API}/calls/`, this.call);
        }
        this.$router.push('/calls');
      } catch (error) {
        alert('Error en la solicitud');
      }
    },
    handleCancel() {
      this.$router.push('/calls');
    },
  },
};
</script>

<style scoped>

.row {
  /* width: 100vw;  */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

}

Form {
  width: 100%;
  max-width: 900px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  text-align: left; 
  margin-bottom: 5px;
  font-size: 0.95rem;
}


.form-control {
  width: 100%;
  max-width: 250px; 
  padding: 6px 10px;
  font-size: 0.9rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}


.form-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

button {
  padding: 8px 15px;
  font-size: 0.9rem;
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
  font-size: 0.8rem;
}
</style>

  