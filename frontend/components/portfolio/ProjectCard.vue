<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition">
    <div class="aspect-video bg-gray-100 relative overflow-hidden">
      <img 
        v-if="project.images && project.images.length > 0" 
        :src="getImageUrl(project.images[0])" 
        class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        alt="Proyecto"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <ImageOff :size="32" />
      </div>

      <div v-if="project.images.length > 1" class="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
        <Images :size="12" /> +{{ project.images.length - 1 }}
      </div>
    </div>

    <div class="p-4">
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-bold text-gray-800 line-clamp-1" :title="project.title">
          {{ project.title }}
        </h3>
        <button 
          @click="$emit('delete', project._id)" 
          class="text-gray-400 hover:text-red-500 transition p-1"
          title="Eliminar proyecto"
        >
          <Trash2 :size="16" />
        </button>
      </div>
      
      <p class="text-sm text-gray-500 line-clamp-2 mb-3 h-10">
        {{ project.description || 'Sin descripción' }}
      </p>

      <div class="flex items-center justify-between text-xs text-gray-400 border-t pt-3">
        <span class="bg-gray-100 px-2 py-1 rounded">{{ project.category || 'General' }}</span>
        <span>{{ formatDate(project.completedAt) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Trash2, Images, ImageOff } from 'lucide-vue-next';

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
});

defineEmits(['delete']);

const config = useRuntimeConfig();

const getImageUrl = (path) => {
  if (!path) return '';
  const baseUrl = config.public.apiBase.replace('/api', '');
  const cleanPath = path.replace(/\\/g, '/');
  return `${baseUrl}/${cleanPath}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-HN', { month: 'short', year: 'numeric' });
};
</script>