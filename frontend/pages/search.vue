<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      
      <div class="mb-8">
        <NuxtLink to="/" class="text-sm text-gray-500 hover:text-blue-600 mb-4 inline-block">&larr; Volver al inicio</NuxtLink>
        <h1 class="text-3xl font-bold text-gray-800">
          Resultados para "<span class="text-blue-600">{{ query }}</span>"
        </h1>
        <p class="text-gray-500 mt-1">{{ results.length }} profesionales encontrados</p>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-blue-600" :size="40" />
      </div>

      <div v-else-if="results.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm">
        <SearchX :size="64" class="mx-auto text-gray-300 mb-4" />
        <h3 class="text-xl font-bold text-gray-700">No encontramos coincidencias</h3>
        <p class="text-gray-500 mt-2">Intenta con otro término (ej: "Abogado", "Mecánico")</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <NuxtLink 
          v-for="pro in results" 
          :key="pro.id"
          :to="`/professionals/${pro.id}`"
          class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
        >
          <div class="p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                  <img 
                    v-if="pro.User?.profile_image" 
                    :src="getAvatarUrl(pro.User.profile_image)" 
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                    <UserIcon :size="32" />
                  </div>
                </div>
                <div>
                  <h3 class="font-bold text-gray-800 group-hover:text-blue-600 transition">
                    {{ pro.User?.first_name }} {{ pro.User?.last_name }}
                  </h3>
                  <p class="text-blue-600 text-sm font-medium">{{ pro.profession }}</p>
                </div>
              </div>
              <div v-if="pro.verification_status === 'verified'" class="text-blue-500" title="Verificado">
                <BadgeCheck :size="20" fill="currentColor" class="text-blue-50" />
              </div>
            </div>

            <p class="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
              {{ pro.bio || 'Sin biografía disponible.' }}
            </p>

            <div class="flex items-center justify-between text-sm pt-4 border-t border-gray-50">
              <div class="flex items-center gap-1 text-gray-700 font-bold">
                <Star :size="16" class="text-yellow-400 fill-current" />
                {{ pro.rating || '0.0' }}
              </div>
              <div class="text-gray-500">
                L. {{ pro.hourly_rate }} / hr
              </div>
            </div>
          </div>
          
          <div class="bg-gray-50 px-6 py-3 text-center text-sm font-medium text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
            Ver Perfil Completo
          </div>
        </NuxtLink>

      </div>

    </div>
  </div>
</template>

<script setup>
import { Loader2, SearchX, User as UserIcon, BadgeCheck, Star } from 'lucide-vue-next';

const route = useRoute();
const config = useRuntimeConfig();

const loading = ref(true);
const results = ref([]);
const query = computed(() => route.query.q || '');

const getAvatarUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

const performSearch = async () => {
  if (!query.value) return;
  
  loading.value = true;
  try {
    const data = await $fetch(`${config.public.apiBase}/search/professionals`, {
      params: { q: query.value }
    });
    results.value = data;
  } catch (error) {
    console.error(error);
    results.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  performSearch();
});

watch(() => route.query.q, () => {
  performSearch();
});
</script>