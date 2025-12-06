<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/business" class="bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft :size="24" />
        </NuxtLink>
        <h1 class="text-3xl font-bold text-gray-800">Pedidos Recibidos</h1>
      </div>

      <div v-if="loading" class="text-center py-20">
        <Loader2 class="animate-spin mx-auto text-blue-600" :size="40" />
      </div>

      <div v-else-if="sales.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm">
         <Inbox :size="48" class="mx-auto text-gray-300 mb-4" />
         <p class="text-gray-500">Aún no has recibido pedidos.</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
            <tr>
              <th class="px-6 py-3">Producto</th>
              <th class="px-6 py-3">Cliente</th>
              <th class="px-6 py-3">Fecha</th>
              <th class="px-6 py-3 text-right">Total</th>
              <th class="px-6 py-3">Dirección</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-for="item in sales" :key="item.id" class="hover:bg-gray-50">
              <td class="px-6 py-4">
                <p class="font-bold text-gray-800">{{ item.Product?.title }}</p>
                <p class="text-xs text-gray-500">Cant: {{ item.quantity }}</p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <User :size="16" class="text-gray-400" />
                  <span>{{ item.Order?.Customer?.first_name }} {{ item.Order?.Customer?.last_name }}</span>
                </div>
                <p class="text-xs text-gray-400 ml-6">{{ item.Order?.Customer?.phone }}</p>
              </td>
              <td class="px-6 py-4 text-gray-600">
                {{ formatDate(item.createdAt) }}
              </td>
              <td class="px-6 py-4 text-right font-bold text-blue-600">
                L. {{ item.subtotal }}
              </td>
              <td class="px-6 py-4 text-gray-600 max-w-xs truncate" :title="item.Order?.ShippingAddress?.street_address">
                {{ item.Order?.ShippingAddress?.city }}, {{ item.Order?.ShippingAddress?.state }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Loader2, Inbox, User } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const authStore = useAuthStore();
const sales = ref([]);
const loading = ref(true);

const formatDate = (d) => new Date(d).toLocaleDateString('es-HN');

onMounted(async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/orders`, {
      params: { type: 'seller' },
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    sales.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>