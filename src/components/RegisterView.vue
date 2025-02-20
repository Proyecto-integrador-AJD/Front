<template>
  <div class="login-container">
    <h2>Registro</h2>
    <Form novalidate :validation-schema="mySchema" @submit="handleRegister">
      <fieldset>
        <input type="text" v-model="name" placeholder="Nombre" required class="input-login" />
        <input type="text" v-model="lastName" placeholder="Apellido" required class="input-login" />
        <div class="phone-group">
          <div>
            <Field as="select" v-model="prefix" name="prefijo">
              <option v-for="prefix in prefixes" :key="prefix.id" :value="prefix.prefix">
                {{ prefix.country }} ({{ prefix.prefix }})
              </option>
            </Field>
            <ErrorMessage class="error" name="prefijo" />
          </div>
          <div>
            <input type="number" v-model="phone" placeholder="Teléfono" required class="input-login" />
            <ErrorMessage class="error" name="telefono" />
          </div>
        </div>
        <input type="email" v-model="email" placeholder="Email" required class="input-login" />
        <input type="password" v-model="password" placeholder="Contraseña" required class="input-login" />
        
        <MultiSelect 
          v-model="selectedLanguages" 
          :options="languages" 
          optionLabel="spanishName" 
          optionValue="name" 
          display="chip" 
          placeholder="Selecciona los idiomas" 
          class="w-full md:w-20rem multi-select-container">
        </MultiSelect>
        
        <button class="btn btn-primary button-login" type="submit" :disabled="loading">
          {{ loading ? "Registrando..." : "Registrarse" }}
        </button>
        <button type="button" class="btn btn-danger button-login" @click="$router.push('/')">Cancelar</button>
      </fieldset>
    </Form>
    
    <p v-if="error" class="error">{{ error }}</p>
    <p>¿Ya tienes una cuenta?</p>
    <button type="button" class="btn btn-primary button-login" @click="$router.push('/')">Iniciar sesión</button>
  </div>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import { useDataStore } from "../stores/data";
import { useAuthStore } from "../stores/auth";
import MultiSelect from "primevue/multiselect";
import axios from "axios";

export default {
  name: "RegisterView",
  components: { MultiSelect },
  data() {
    return {
      name: "",
      lastName: "",
      prefix: "",
      prefixes: [],
      phone: "",
      email: "",
      password: "",
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
      
      try {
        const API = import.meta.env.VITE_URL_API;
        const response = await axios.post(`${API}/register`, {
          name: this.name,
          lastName: this.lastName,
          prefix: this.prefix,
          phone: this.phone,
          email: this.email,
          password: this.password,
          languages: this.selectedLanguages,
        });

        if (response.status === 201) {
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
  created() {
    // Carga el token almacenado si es necesario
    const authStore = useAuthStore();
    authStore.loadTokenFromStorage();
  },
  async mounted() {
    document.body.classList.add("login-page");
    await useDataStore().loadLanguages();
    await this.loadPrefixes()
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
</style>
