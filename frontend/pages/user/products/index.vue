<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <NuxtLink to="/profile" class="text-gray-500 hover:text-gray-800 transition">
            <ArrowLeft :size="24" />
          </NuxtLink>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Mis Ventas</h1>
            <p class="text-gray-500">Gestiona los artículos que ofreces en el Marketplace</p>
          </div>
        </div>
        <NuxtLink 
          to="/user/products/add" 
          class="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-bold shadow-sm transition"
        >
          <Plus :size="20" /> Vender Artículo
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">
        <Loader2 class="animate-spin mx-auto mb-2" :size="32" /> Cargando tus artículos...
      </div>

      <div v-else-if="products.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center border border-dashed border-gray-300">
        <div class="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
           <Tag :size="40" class="text-blue-500" />
        </div>
        <h3 class="text-xl font-bold text-gray-700">No estás vendiendo nada aún</h3>
        <p class="text-gray-500 mb-6">¡Convierte tus cosas usadas en dinero extra!</p>
        <NuxtLink to="/user/products/add" class="text-blue-600 font-bold hover:underline">Publicar mi primer anuncio</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="prod in products" 
          :key="prod.id" 
          :product="prod" 
          @delete="deleteProduct" 
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus, Loader2, Tag } from 'lucide-vue-next';
import ProductCard from '~/components/products/ProductCard.vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const authStore = useAuthStore();
const products = ref([]);
const loading = ref(true);

const fetchProducts = async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/products/me`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    products.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const deleteProduct = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este artículo?')) return;
  
  products.value = products.value.filter(p => p.id !== id);
  alert('Artículo eliminado (Simulado)');
};

onMounted(fetchProducts);
</script>