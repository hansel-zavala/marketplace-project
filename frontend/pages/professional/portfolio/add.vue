<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        
        <div class="flex items-center gap-4 mb-6">
          <NuxtLink to="/professional/portfolio" class="bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft :size="20" />
          </NuxtLink>
          <h1 class="text-2xl font-bold text-gray-800">Nuevo Proyecto</h1>
        </div>

        <div class="bg-white rounded-xl shadow-md p-8">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Título del Proyecto</label>
              <input 
                v-model="form.title" 
                type="text" 
                class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Ej: Remodelación de Cocina Moderna"
                required
              >
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
              <select v-model="form.category" class="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="Residencial">Residencial</option>
                <option value="Comercial">Comercial</option>
                <option value="Reparación">Reparación</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Instalación">Instalación</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea 
                v-model="form.description" 
                rows="3" 
                class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Detalles del trabajo realizado..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Fotos del Proyecto (Máx 5)</label>
              
              <div 
                class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer relative"
                @click="$refs.fileInput.click()"
              >
                <input 
                  ref="fileInput"
                  type="file" 
                  multiple 
                  accept="image/*" 
                  class="hidden" 
                  @change="handleFiles"
                >
                
                <div v-if="selectedFiles.length === 0" class="py-4">
                  <UploadCloud :size="40" class="mx-auto text-gray-400 mb-2" />
                  <p class="text-gray-500">Haz clic para seleccionar fotos</p>
                </div>

                <div v-else class="grid grid-cols-3 gap-2">
                  <div v-for="(file, index) in previews" :key="index" class="relative aspect-square rounded-lg overflow-hidden group">
                    <img :src="file" class="w-full h-full object-cover" />
                    <button 
                      @click.stop="removeFile(index)" 
                      class="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X :size="12" />
                    </button>
                  </div>
                  <div v-if="selectedFiles.length < 5" class="aspect-square flex items-center justify-center bg-gray-100 rounded-lg text-gray-400 border border-gray-200">
                    <Plus :size="24" />
                  </div>
                </div>
              </div>
              <p class="text-xs text-gray-400 mt-1 text-right">{{ selectedFiles.length }} / 5 imágenes</p>
            </div>

            <button 
              type="submit" 
              class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
              :disabled="loading || selectedFiles.length === 0"
            >
              <Loader2 v-if="loading" class="animate-spin" :size="20" />
              <span>{{ loading ? 'Subiendo...' : 'Publicar Proyecto' }}</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, UploadCloud, X, Plus, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const selectedFiles = ref([]);
const previews = ref([]);

const form = reactive({
  title: '',
  description: '',
  category: 'Residencial',
  completedAt: new Date().toISOString().split('T')[0]
});

const handleFiles = (event) => {
  const files = Array.from(event.target.files);
  
  if (selectedFiles.value.length + files.length > 5) {
    alert('Solo puedes subir un máximo de 5 fotos por proyecto');
    return;
  }

  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      selectedFiles.value.push(file);
      previews.value.push(URL.createObjectURL(file));
    }
  });
  
  event.target.value = '';
};

const removeFile = (index) => {
  selectedFiles.value.splice(index, 1);
  previews.value.splice(index, 1);
};

const handleSubmit = async () => {
  if (selectedFiles.value.length === 0) return alert('Sube al menos una foto');

  loading.value = true;
  const formData = new FormData();
  
  formData.append('title', form.title);
  formData.append('description', form.description);
  formData.append('category', form.category);
  formData.append('completedAt', form.completedAt);

  selectedFiles.value.forEach(file => {
    formData.append('photos', file);
  });

  try {
    await $fetch(`${config.public.apiBase}/portfolio`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    });

    alert('Proyecto creado exitosamente');
    router.push('/professional/portfolio');

  } catch (error) {
    console.error(error);
    alert('Error al crear proyecto: ' + (error.data?.message || error.message));
  } finally {
    loading.value = false;
  }
};
</script>