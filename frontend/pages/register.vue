<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h2>
      
      <form @submit.prevent="handleRegister">
        
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
            <input v-model="form.first_name" type="text" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
          <div>
            <label class="block text-gray-700 text-sm font-bold mb-2">Apellido</label>
            <input v-model="form.last_name" type="text" class="w-full px-3 py-2 border rounded-lg" required>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
          <input v-model="form.email" type="email" class="w-full px-3 py-2 border rounded-lg" required>
        </div>



        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Soy...</label>
          <select v-model="form.user_type" class="w-full px-3 py-2 border rounded-lg bg-white">
            <option value="customer">Cliente (Busco servicios/productos)</option>
            <option value="professional">Profesional (Ofrezco servicios)</option>
            <option value="business">Negocio (Vendo productos)</option>
          </select>
        </div>

        <div class="mb-6 relative">
          <label class="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
          <input 
            v-model="form.password" 
            :type="showPassword ? 'text' : 'password'" 
            class="w-full px-3 py-2 border rounded-lg pr-10" 
            required
          >
          <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <Eye v-if="!showPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
        </div>

        <div class="mb-6 flex items-start gap-2">
           <input v-model="acceptTerms" type="checkbox" id="terms" class="mt-1" required>
           <label for="terms" class="text-sm text-gray-700">
             Acepto los <span class="font-bold cursor-pointer hover:underline text-blue-600">Términos y Condiciones</span> y la <span class="font-bold cursor-pointer hover:underline text-blue-600">Política de Privacidad</span>.
           </label>
        </div>



        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          :disabled="loading"
        >
          {{ loading ? 'Registrando...' : 'Crear Cuenta' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta? <NuxtLink to="/login" class="text-blue-600 hover:underline">Inicia Sesión</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useToastStore } from '~/stores/toast';
import { Eye, EyeOff } from 'lucide-vue-next';

const config = useRuntimeConfig();
const router = useRouter();
const authStore = useAuthStore();
const toastStore = useToastStore();
const showPassword = ref(false);

console.log('URL del Backend:', config.public.apiBase);

const form = reactive({
  first_name: '',
  last_name: '',
  email: '',
  user_type: 'customer',
  password: ''
});

const acceptTerms = ref(false);
const loading = ref(false);

const handleRegister = async () => {
  if (!acceptTerms.value) {
    toastStore.show('Debes aceptar los términos y condiciones', 'warning');
    return;
  }

  loading.value = true;

  try {
    const user = await authStore.register(form);

    if (user.user_type === 'professional') {
      toastStore.show('¡Cuenta creada! Ahora configura tu perfil profesional.', 'success');
      router.push('/professional'); 
    } else {
      toastStore.show('¡Bienvenido! Ya puedes empezar a explorar.', 'success');
      router.push('/');
    }

  } catch (error) {
    const msg = typeof error === 'string' ? error : 'Error al registrar usuario';
    toastStore.show(msg, 'error');
  } finally {
    loading.value = false;
  }
};
</script>