<template>
  <div class="row">
    <Form novalidate :validation-schema="mySchema" @submit="handleSubmit">
      <fieldset>
        <legend>{{ title }}</legend>

        <div class="form-group">
          <label>Paciente:</label>
          <Field as="select" v-model="call.patientId" name="paciente" class="form-control">
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.name }} {{ patient.lastName }}
            </option>
          </Field>
          <ErrorMessage class="error" name="paciente" />
        </div>

        <!-- Teleoperador -->
        <div class="form-group">
          <label>Teleoperador:</label>
          <div class="form-control-plaintext">
            {{ loggedUser }}
          </div>
        </div>

        <!-- Tipo de llamada -->
        <div class="form-group">
          <label>Tipo de llamada (Entrante/Saliente):</label>
          <Field as="select" v-model="call.incoming" name="incoming" class="form-control">
            <option :value="true">Entrante</option>
            <option :value="false">Saliente</option>
          </Field>
          <ErrorMessage class="error" name="incoming" />
        </div>

        <!-- Resto del formulario... -->

        <!-- Información de alerta (si es Saliente) -->
        <div v-if="call.incoming === false" class="form-group">
          <label>Información de Alerta:</label>
          <div class="form-group-multiple">
            <div>
              <Field v-model="call.alertId" name="alertId" type="number" class="form-control"
                placeholder="ID de Alerta" />
              <ErrorMessage class="error" name="alertId" />
            </div>
            <div>
              <Field v-model="call.alertType" name="alertType" class="form-control" placeholder="Tipo de Alerta" />
              <ErrorMessage class="error" name="alertType" />
            </div>
            <div>
              <Field v-model="call.alertSubType" name="alertSubType" class="form-control"
                placeholder="Subtipo de Alerta" />
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
            <div>
              <Field v-model="call.alertRecurrenceType" name="alertRecurrenceType" class="form-control"
                placeholder="Tipo de Recurrencia" />
              <ErrorMessage class="error" name="alertRecurrenceType" />
            </div>
            <div>
              <Field v-model="call.alertRecurrenceCount" name="alertRecurrenceCount" type="number" class="form-control"
                placeholder="Cantidad de Recurrencia" />
              <ErrorMessage class="error" name="alertRecurrenceCount" />
            </div>
          </div>
        </div>

        <!-- Duración -->
        <div class="form-group">
          <label>Duración:</label>
          <Field v-model="call.duration" name="duracion" type="number" class="form-control" />
          <ErrorMessage class="error" name="duracion" />
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label>Descripción:</label>
          <Field v-model="call.description" name="descripcion" class="form-control" />
          <ErrorMessage class="error" name="descripcion" />
        </div>

        <!-- Botones -->
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
    const user = JSON.parse(localStorage.getItem("user"));
    this.loggedUser = user ? user.name : "Usuario";
    if (this.id) {
      const response = await axios.get(`${API}/calls/${this.id}`);
      this.call = response.data;
    }
  },
  computed: {
    ...mapState(useDataStore, ['patients', 'users', 'alerts']),
    title() {
      return this.id ? 'Editar llamada' : 'Añadir llamada';
    },
  },
  data() {
    return {
      mySchema: yup.object({
        patientId: yup.string().required('Paciente es obligatorio'),
        incoming: yup.boolean().required('Tipo de llamada es obligatorio'),
        date: yup.date().required('Fecha es obligatoria'),
        type: yup.string().required('Tipo de llamada es obligatorio'),
        subType: yup.string().required('Subtipo es obligatorio'),
        duration: yup.number().positive('Duración debe ser positiva').required('Duración es obligatoria'),
        description: yup.string().required('Descripción es obligatoria'),
      }),
      call: {
        patientId: '',
        userId: '',
        incoming: null,  // Esto es lo que se debe actualizar
        date: '',
        type: '',
        subType: '',
        alertId: '',
        alertType: '',
        alertSubType: '',
        alertDescription: '',
        alertStartDate: '',
        alertRecurrenceType: '',
        alertRecurrenceCount: null,
        duration: '',
        description: '',
        isRecurring: null,
        recurrenceType: '',
        recurrence: null,
      },
      loggedUser: "Usuario",
    };
  },
  methods: {
    ...mapActions(useDataStore, ['loadPatients', 'loadUsers', 'loadAlerts']),
    async handleSubmit() {
      debugger
      try {
        if (this.id) {
          await axios.put(`${API}/calls/${this.id}`, this.call).then(response => {
            console.log(response);
            this.$router.push('/calls');

          }).catch(error => {
            console.error('error' + error);
          })
        } else {
          debugger
          await axios.post(`${API}/calls/`, this.call).then(response => {
            console.log(response);
            this.$router.push('/calls');

          }).catch(error => {
            console.error('error' + error);
          })
        }
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