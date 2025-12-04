<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      
      <div class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Servicios Disponibles</h1>
          <p class="text-gray-500 mt-1">Explora todos los profesionales y servicios en nuestra plataforma</p>
        </div>
        
        <div class="relative w-full md:w-96">
          <input 
            v-model="searchQuery"
            @keyup.enter="handleSearch"
            type="text" 
            placeholder="Buscar un servicio..." 
            class="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
          <Search :size="20" class="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-blue-600" :size="40" />
      </div>

      <div v-else-if="professionals.length === 0" class="text-center py-16 bg-white rounded-xl shadow-sm">
        <Briefcase :size="64" class="mx-auto text-gray-300 mb-4" />
        <h3 class="text-xl font-bold text-gray-700">No hay servicios disponibles aún</h3>
        <p class="text-gray-500 mt-2">Vuelve más tarde para ver nuevos profesionales.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <NuxtLink 
          v-for="pro in professionals" 
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
import { Loader2, Search, User as UserIcon, BadgeCheck, Star, Briefcase } from 'lucide-vue-next';

const config = useRuntimeConfig();
const router = useRouter();

const loading = ref(true);
const professionals = ref([]);
const searchQuery = ref('');

const getAvatarUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } });
  }
};

onMounted(async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/search/professionals`);
    professionals.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>
