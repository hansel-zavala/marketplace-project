<template>
  <form @submit.prevent="handleSubmit" class="space-y-8">
    
    <div class="space-y-4">
      <h3 class="font-bold text-gray-800 border-b pb-2">Identidad Visual</h3>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Foto de Portada</label>
        <div 
          class="relative w-full h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-blue-400 transition"
          @click="$refs.coverInput.click()"
        >
          <img v-if="previews.cover" :src="previews.cover" class="absolute inset-0 w-full h-full object-cover" />
          <div v-else class="text-gray-400 flex flex-col items-center">
            <Image :size="32" />
            <span class="text-sm mt-1">Clic para subir portada (1200x400)</span>
          </div>
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-medium">
            Cambiar Portada
          </div>
        </div>
        <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="handleFile($event, 'cover')">
      </div>

      <div class="flex items-center gap-4">
        <div 
          class="relative w-24 h-24 bg-gray-100 rounded-full border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer overflow-hidden group hover:border-blue-400 transition shrink-0"
          @click="$refs.logoInput.click()"
        >
          <img v-if="previews.logo" :src="previews.logo" class="absolute inset-0 w-full h-full object-cover" />
          <div v-else class="text-gray-400">
            <Upload :size="24" />
          </div>
          <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-xs font-bold">
            Logo
          </div>
        </div>
        <input ref="logoInput" type="file" accept="image/*" class="hidden" @change="handleFile($event, 'logo')">
        
        <div class="text-sm text-gray-500">
          <p class="font-medium text-gray-700">Logotipo de la Empresa</p>
          <p>Recomendado: 400x400px. Formatos: JPG, PNG.</p>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="font-bold text-gray-800 border-b pb-2">Datos del Negocio</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Negocio</label>
          <div class="relative">
            <Store :size="18" class="absolute left-3 top-3 text-gray-400" />
            <input v-model="form.business_name" type="text" class="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Ferretería El Clavo" required>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">RTN / Tax ID</label>
          <div class="relative">
            <FileText :size="18" class="absolute left-3 top-3 text-gray-400" />
            <input v-model="form.tax_id" type="text" class="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: 08019012345678">
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
        <textarea v-model="form.description" rows="3" class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="¿Qué vende tu negocio? ¿Cuál es tu especialidad?"></textarea>
      </div>
    </div>

    <div class="space-y-4">
      <h3 class="font-bold text-gray-800 border-b pb-2">Contacto</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono del Negocio</label>
          <div class="relative">
            <Phone :size="18" class="absolute left-3 top-3 text-gray-400" />
            <input v-model="form.phone" type="tel" class="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="+504 9988-7766">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Sitio Web (Opcional)</label>
          <div class="relative">
            <Globe :size="18" class="absolute left-3 top-3 text-gray-400" />
            <input v-model="form.website" type="url" class="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="https://mitienda.com">
          </div>
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Dirección Física del Local</label>
        <div class="relative">
          <MapPin :size="18" class="absolute left-3 top-3 text-gray-400" />
          <input v-model="form.address" type="text" class="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Centro Comercial Los Próceres, Local 5">
        </div>
      </div>
    </div>

    <div class="pt-4">
      <button 
        type="submit" 
        class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
        :disabled="loading"
      >
        <Loader2 v-if="loading" class="animate-spin" :size="20" />
        <span>{{ loading ? 'Guardando...' : btnLabel }}</span>
      </button>
    </div>

  </form>
</template>

<script setup>
import { Store, FileText, MapPin, Phone, Globe, Image, Upload, Loader2 } from 'lucide-vue-next';

const props = defineProps({
  initialData: { type: Object, default: () => null },
  loading: Boolean,
  btnLabel: { type: String, default: 'Guardar Negocio' }
});

const emit = defineEmits(['submit']);
const config = useRuntimeConfig();

const form = reactive({
  business_name: '',
  tax_id: '',
  description: '',
  phone: '',
  website: '',
  address: ''
});

const files = reactive({
  logo: null,
  cover: null
});

const previews = reactive({
  logo: null,
  cover: null
});

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

watchEffect(() => {
  if (props.initialData) {
    Object.assign(form, props.initialData);
    if (props.initialData.logo) previews.logo = getImageUrl(props.initialData.logo);
    if (props.initialData.cover_image) previews.cover = getImageUrl(props.initialData.cover_image);
  }
});

const handleFile = (event, type) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) return alert('Solo imágenes');
  
  files[type] = file;
  previews[type] = URL.createObjectURL(file);
};

const handleSubmit = () => {
  emit('submit', { form: { ...form }, files: { ...files } });
};
</script>