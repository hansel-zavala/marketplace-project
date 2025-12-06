<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      
      <h1 class="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <ShoppingBag :size="32" class="text-blue-600" /> Mis Compras
      </h1>

      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-blue-600" :size="40" />
      </div>

      <div v-else-if="orders.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm">
        <Package :size="48" class="mx-auto text-gray-300 mb-4" />
        <h3 class="text-lg font-bold text-gray-700">No has realizado compras</h3>
        <NuxtLink to="/" class="text-blue-600 hover:underline mt-2 inline-block">Ir a la tienda</NuxtLink>
      </div>

      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.id" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          
          <div class="bg-gray-50 px-6 py-4 border-b border-gray-200 flex flex-wrap justify-between items-center gap-4">
            <div class="flex gap-8 text-sm text-gray-600">
              <div>
                <p class="uppercase text-xs font-bold text-gray-400">Fecha</p>
                <p>{{ formatDate(order.createdAt) }}</p>
              </div>
              <div>
                <p class="uppercase text-xs font-bold text-gray-400">Total</p>
                <p class="font-bold text-gray-800">L. {{ order.total }}</p>
              </div>
              <div>
                <p class="uppercase text-xs font-bold text-gray-400">Enviar a</p>
                <p class="truncate max-w-[150px]" :title="order.ShippingAddress?.street_address">{{ order.ShippingAddress?.city }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
               <span class="text-xs font-mono text-gray-400">#{{ order.order_number }}</span>
               <span class="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800">
                 {{ order.status }}
               </span>
            </div>
          </div>

          <div class="p-6 space-y-4">
            <div v-for="item in order.Items" :key="item.id" class="flex items-start gap-4">
              <div class="w-16 h-16 bg-gray-100 rounded-md overflow-hidden shrink-0 border">
                 <Package :size="24" class="text-gray-400 m-auto mt-4" /> 
              </div>
              <div class="flex-grow">
                <h4 class="font-bold text-gray-800">{{ item.Product?.title }}</h4>
                <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
              </div>
              <p class="font-bold text-gray-700">L. {{ item.subtotal }}</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ShoppingBag, Package, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const authStore = useAuthStore();
const orders = ref([]);
const loading = ref(true);

const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('es-HN', { year: 'numeric', month: 'long', day: 'numeric' });
};

onMounted(async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/orders`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    orders.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>