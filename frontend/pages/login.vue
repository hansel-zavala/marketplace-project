<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Iniciar Sesión</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
            Correo Electrónico
          </label>
          <input 
            v-model="form.email"
            id="email" 
            type="email" 
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="ejemplo@correo.com"
            required
          >
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
            Contraseña
          </label>
          <input 
            v-model="form.password"
            id="password" 
            type="password" 
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="********"
            required
          >
        </div>

        <div v-if="errorMsg" class="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm border border-red-200">
          {{ errorMsg }}
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
          :disabled="loading"
        >
          <span v-if="loading" class="animate-spin"></span>
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm">
        <p class="text-gray-600">
          ¿No tienes cuenta? 
          <NuxtLink to="/register" class="text-blue-600 hover:underline font-medium">
            Regístrate aquí
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: ''
});

const loading = ref(false);
const errorMsg = ref('');

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = '';

  try {
    await authStore.login(form.email, form.password);
    
    router.push('/');
    
  } catch (error) {
    console.error(error);
    errorMsg.value = typeof error === 'string' ? error : 'Credenciales incorrectas o error de conexión';
  } finally {
    loading.value = false;
  }
};
</script>