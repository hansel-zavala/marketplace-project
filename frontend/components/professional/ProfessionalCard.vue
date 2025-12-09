<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group h-full flex flex-col">
    <div class="p-6 flex flex-col items-center text-center flex-grow">
      <!-- Avatar -->
      <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 mb-4 shadow-sm group-hover:scale-105 transition duration-300">
        <img 
          v-if="professional.User?.profile_image" 
          :src="getImageUrl(professional.User.profile_image)" 
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
          <User :size="40" />
        </div>
      </div>

      <h3 class="font-bold text-gray-800 text-lg mb-1">
        {{ professional.User?.first_name }} {{ professional.User?.last_name }}
      </h3>
      <p class="text-blue-600 font-medium text-sm mb-3">{{ professional.profession }}</p>

      <div class="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full mb-4">
        <Star :size="14" class="text-yellow-400 fill-current" />
        <span class="text-xs font-bold text-gray-700">{{ professional.rating || 'New' }}</span>
        <span class="text-xs text-gray-400" v-if="professional.total_jobs">({{ professional.total_jobs }} trabajos)</span>
      </div>

      <div class="w-full grid grid-cols-2 gap-2 text-xs text-gray-500 border-t pt-4 mt-auto">
        <div class="flex flex-col items-center">
          <span class="font-bold text-gray-700">L. {{ professional.fee }}</span>
          <span>{{ billingTypeLabel }}</span>
        </div>
        <div class="flex flex-col items-center border-l truncate px-1">
          <span class="font-bold text-gray-700 truncate w-full text-center" :title="professional.department">
            {{ professional.department }}
          </span>
          <span class="truncate w-full text-center" :title="professional.municipality">
            {{ professional.municipality }}
          </span>
        </div>
      </div>
    </div>

    <div class="p-4 border-t border-gray-50 bg-gray-50/50">
      <NuxtLink 
        :to="`/professionals/${professional.id}`" 
        class="block w-full py-2 bg-white border border-blue-200 text-blue-600 rounded-lg text-center font-bold text-sm hover:bg-blue-600 hover:text-white transition"
      >
        Ver Perfil
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { User, Star } from 'lucide-vue-next';

const props = defineProps({
  professional: { type: Object, required: true }
});

const config = useRuntimeConfig();

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

const billingTypeLabel = computed(() => {
    const type = props.professional.billing_type;
    switch(type) {
        case 'hourly': return '/ hora';
        case 'daily': return '/ día';
        case 'job': return 'base';
        default: return '';
    }
});
</script>
