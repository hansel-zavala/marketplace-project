<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center gap-4">
          <NuxtLink to="/business" class="text-gray-500 hover:text-gray-800">
            <ArrowLeft :size="24" />
          </NuxtLink>
          <h1 class="text-3xl font-bold text-gray-800">Inventario</h1>
        </div>
        <NuxtLink to="/business/products/add" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm">
          <Plus :size="20" /> Nuevo Producto
        </NuxtLink>
      </div>

      <div v-if="loading" class="text-center py-20 text-gray-500">
        <Loader2 class="animate-spin mx-auto mb-2" :size="32" /> Cargando inventario...
      </div>

      <div v-else-if="products.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center border border-dashed border-gray-300">
        <Package :size="48" class="mx-auto mb-3 text-gray-300" />
        <h3 class="text-lg font-bold text-gray-700">Tu tienda está vacía</h3>
        <p class="text-gray-500 mb-6">Agrega tus productos para empezar a vender.</p>
        <NuxtLink to="/business/products/add" class="text-blue-600 font-medium hover:underline">Agregar primer producto</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ProductCard v-for="prod in products" :key="prod.id" :product="prod" @delete="deleteProduct" />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus, Loader2, Package } from 'lucide-vue-next';
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
  if (!confirm('¿Eliminar este producto?')) return;
  
  try {
    await $fetch(`${config.public.apiBase}/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    products.value = products.value.filter(p => p.id !== id);
  } catch (error) {
    console.error(error);
    alert('Error al eliminar producto: ' + (error.data?.message || error.message));
  }
};

onMounted(fetchProducts);
</script>