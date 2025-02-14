import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    isAuthenticated: localStorage.getItem('token') ? true : false,
  }),

  actions: {
    logout() {
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    
    setToken(token) {
      this.token = token;
      this.isAuthenticated = true;
      localStorage.setItem('token', token);
    }
  }
});



