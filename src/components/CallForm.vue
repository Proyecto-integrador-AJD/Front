<template>
  <div class="row">
    <Form novalidate :validation-schema="mySchema" @submit="handleSubmit" class="form-datos">
      <fieldset>
        <legend>{{ title }}</legend>

        <div class="form-group">
          <label>Paciente:</label>
          <Field as="select" v-model="call.patientId" name="patientId" class="form-control" :disabled="!call.incoming && alert.patientId ">
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.name }} {{ patient.lastName }}
            </option>
          </Field>
          <ErrorMessage class="error" name="patientId" />
        </div>

        <div class="form-group">
          <label>Teleoperador:</label>
          <div class="form-control-plaintext">
            {{ loggedUser }}
          </div>
        </div>

        <div class="form-group">
          <label>Tipo de llamada (Entrante/Saliente):</label>
          <Field as="select" v-model="call.incoming" name="incoming" class="form-control" :disabled="!alert.id">
            <option :value="true">Entrante</option>
            <option :value="false">Saliente</option>
          </Field>
          <ErrorMessage class="error" name="incoming" />
        </div>

        <div v-if="call.incoming === false" class="form-group">
          <label>Información de Alerta:</label>
          
          <div class="flex justify-center items-center min-h-screen bg-gray-100">
            <form class="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
              <h2 class="text-xl font-semibold text-gray-700 mb-4">Detalles de la Alerta</h2>

              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-600">Tipo</label>
                  <input type="text" :value="alert.type" disabled class="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600">Subtipo</label>
                  <input type="text" :value="alert.subType" disabled class="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600">Descripción</label>
                  <textarea :value="alert.description" disabled class="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500"></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-600">Fecha de Inicio</label>
                  <input type="text" :value="alert.startDate" disabled class="w-full mt-1 p-2 border rounded-lg bg-gray-100 text-gray-500" />
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Luego se tiene que poner a un select, cunado se termine la api en el back -->
        <div class="form-group">
          <label>Tipo:</label>
          <Field v-model="call.type" name="tipo" type="text" class="form-control" />
          <ErrorMessage class="error" name="tipo" />
        </div>
        

        <!-- Luego se tiene que poner a un select, cunado se termine la api en el back -->
        <div class="form-group">
          <label>SubTipo:</label>
          <Field v-model="call.subType" name="subtipo" type="text" class="form-control" />
          <ErrorMessage class="error" name="subtipo" />
        </div>

        <div class="form-group">
          <label>Duración:</label>
          <Field v-model="call.duration" name="duration" type="number" class="form-control" />
          <ErrorMessage class="error" name="duration" />
        </div>

        <div class="form-group">
          <label>Descripción:</label>
          <Field v-model="call.description" name="description" class="form-control" />
          <ErrorMessage class="error" name="description" />
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
import { mapState, mapActions } from 'pinia';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import axios from 'axios';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const API = import.meta.env.VITE_URL_API;

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: ['id'],
  async mounted() {
    const route = useRoute();
    const alertId = route.query.alertId;
    await this.loadPatients();
    await this.loadAlerts();
    await this.loadUsers();
    await this.loadUser();
    const user = JSON.parse(localStorage.getItem("user"));
    this.loggedUser = user ? user.name : "Usuario";
    if (this.id) {
      const response = await axios.get(`${API}/calls/${this.id}`);
      this.call = response.data.data;
    }
    if (alertId) {
      const response = await axios.get(`${API}/alerts/${alertId}`);
      this.alert = response.data.data;
      this.call.alertId = this.alert.id;
      this.call.patientId = this.alert.patientId;
      this.alert.id = this.alert.id;
      this.alert.type = this.alert.type;
      this.alert.subType = this.alert.subType;
      this.alert.description = this.alert.description;
      this.alert.startDate = this.alert.startDate;
      this.call.incoming =false;
    }
  },
  computed: {
    ...mapState(useDataStore, ['patients', 'users', 'alerts', 'user']),
    title() {
      return this.id ? 'Editar llamada' : 'Añadir llamada';
    },
  },
  data() {
    return {
      mySchema: yup.object({
        patientId: yup.string().required('Paciente es obligatorio'),
        incoming: yup.boolean().required('Tipo de llamada es obligatorio'),
        tipo: yup.string().required('Tipo de llamada es obligatorio'),
        subtipo: yup.string().required('SubTipo de llamada es obligatorio'),
        duration: yup.number().typeError('La duración debe ser un número').positive('Duración debe ser positiva').required('Duración es obligatoria'),
        description: yup.string().required('Descripción es obligatoria'),
      }),
      call: {
        patientId: '',
        userId: '',
        incoming: true, // Se inicializa en false en lugar de null
        date: '',
        type: '',
        subType: '',
        duration: '',
        description: '',
      },
      alert: {
        id: '',
        type: '',
        subType: '',
        description: '',
        patientId: '',
        startDate: '',
      },
      loggedUser: "Usuario",
    };
  },
  methods: {
    ...mapActions(useDataStore, ['loadPatients', 'loadUsers', 'loadUser', 'loadAlerts']),
    async handleSubmit() {
      console.log('Formulario enviado:', this.call);
      const call = { 
        patientId: this.call.patientId,
        userId: this.user.id,
        incoming: this.call.incoming,
        type: this.call.type,
        subType: this.call.subType,
        date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        duration: this.call.duration,
        description: this.call.description,
        alertId: (this.call.alertId === '') ? null : this.call.alertId,
      };
      try {
        if (this.id) {
          await axios.put(`${API}/calls/${this.id}`, call);
        } else {
          await axios.post(`${API}/calls/`, call);
        }
        this.$router.push('/calls');
      } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
      }
    },
    handleCancel() {
      this.$router.push('/calls');
    },
  },
  watch: {
    'call.incoming'() {
      if (!this.call.incoming) {
        this.call.patientId = this.alert.patientId;
      }
    },
  },
};
</script>