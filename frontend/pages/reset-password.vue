<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-2 text-center text-gray-800">Restablecer Contraseña</h2>
      
      <p class="text-center text-sm text-gray-500 mb-6">
        El código expira en: <span class="font-mono font-bold text-red-500">{{ formatTime(expiryTime) }}</span>
      </p>
      
      <form @submit.prevent="handleReset">
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Correo</label>
          <input v-model="form.email" type="email" class="w-full border rounded-lg px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed" readonly>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Código de Verificación</label>
          <input 
            v-model="form.code" 
            type="text" 
            maxlength="6"
            class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest font-mono text-lg"
            placeholder="000000"
            required
          >
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2">Nueva Contraseña</label>
          <div class="relative">
            <Lock :size="18" class="absolute left-3 top-3 text-gray-400" />
            
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              class="w-full border rounded-lg pl-10 pr-10 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="********"
              required
            >
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <Eye v-if="!showPassword" :size="18" />
              <EyeOff v-else :size="18" />
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2 mb-4"
          :disabled="loading"
        >
          <Loader2 v-if="loading" class="animate-spin" :size="20" />
          {{ loading ? 'Actualizando...' : 'Cambiar Contraseña' }}
        </button>
      </form>

      <div class="border-t pt-4 text-center">
        <p class="text-sm text-gray-600 mb-2">¿No recibiste el código?</p>
        <button 
          @click="handleResend" 
          :disabled="resendCooldown > 0 || resending"
          class="text-sm font-medium transition flex items-center justify-center gap-2 mx-auto"
          :class="resendCooldown > 0 ? 'text-gray-400 cursor-not-allowed' : 'text-blue-600 hover:underline'"
        >
          <RefreshCw v-if="resending" :size="14" class="animate-spin" />
          {{ resendCooldown > 0 ? `Esperar ${resendCooldown}s para reenviar` : 'Reenviar Código' }}
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { Lock, Loader2, Eye, EyeOff, RefreshCw } from 'lucide-vue-next';

const config = useRuntimeConfig();
const route = useRoute();
const router = useRouter();

const loading = ref(false);
const resending = ref(false);
const showPassword = ref(false);

const form = reactive({
  email: route.query.email || '',
  code: '',
  password: ''
});


const expiryTime = ref(900); 
const resendCooldown = ref(0);

let timerInterval;
let cooldownInterval;

onMounted(() => {
  timerInterval = setInterval(() => {
    if (expiryTime.value > 0) expiryTime.value--;
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timerInterval);
  clearInterval(cooldownInterval);
});

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};


const handleReset = async () => {
  loading.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/auth/reset-password`, {
      method: 'POST',
      body: form
    });
    
    alert(response.message);
    router.push('/login');
    
  } catch (error) {
    console.error(error);
    alert('Error: ' + (error.data?.message || 'Código inválido o expirado'));
  } finally {
    loading.value = false;
  }
};

const handleResend = async () => {
  if (!form.email) return;
  
  resending.value = true;
  try {
    await $fetch(`${config.public.apiBase}/auth/forgot-password`, {
      method: 'POST',
      body: { email: form.email }
    });

    alert(`Código reenviado a ${form.email}`);
    
    expiryTime.value = 900;
    startCooldown();

  } catch (error) {
    alert('Error al reenviar código');
  } finally {
    resending.value = false;
  }
};

const startCooldown = () => {
  resendCooldown.value = 60;
  clearInterval(cooldownInterval);
  cooldownInterval = setInterval(() => {
    if (resendCooldown.value > 0) {
      resendCooldown.value--;
    } else {
      clearInterval(cooldownInterval);
    }
  }, 1000);
};
</script>