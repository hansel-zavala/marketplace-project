// frontend/middleware/auth.js
export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();

  if (!authStore.token) {
    return navigateTo('/login');
  }

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch (error) {
      return navigateTo('/login');
    }
  }

  if (!authStore.user) {
    return navigateTo('/login');
  }
});