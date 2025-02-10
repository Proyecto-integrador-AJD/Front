<template>
  <div class="register-container">
    <h2>Registro</h2>
    <form @submit.prevent="handleRegister">
      <div class="input-group">
        <label for="name">Nombre</label>
        <input id="name" v-model="name" type="text" placeholder="Nombre" required />
      </div>

      <div class="input-group">
        <label for="lastName">Apellido</label>
        <input id="lastName" v-model="lastName" type="text" placeholder="Apellido" required />
      </div>

      <div class="input-group">
        <label for="prefix">Prefijo</label>
        <input id="prefix" v-model="prefix" type="number" placeholder="Prefijo" required />
      </div>

      <div class="input-group">
        <label for="phone">Teléfono</label>
        <input id="phone" v-model="phone" type="number" placeholder="Teléfono" required />
      </div>

      <div class="input-group">
        <label for="email">Email</label>
        <input id="email" v-model="email" type="email" placeholder="Email" required />
      </div>

      <div class="input-group">
        <label for="password">Contraseña</label>
        <input id="password" v-model="password" type="password" placeholder="Contraseña" required />
      </div>

      <div class="input-group">
        <MultiSelect
          v-model="selectedLanguages"
          :options="languageOptions"
          optionLabel="label"
          display="chip"
          placeholder="Selecciona los idiomas"
          class="w-full md:w-20rem multi-select-container"
        >
          <template #optiongroup="slotProps">
            <div class="flex align-items-center">
              <img :alt="slotProps.option.label" :src="slotProps.option.flag" class="mr-2" style="width: 20px" />
              <div>{{ slotProps.option.label }}</div>
            </div>
          </template>
        </MultiSelect>
      </div>

      <button type="submit" :disabled="loading">
        {{ loading ? "Registrando..." : "Registrarse" }}
      </button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p>¿Ya tienes una cuenta? <router-link to="/">Inicia sesión</router-link></p>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MultiSelect from "primevue/multiselect";
import axios from "axios"; // Importamos Axios para manejar la API

export default {
  components: {
    MultiSelect,
  },
  setup() {
    const name = ref("");
    const lastName = ref("");
    const prefix = ref("");
    const phone = ref("");
    const email = ref("");
    const password = ref("");
    const selectedLanguages = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const router = useRouter();

    // Opciones de idiomas
    const languageOptions = ref([
      { label: "Inglés" },
      { label: "Castellano" },
      { label: "Valenciano" },
    ]);

    // Función para manejar el registro
    const handleRegister = async () => {
      loading.value = true;
      error.value = null;

      try {
        const response = await axios.post("https://api", {
          name: name.value,
          lastName: lastName.value,
          prefix: prefix.value,
          phone: phone.value,
          email: email.value,
          password: password.value,
          languages: selectedLanguages.value.map(lang => lang.label), // Enviar solo los nombres de los idiomas
        });

        if (response.data.success) {
          alert("Registro exitoso");
          router.push("/"); // Redirigir a la página de inicio de sesión
        } else {
          error.value = response.data.message || "Error en el registro";
        }
      } catch (err) {
        error.value = err.response?.data?.message || "Error en el servidor";
      } finally {
        loading.value = false;
      }
    };

    return {
      name,
      lastName,
      prefix,
      phone,
      email,
      password,
      selectedLanguages,
      languageOptions,
      handleRegister,
      loading,
      error,
    };
  },
};
</script>

<style scoped>
.register-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f7f7f7;
  border-radius: 10px;
}

h2 {
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 0.7rem;
  font-size: 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #cccccc;
}

.error {
  color: red;
  text-align: center;
}

p {
  text-align: center;
}

p a {
  color: #007bff;
}
</style>

  
  
  
  
  
  
  
  
  
 