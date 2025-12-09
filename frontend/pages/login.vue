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
          <div class="relative">
            <input 
              v-model="form.password"
              id="password" 
              :type="showPassword ? 'text' : 'password'" 
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              placeholder="********"
              required
            >
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
              <Eye v-if="!showPassword" :size="20" />
              <EyeOff v-else :size="20" />
            </button>
          </div>
        </div>



        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
          :disabled="loading"
        >
          <Loader2 v-if="loading" class="animate-spin" :size="20" />
          {{ loading ? 'Ingresando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm space-y-2">
        <p class="text-gray-600">
          <NuxtLink to="/forgot-password" class="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </NuxtLink>
        </p>
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
  import { useToastStore } from '~/stores/toast';
  import { Eye, EyeOff, Loader2 } from 'lucide-vue-next';

  const authStore = useAuthStore();
  const toastStore = useToastStore();
  const router = useRouter();

  const form = reactive({
    email: '',
    password: '',
  });

  const loading = ref(false);
  const showPassword = ref(false);

  const handleLogin = async () => {
    loading.value = true;

    try {
      await authStore.login(form.email, form.password);
      toastStore.show('Sesión iniciada correctamente', 'success');
      router.push('/');
    } catch (error) {
      console.error(error);
      const msg = typeof error === 'string' ? error : 'Credenciales incorrectas o error de conexión';
      toastStore.show(msg, 'error');
    } finally {
      loading.value = false;
    }
  };
</script>
