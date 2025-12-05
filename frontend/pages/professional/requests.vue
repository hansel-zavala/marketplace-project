<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-5xl">
      
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/professional" class="bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-gray-800 transition">
          <ArrowLeft :size="24" />
        </NuxtLink>
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Solicitudes de Trabajo</h1>
          <p class="text-gray-500">Gestiona tus pedidos entrantes y en curso</p>
        </div>
      </div>

      <div class="flex gap-4 border-b border-gray-200 mb-8 overflow-x-auto">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="pb-3 px-4 font-medium transition whitespace-nowrap border-b-2"
          :class="activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          {{ tab.label }}
          <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-2">
            {{ getCount(tab.id) }}
          </span>
        </button>
      </div>

      <div v-if="fetching" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-blue-600" :size="40" />
      </div>

      <div v-else-if="filteredRequests.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
        <Inbox :size="48" class="mx-auto text-gray-300 mb-4" />
        <h3 class="text-lg font-bold text-gray-700">No hay solicitudes en esta sección</h3>
        <p class="text-gray-500">Espera a que los clientes te contacten.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServiceRequestCard 
          v-for="req in filteredRequests" 
          :key="req.id" 
          :request="req" 
          :loading="updating === req.id"
          @updateStatus="handleUpdateStatus"
        />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Loader2, Inbox } from 'lucide-vue-next';
import ServiceRequestCard from '~/components/service/ServiceRequestCard.vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const authStore = useAuthStore();

const fetching = ref(true);
const updating = ref(null);
const requests = ref([]);
const activeTab = ref('pending');

const tabs = [
  { id: 'pending', label: 'Pendientes' },
  { id: 'accepted', label: 'En Curso' },
  { id: 'completed', label: 'Historial' }
];

const filteredRequests = computed(() => {
  if (activeTab.value === 'pending') {
    return requests.value.filter(r => r.status === 'pending');
  }
  if (activeTab.value === 'accepted') {
    return requests.value.filter(r => r.status === 'accepted');
  }
  return requests.value.filter(r => ['completed', 'rejected', 'cancelled'].includes(r.status));
});

const getCount = (tabId) => {
  if (tabId === 'pending') return requests.value.filter(r => r.status === 'pending').length;
  if (tabId === 'accepted') return requests.value.filter(r => r.status === 'accepted').length;
  return requests.value.filter(r => ['completed', 'rejected', 'cancelled'].includes(r.status)).length;
};

const fetchRequests = async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/service-requests/professional`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    requests.value = data;
  } catch (error) {
    console.error(error);
  } finally {
    fetching.value = false;
  }
};

const handleUpdateStatus = async (id, newStatus) => {
  if (!confirm(`¿Estás seguro de cambiar el estado a "${newStatus}"?`)) return;
  
  updating.value = id;
  try {
    await $fetch(`${config.public.apiBase}/service-requests/${id}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: { status: newStatus }
    });

    const req = requests.value.find(r => r.id === id);
    if (req) req.status = newStatus;
    
    alert('Estado actualizado correctamente');
  } catch (error) {
    console.error(error);
    alert('Error al actualizar estado');
  } finally {
    updating.value = null;
  }
};

onMounted(fetchRequests);
</script>