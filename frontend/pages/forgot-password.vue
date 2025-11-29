<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Recuperar Contraseña</h2>
      <p class="text-gray-600 text-sm text-center mb-6">Ingresa tu correo y te enviaremos un código de verificación.</p>
      
      <form @submit.prevent="handleRequest">
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
          <div class="relative">
            <Mail :size="18" class="absolute left-3 top-3 text-gray-400" />
            <input 
              v-model="email"
              type="email" 
              class="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="ejemplo@correo.com"
              required
            >
          </div>
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
          :disabled="loading"
        >
          <Loader2 v-if="loading" class="animate-spin" :size="20" />
          {{ loading ? 'Enviando...' : 'Enviar Código' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm">
        <NuxtLink to="/login" class="text-blue-600 hover:underline">Volver al Login</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Mail, Loader2 } from 'lucide-vue-next';

const config = useRuntimeConfig();
const router = useRouter();
const email = ref('');
const loading = ref(false);

const handleRequest = async () => {
  loading.value = true;
  try {
    await $fetch(`${config.public.apiBase}/auth/forgot-password`, {
      method: 'POST',
      body: { email: email.value }
    });
    
    router.push({ path: '/reset-password', query: { email: email.value } });
    
  } catch (error) {
    alert('Error al procesar solicitud');
  } finally {
    loading.value = false;
  }
};
</script>