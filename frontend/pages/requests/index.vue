<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-5xl">
      
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/profile" class="bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft :size="24" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Mis Solicitudes</h1>
          <p class="text-gray-500">Estado de tus servicios solicitados</p>
        </div>
      </div>

      <div v-if="fetching" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-blue-600" :size="40" />
      </div>

      <div v-else-if="requests.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
           <Briefcase :size="40" class="text-gray-300" />
        </div>
        <h3 class="text-lg font-bold text-gray-700">No tienes solicitudes activas</h3>
        <p class="text-gray-500 mb-6">Busca un profesional para iniciar un servicio.</p>
        <NuxtLink to="/" class="text-blue-600 font-medium hover:underline">Buscar Profesionales</NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServiceRequestCard 
          v-for="req in requests" 
          :key="req.id" 
          :request="req"
          view-mode="client" 
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Loader2, Briefcase } from 'lucide-vue-next';
import ServiceRequestCard from '~/components/service/ServiceRequestCard.vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const authStore = useAuthStore();
const fetching = ref(true);
const requests = ref([]);

onMounted(async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/service-requests/client`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    requests.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    fetching.value = false;
  }
});
</script>