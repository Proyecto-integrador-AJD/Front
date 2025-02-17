import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: "",
    isAuthenticated: false,
    loading: false, // Nuevo estado para indicar carga
    errorMessage: "", // Estado para manejar mensajes de error
  }),
  actions: {
    setToken(token) {
      this.token = token;
      this.isAuthenticated = !!token; // Verifica si hay token para determinar autenticación
      localStorage.setItem("token", token); // Guarda el token en localStorage
    },
    loadTokenFromStorage() {
      const token = localStorage.getItem("token");
      if (token) {
        this.setToken(token); // Cargar token almacenado
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    },
    async login(email, password) {
      this.loading = true;
      this.errorMessage = "";
      try {
        // Suponiendo que tienes un endpoint de login en tu API
        const API = import.meta.env.VITE_URL_API;
        const response = await fetch(`${API}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Error al iniciar sesión");
        }

        const data = await response.json();
        this.setToken(data.data.token); // Guarda el token
      } catch (error) {
        this.errorMessage = error.message; // Guarda el mensaje de error para mostrarlo
      } finally {
        this.loading = false; // Siempre desactiva el estado de carga
      }
    },
    logout() {
      this.token = "";
      this.isAuthenticated = false;
      localStorage.removeItem("token"); // Borra el token de localStorage
    },
  },
});



