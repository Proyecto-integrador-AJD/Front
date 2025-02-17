<template>
  <div class="row">
    <Form novalidate :validation-schema="mySchema" @submit="handleSubmit">
      <fieldset>
        <legend>{{ title }}</legend>

        <div class="form-group">
          <label>Paciente:</label>
          <Field as="select" v-model="call.patientId" name="patientId" class="form-control">
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
          <Field as="select" v-model="call.incoming" name="incoming" class="form-control">
            <option :value="true">Entrante</option>
            <option :value="false">Saliente</option>
          </Field>
          <ErrorMessage class="error" name="incoming" />
        </div>

        <div v-if="call.incoming === false" class="form-group">
          <label>Información de Alerta:</label>
          <!-- <div class="form-group-multiple">
            <div>
              <Field v-model="call.alertId" name="alertId" type="number" class="form-control" placeholder="ID de Alerta" />
              <ErrorMessage class="error" name="alertId" />
            </div>
            <div>
              <Field v-model="call.alertType" name="alertType" class="form-control" placeholder="Tipo de Alerta" />
              <ErrorMessage class="error" name="alertType" />
            </div>
            <div>
              <Field v-model="call.alertSubType" name="alertSubType" class="form-control" placeholder="Subtipo de Alerta" />
              <ErrorMessage class="error" name="alertSubType" />
            </div>
            <div>
              <Field v-model="call.alertDescription" name="alertDescription" class="form-control"
                placeholder="Descripción de Alerta" />
              <ErrorMessage class="error" name="alertDescription" />
            </div>
            <div>
              <Field v-model="call.alertStartDate" name="alertStartDate" type="datetime-local" class="form-control"
                placeholder="Fecha de Inicio de Alerta" />
              <ErrorMessage class="error" name="alertStartDate" />
            </div>
          </div> -->
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

const API = import.meta.env.VITE_URL_API;

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  props: ['id'],
  async mounted() {
    await this.loadPatients();
    await this.loadAlerts();
    await this.loadUsers();
    await this.loadUser();
    const user = JSON.parse(localStorage.getItem("user"));
    this.loggedUser = user ? user.name : "Usuario";
    if (this.id) {
      const response = await axios.get(`${API}/calls/${this.id}`);
      this.call = response.data;
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
        duration: yup.number().positive('Duración debe ser positiva').required('Duración es obligatoria'),
        description: yup.string().required('Descripción es obligatoria'),
      }),
      call: {
        patientId: '',
        userId: '',
        incoming: false, // Se inicializa en false en lugar de null
        date: '',
        type: '',
        subType: '',
        duration: '',
        description: '',
        alertId: '',
        alertType: '',
        alertSubType: '',
        alertDescription: '',
        alertStartDate: '',
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