<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      
      <div class="mb-6">
        <NuxtLink to="/" class="text-sm text-gray-500 hover:text-blue-600 mb-4 inline-block">&larr; Volver al inicio</NuxtLink>
        <h1 class="text-3xl font-bold text-gray-800">
          Resultados para "<span class="text-blue-600">{{ query }}</span>"
        </h1>
      </div>

      <div class="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="pb-3 px-2 font-medium transition whitespace-nowrap"
          :class="activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }} 
          <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-1">{{ getCount(tab.id) }}</span>
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-blue-600" :size="40" />
      </div>

      <div v-else-if="isEmpty" class="text-center py-16 bg-white rounded-xl shadow-sm">
        <SearchX :size="64" class="mx-auto text-gray-300 mb-4" />
        <h3 class="text-xl font-bold text-gray-700">No encontramos coincidencias</h3>
        <p class="text-gray-500 mt-2">Intenta con otro término.</p>
      </div>

      <div v-else class="space-y-12">
        
        <div v-if="(activeTab === 'all' || activeTab === 'pros') && results.professionals.length > 0">
          <h2 v-if="activeTab === 'all'" class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase :size="24" /> Profesionales
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink 
              v-for="pro in results.professionals" 
              :key="pro.id"
              :to="`/professionals/${pro.id}`"
              class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group p-6"
            >
              <div class="flex items-center gap-4 mb-4">
                <div class="w-14 h-14 rounded-full bg-gray-100 overflow-hidden">
                  <img v-if="pro.User?.profile_image" :src="getAvatarUrl(pro.User.profile_image)" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400"><UserIcon :size="28" /></div>
                </div>
                <div>
                  <h3 class="font-bold text-gray-800 group-hover:text-blue-600 transition">
                    {{ pro.User?.first_name }} {{ pro.User?.last_name }}
                  </h3>
                  <p class="text-blue-600 text-sm font-medium">{{ pro.profession }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm pt-4 border-t border-gray-50">
                <div class="flex items-center gap-1 font-bold text-gray-700">
                  <Star :size="16" class="text-yellow-400 fill-current" /> {{ pro.rating || '0.0' }}
                </div>
                <div class="text-gray-500">L. {{ pro.hourly_rate }} / hr</div>
              </div>
            </NuxtLink>
          </div>
        </div>

        <div v-if="(activeTab === 'all' || activeTab === 'products') && results.products.length > 0">
          <h2 v-if="activeTab === 'all'" class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Package :size="24" /> Productos
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <NuxtLink 
              v-for="prod in results.products" 
              :key="prod.id"
              :to="`/products/${prod.id}`"
              class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
            >
              <div class="aspect-square bg-gray-100 relative overflow-hidden">
                <img v-if="prod.images?.[0]" :src="getAvatarUrl(prod.images[0].image_url)" class="w-full h-full object-cover group-hover:scale-105 transition" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400"><Package :size="32" /></div>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600">{{ prod.title }}</h4>
                <p class="text-lg font-bold text-blue-600">L. {{ prod.price }}</p>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { Loader2, SearchX, User as UserIcon, Star, Briefcase, Package } from 'lucide-vue-next';

const route = useRoute();
const config = useRuntimeConfig();

const loading = ref(true);
const activeTab = ref('all');
const results = reactive({ professionals: [], products: [] });

const query = computed(() => route.query.q || '');

const tabs = [
  { id: 'all', label: 'Todos' },
  { id: 'pros', label: 'Profesionales' },
  { id: 'products', label: 'Productos' }
];

const getCount = (tabId) => {
  if (tabId === 'all') return results.professionals.length + results.products.length;
  if (tabId === 'pros') return results.professionals.length;
  if (tabId === 'products') return results.products.length;
  return 0;
};

const isEmpty = computed(() => {
  return results.professionals.length === 0 && results.products.length === 0;
});

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
    const data = await $fetch(`${config.public.apiBase}/search/global`, {
      params: { q: query.value }
    });
    results.professionals = data.professionals;
    results.products = data.products;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

onMounted(performSearch);
watch(() => route.query.q, performSearch);
</script>