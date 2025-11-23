// frontend/stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  
  const token = useCookie('auth_token'); 
  const user = ref(null);

  const setSession = (newToken, newUser) => {
    token.value = newToken;
    user.value = newUser;
  };

  const logout = () => {
    token.value = null;
    user.value = null;
  };

  const login = async (email, password) => {
    const config = useRuntimeConfig();
    try {
      const response = await $fetch(`${config.public.apiBase}/auth/login`, {
        method: 'POST',
        body: { email, password }
      });
      
      setSession(response.token, response.user);
      return true;
    } catch (error) {
      console.error(error);
      throw error.data?.message || 'Error al iniciar sesión';
    }
  };

  const fetchUser = async () => {
    if (token.value && !user.value) {
      const config = useRuntimeConfig();
      try {
        const response = await $fetch(`${config.public.apiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${token.value}` }
        });
        user.value = response.user;
      } catch (error) {
        logout();
      }
    }
  };

  return {
    token,
    user,
    login,
    logout,
    fetchUser
  };
});