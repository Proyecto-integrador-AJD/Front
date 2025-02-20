<template>
  <div class="login-container">
    <h2>Registrarse</h2>
    <Form novalidate :validation-schema="mySchema" @submit="handleRegister">
      <fieldset>
        <div>
          <Field v-model="name" name="name" placeholder="Nombre" class="input-login" />
          <ErrorMessage class="error" name="name" />
        </div>
        <div>
          <Field v-model="lastName" name="lastName" placeholder="Apellido" class="input-login" />
          <ErrorMessage class="error" name="lastName" />
        </div>
        <div>
          <Field v-model="username" name="username" placeholder="Username" class="input-login" />
          <ErrorMessage class="error" name="username" />
        </div>
        <div>
          <label class="input-prefijo">Prefijo:</label>
          <Field as="select" v-model="prefix" name="prefix" class="input-login">
            <option v-for="prefix in prefixes" :key="prefix.id" :value="prefix.prefix">
              {{ prefix.country }} ({{ prefix.prefix }})
            </option>
          </Field>
          <ErrorMessage class="error" name="prefix" />
        </div>
        <div>
          <Field type="number" v-model="phone" name="phone" placeholder="Teléfono" class="input-login" />
          <ErrorMessage class="error" name="phone" />
        </div>
        <div>
          <Field type="email" v-model="email" name="email" placeholder="Email" class="input-login" />
          <ErrorMessage class="error" name="email" />
        </div>
        <div>
          <Field type="password" v-model="password" name="password" placeholder="Contraseña" class="input-login" />
          <ErrorMessage class="error" name="password" />
        </div>
        <div>
          <Field type="password" v-model="confirmPassword" name="confirmPassword" placeholder="Confirmar Contraseña" class="input-login" />
          <ErrorMessage class="error" name="confirmPassword" />
        </div>

        <MultiSelect 
          v-model="selectedLanguages" 
          :options="languages" 
          optionLabel="spanishName" 
          optionValue="name" 
          display="chip" 
          placeholder="Selecciona los idiomas" 
          class="multi-select-container input-languages">
        </MultiSelect><br><br>

        <p v-if="error" class="error">{{ error }}</p>
        
        <button class="btn btn-primary button-login" type="submit" :disabled="loading">
          {{ loading ? "Registrando..." : "Registrarse" }}
        </button>
        <button type="button" class="btn btn-danger button-login" @click="$router.push('/')">Cancelar</button>
      </fieldset>
    </Form>
    
    <p>¿Ya tienes una cuenta?</p>
    <button type="button" class="btn btn-primary button-login" @click="$router.push('/')">Iniciar sesión</button>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useDataStore } from "../stores/data";
import { useAuthStore } from "../stores/auth";
import MultiSelect from "primevue/multiselect";
import axios from "axios";

export default {
  name: "RegisterView",
  components: {
    Form,
    Field,
    ErrorMessage,
    MultiSelect,
  },
  data() {
    return {
      mySchema: yup.object().shape({
        name: yup.string().required('El nombre es obligatorio'),
        lastName: yup.string().required('El apellido es obligatorio'),
        username: yup.string().required('El nombre de usuario es obligatorio'),
        prefix: yup.string().required('El prefijo es obligatorio'),
        phone: yup
          .number()
          .typeError('El teléfono debe ser un número')
          .required('El teléfono es obligatorio'),
        email: yup.string().email('Correo inválido').required('El correo es obligatorio'),
        password: yup.string().required('La contraseña es obligatoria'),
        confirmPassword: yup.string()
          .oneOf([yup.ref('password'), null], 'Las contraseñas deben coincidir')
          .required('Debes confirmar tu contraseña')
      }),
      name: "",
      lastName: "",
      username: "",
      prefix: "",
      prefixes: [],
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      selectedLanguages: [],
      loading: false,
      error: null,
    };
  },
  computed: {
    languages() {
      return useDataStore().languages;
    }
  },
  methods: {
    async handleRegister() {
      this.loading = true;
      this.error = null;
      const authStore = useAuthStore();
      const dataStore = useDataStore();
      const dateHire = new Date().toISOString().split('T')[0];
      
      try {
        const API = import.meta.env.VITE_URL_API;
        const response = await axios.post(`${API}/register`, {
          name: this.name,
          lastName: this.lastName,
          username: this.username,
          prefix: this.prefix,
          phone: this.phone,
          email: this.email,
          password: this.password,
          confirm_password: this.confirmPassword,
          language: this.selectedLanguages,
          dateHire,
          dateTermination: null
        });

        if (response.status === 200) {
          const token = response.data.data.token;
          authStore.setToken(token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          await dataStore.loadUser();
          localStorage.setItem("user", JSON.stringify(dataStore.user));
          this.$router.push("/index");
        } else {
          this.error = response.data.message || "Error en el registro";
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Error en el servidor";
      } finally {
        this.loading = false;
      }
    },
    async loadPrefixes() {
      const dataStore = useDataStore();
      await dataStore.loadPrefixes();
      this.prefixes = dataStore.prefixes;
    }
  },
  async mounted() {
    document.body.classList.add("login-page");
    await useDataStore().loadLanguages();
    await this.loadPrefixes();
  },
  beforeUnmount() {
    document.body.classList.remove("login-page");
  }
};
</script>
  
<style>
  .login-container {
    max-width: 300px;
    margin: auto;
    text-align: center;
  }
  input {
    display: block;
    width: 100%;
    margin: 10px 0;
    padding: 8px;
  }
  .error {
    color: red;
    padding: 0 !important;
  }
  .input-prefijo {
    color: #727272;
    padding: 5px;
    margin: 10px 0;
    font-size: 16px;
  }
  .input-languages {
    margin-top: 15px;
    padding: 9px;
    border: 2px solid #66c2ff !important;
    border-radius: 10px !important;
  }
  .p-multiselect-label {
    flex-direction: row !important;
    /* flex-wrap: wrap; */
    /* padding-right: 30px !important; */
    align-items: flex-end !important;
  }
  .p-multiselect-list-container {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 5px;
  }
</style>
