<template>
    <div class="row">
      <Form novalidate :validation-schema="mySchema" @submit="handleSubmit">
        <fieldset>
          <legend>{{ title }}</legend>
  
          <div class="form-group">
            <label>Paciente:</label>
            <Field v-model="call.patientId" name="paciente" type="number" class="form-control" />
            <ErrorMessage class="error" name="paciente" />
          </div>
  
          <div class="form-group">
            <label>Teleoperador:</label>
            <Field v-model="call.userId" name="teleoperador" type="number" class="form-control" />
            <ErrorMessage class="error" name="teleoperador" />
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
            <label>ID de alerta:</label>
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
  
          <button type="submit" class="btn btn-primary">Guardar</button>
          <button type="button" class="btn btn-danger" @click="handleCancel">Cancelar</button>
        </fieldset>
      </Form>
    </div>
  </template>
  
  <script>
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
  .error {
    color: red;
  }
  </style>
  