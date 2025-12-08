<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group h-full">
    <div class="h-24 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
      <div class="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div class="w-16 h-16 bg-white rounded-lg shadow-md p-1">
          <img 
            v-if="business.logo" 
            :src="getImageUrl(business.logo)" 
            class="w-full h-full object-cover rounded"
          />
          <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center rounded text-gray-400">
            <Store :size="24" />
          </div>
        </div>
      </div>
    </div>

    <div class="pt-10 pb-6 px-4 text-center">
      <h3 class="font-bold text-gray-800 text-lg mb-1 truncate">{{ business.business_name }}</h3>
      <p class="text-gray-500 text-xs mb-4 uppercase tracking-wide font-medium">{{ business.category || 'Tienda' }}</p>

      <div class="flex items-center justify-center gap-4 text-xs text-gray-600 mb-4">
        <span class="flex items-center gap-1">
          <MapPin :size="14" /> {{ business.city || 'Honduras' }}
        </span>
      </div>

      <NuxtLink 
        :to="`/businesses/${business.id}`" 
        class="inline-block w-full py-2 bg-gray-50 text-gray-700 font-bold text-sm rounded-lg hover:bg-gray-100 transition"
      >
        Visitar Tienda
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { Store, MapPin } from 'lucide-vue-next';

const props = defineProps({
  business: { type: Object, required: true }
});

const config = useRuntimeConfig();

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};
</script>
