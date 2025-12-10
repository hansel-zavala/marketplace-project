<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition relative">
    <!-- Link Overlay: Makes entire card clickable if 'to' is provided -->
    <NuxtLink v-if="to" :to="to" class="absolute inset-0 z-10" :aria-label="product.title"></NuxtLink>

    <div class="aspect-square bg-gray-100 relative overflow-hidden">
      <img 
        v-if="product.images && product.images.length > 0" 
        :src="getImageUrl(product.images[0].image_url)" 
        class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
        <Package :size="32" />
      </div>
      
      <div class="absolute top-2 left-2">
        <span v-if="product.stock === 0" class="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold">
          {{ readonly ? 'No disponible' : 'Agotado' }}
        </span>
        <span v-else class="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">
          {{ readonly ? 'Disponible' : `En Stock: ${product.stock}` }}
        </span>
      </div>
    </div>

    <div class="p-4">
      <div class="flex justify-between items-start mb-1">
        <h3 class="font-bold text-gray-800 line-clamp-1 text-lg">{{ product.title }}</h3>
        
        <!-- Actions: z-20 to sit above the link overlay -->
        <div v-if="!readonly" class="flex flex-col gap-2 ml-2 relative z-20">
          <button @click.stop="$emit('delete', product.id)" class="text-gray-400 hover:text-red-500 transition" title="Eliminar">
            <Trash2 :size="18" />
          </button>
          <NuxtLink :to="`/business/products/${product.id}`" class="text-gray-400 hover:text-blue-500 transition" title="Editar">
            <Edit2 :size="18" />
          </NuxtLink>
        </div>
      </div>
      
      <p class="text-blue-600 font-bold text-lg mb-2">L. {{ product.price }}</p>
      
      <div class="flex items-center justify-between text-xs text-gray-500 border-t pt-2">
        <span class="capitalize bg-gray-50 px-2 py-1 rounded">{{ translateCondition(product.condition) }}</span>
        <span>{{ product.category || 'General' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Package, Trash2, Edit2 } from 'lucide-vue-next';

const props = defineProps({
  product: { type: Object, required: true },
  to: { type: String, default: null },
  readonly: { type: Boolean, default: false }
});

defineEmits(['delete']);
const config = useRuntimeConfig();

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

const translateCondition = (condition) => {
  const map = { new: 'Nuevo', used: 'Usado', refurbished: 'Restaurado' };
  return map[condition] || condition;
};
</script>