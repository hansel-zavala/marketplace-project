<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="md:col-span-2">
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
        <input v-model="form.title" type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Taladro Percutor 600W" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Precio (L.)</label>
        <input v-model="form.price" type="number" step="0.01" min="0" class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="0.00" required>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Stock (Cantidad)</label>
        <input v-model="form.stock" type="number" min="0" class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" required>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Condición</label>
        <select v-model="form.condition" class="w-full border rounded-lg px-4 py-2 bg-white outline-none focus:ring-2 focus:ring-blue-500">
          <option value="new">Nuevo</option>
          <option value="used">Usado</option>
          <option value="refurbished">Restaurado</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
        <input v-model="form.category" type="text" class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Herramientas">
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
      <textarea v-model="form.description" rows="4" class="w-full border rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Detalles técnicos, marca, modelo..."></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Fotos del Producto (Máx 5)</label>
      <div class="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition cursor-pointer" @click="$refs.fileInput.click()">
        <input ref="fileInput" type="file" multiple accept="image/*" class="hidden" @change="handleFiles">
        
        <div v-if="previews.length === 0" class="py-2 text-gray-400">
          <UploadCloud :size="32" class="mx-auto mb-1" />
          <span>Clic para subir fotos</span>
        </div>

        <div v-else class="grid grid-cols-4 gap-2">
          <div v-for="(src, index) in previews" :key="index" class="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
            <img :src="src" class="w-full h-full object-cover" />
            <button type="button" @click.stop="removeFile(index)" class="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
              <X :size="12" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <button type="submit" class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2" :disabled="loading">
      <Loader2 v-if="loading" class="animate-spin" :size="20" />
      <span>{{ loading ? 'Guardando...' : btnLabel }}</span>
    </button>
  </form>
</template>

<script setup>
import { UploadCloud, X, Loader2 } from 'lucide-vue-next';

const props = defineProps({
  loading: Boolean,
  btnLabel: { type: String, default: 'Publicar Producto' },
  initialData: { type: Object, default: null }
});
const emit = defineEmits(['submit']);

const form = reactive({
  title: '', price: '', stock: 1, condition: 'new', category: '', description: ''
});
const selectedFiles = ref([]);
const previews = ref([]);

const config = useRuntimeConfig();

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

onMounted(() => {
  if (props.initialData) {
    Object.assign(form, {
      title: props.initialData.title,
      price: props.initialData.price,
      stock: props.initialData.stock,
      condition: props.initialData.condition,
      category: props.initialData.category,
      description: props.initialData.description
    });

    if (props.initialData.images && props.initialData.images.length > 0) {
      previews.value = props.initialData.images.map(img => getImageUrl(img.image_url));
    }
  }
});

const handleFiles = (event) => {
  const files = Array.from(event.target.files);
  if (selectedFiles.value.length + files.length > 5) return alert('Máximo 5 fotos');
  
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

const handleSubmit = () => {
  if (!props.initialData && selectedFiles.value.length === 0) return alert('Sube al menos una foto');
  emit('submit', { form: { ...form }, files: selectedFiles.value });
};
</script>