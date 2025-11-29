<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        
        <NuxtLink to="/professional" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
          <ArrowLeft :size="20" /> Volver al Panel
        </NuxtLink>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="bg-blue-600 p-6 text-white">
            <h1 class="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck :size="28" /> Verificación de Identidad
            </h1>
            <p class="text-blue-100 mt-1">Para obtener el check azul y mayor visibilidad, necesitamos confirmar quién eres.</p>
          </div>

          <div class="p-8">
            <form @submit.prevent="submitVerification" class="space-y-6">
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Número de Identidad (DNI)</label>
                <div class="relative">
                  <CreditCard :size="18" class="absolute left-3 top-3 text-gray-400" />
                  <input 
                    v-model="identityNumber" 
                    type="text" 
                    class="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Ej: 0801-1999-12345"
                    required
                  >
                </div>
                <p class="text-xs text-gray-500 mt-1">Este dato se mantendrá privado.</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Foto del Documento</label>
                
                <div 
                  class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition cursor-pointer"
                  @click="triggerFileInput"
                  @dragover.prevent
                  @drop.prevent="handleDrop"
                >
                  <input 
                    ref="fileInput"
                    type="file" 
                    accept="image/*" 
                    class="hidden" 
                    @change="handleFileSelect"
                  >
                  
                  <div v-if="previewUrl" class="relative inline-block">
                    <img :src="previewUrl" class="h-48 object-contain rounded-lg shadow-sm" />
                    <button 
                      @click.stop="clearFile"
                      class="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X :size="16" />
                    </button>
                  </div>

                  <div v-else class="flex flex-col items-center text-gray-500">
                    <UploadCloud :size="48" class="text-gray-300 mb-2" />
                    <p class="font-medium">Haz clic para subir o arrastra tu imagen aquí</p>
                    <p class="text-xs mt-1">JPG, PNG o WEBP (Máx 5MB)</p>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
                :disabled="loading || !selectedFile"
              >
                <Loader2 v-if="loading" class="animate-spin" :size="20" />
                <span>{{ loading ? 'Enviando...' : 'Enviar Solicitud' }}</span>
              </button>

            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, ShieldCheck, CreditCard, UploadCloud, X, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const authStore = useAuthStore();
const router = useRouter();

const identityNumber = ref('');
const fileInput = ref(null);
const selectedFile = ref(null);
const previewUrl = ref(null);
const loading = ref(false);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) processFile(file);
};

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) processFile(file);
};

const processFile = (file) => {
  if (!file.type.startsWith('image/')) {
    alert('Por favor sube solo imágenes');
    return;
  }
  selectedFile.value = file;
  previewUrl.value = URL.createObjectURL(file);
};

const clearFile = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

const submitVerification = async () => {
  if (!selectedFile.value || !identityNumber.value) return;

  loading.value = true;
  const formData = new FormData();
  formData.append('document', selectedFile.value);
  formData.append('identity_number', identityNumber.value);

  try {
    await $fetch(`${config.public.apiBase}/professionals/verification`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    });

    alert('Solicitud enviada correctamente. Te notificaremos cuando sea aprobada.');
    router.push('/professional');

  } catch (error) {
    console.error(error);
    alert('Error: ' + (error.data?.message || error.message));
  } finally {
    loading.value = false;
  }
};
</script>