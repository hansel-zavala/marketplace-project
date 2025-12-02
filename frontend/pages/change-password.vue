<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto">
        
        <NuxtLink to="/profile" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
          <ArrowLeft :size="20" /> Volver a mi perfil
        </NuxtLink>

        <div class="bg-white rounded-lg shadow-md p-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-6 text-center">Cambiar Contraseña</h1>

          <form @submit.prevent="handleChangePassword" class="space-y-5">
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
              <div class="relative">
                <input 
                  v-model="form.currentPassword" 
                  :type="showCurrent ? 'text' : 'password'" 
                  class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                  required
                >
                <button type="button" @click="showCurrent = !showCurrent" class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  <Eye v-if="!showCurrent" :size="18" />
                  <EyeOff v-else :size="18" />
                </button>
              </div>
            </div>

            <div class="border-t pt-4"></div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
              <div class="relative">
                <input 
                  v-model="form.newPassword" 
                  :type="showNew ? 'text' : 'password'" 
                  class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                  placeholder="Mínimo 6 caracteres"
                  required
                >
                <button type="button" @click="showNew = !showNew" class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  <Eye v-if="!showNew" :size="18" />
                  <EyeOff v-else :size="18" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nueva Contraseña</label>
              <div class="relative">
                <input 
                  v-model="form.confirmPassword" 
                  :type="showConfirm ? 'text' : 'password'" 
                  class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                  required
                >
                <button type="button" @click="showConfirm = !showConfirm" class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                  <Eye v-if="!showConfirm" :size="18" />
                  <EyeOff v-else :size="18" />
                </button>
              </div>
              <p v-if="passwordMismatch" class="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
            </div>

            <button 
              type="submit" 
              class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
              :disabled="loading || passwordMismatch"
            >
              <Loader2 v-if="loading" class="animate-spin" :size="20" />
              {{ loading ? 'Actualizando...' : 'Actualizar Contraseña' }}
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const router = useRouter();
const authStore = useAuthStore();

const loading = ref(false);
const showCurrent = ref(false);
const showNew = ref(false);
const showConfirm = ref(false);

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const passwordMismatch = computed(() => {
  return form.newPassword && form.confirmPassword && form.newPassword !== form.confirmPassword;
});

const handleChangePassword = async () => {
  if (passwordMismatch.value) return;

  loading.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/auth/change-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      }
    });

    alert(response.message);
    router.push('/profile');

  } catch (error) {
    console.error(error);
    const msg = error.data?.message || error.message;
    if (error.data?.errors) {
      alert(error.data.errors[0].msg);
    } else {
      alert('Error: ' + msg);
    }
  } finally {
    loading.value = false;
  }
};
</script>