<template>
    <div class="min-h-screen bg-gray-50 py-12">
        <div class="container mx-auto px-4">

            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-800">Mis Direcciones</h1>
                    <p class="text-gray-500 mt-1">Gestiona tus lugares de entrega y servicio</p>
                </div>
                <NuxtLink to="/addresses/add"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium">
                    <Plus :size="20" /> Nueva Dirección
                </NuxtLink>
            </div>

            <div v-if="loading" class="text-center py-12">
                <p class="text-gray-500">Cargando direcciones...</p>
            </div>

            <div v-else-if="addresses.length === 0" class="text-center py-16 bg-white rounded-lg shadow-sm">
                <MapPin :size="48" class="mx-auto text-gray-300 mb-4" />
                <h3 class="text-lg font-medium text-gray-800">No tienes direcciones guardadas</h3>
                <p class="text-gray-500 mb-6">Agrega una para agilizar tus pedidos.</p>
                <NuxtLink to="/addresses/add" class="text-blue-600 hover:underline">Agregar ahora</NuxtLink>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div v-for="addr in addresses" :key="addr.id"
                    class="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition relative">
                    <span v-if="addr.is_default"
                        class="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">
                        Predeterminada
                    </span>

                    <div class="flex items-start gap-3 mb-3">
                        <MapPin :size="24" class="text-gray-400 mt-1" />
                        <div>
                            <h3 class="font-bold text-gray-800">{{ addr.city }}, {{ addr.state }}</h3>
                            <p class="text-gray-600 text-sm mt-1">{{ addr.street_address }}</p>
                            <p class="text-gray-500 text-xs mt-2">Código Postal: {{ addr.postal_code }}</p>
                        </div>
                    </div>

                    <div class="mt-4 pt-4 border-t flex justify-between items-center text-sm">
                        <span class="capitalize bg-gray-100 px-2 py-1 rounded text-gray-600">
                            {{ formatType(addr.address_type) }}
                        </span>

                        <div class="flex gap-3">
                            <NuxtLink :to="`/addresses/edit/${addr.id}`"
                                class="text-blue-600 hover:text-blue-800 font-medium">
                                Editar
                            </NuxtLink>

                            <button 
                                @click="deleteAddress(addr.id)" 
                                class="text-red-500 hover:text-red-700 font-medium transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { Plus, MapPin } from 'lucide-vue-next';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const authStore = useAuthStore();
const addresses = ref([]);
const loading = ref(true);

const formatType = (type) => {
    const types = {
        shipping: 'Envío',
        billing: 'Facturación',
        service: 'Servicio'
    };
    return types[type] || type;
};

const deleteAddress = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;

  try {
    await $fetch(`${config.public.apiBase}/addresses/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` }
    });

    addresses.value = addresses.value.filter(a => a.id !== id);
    alert('Dirección eliminada');
    
  } catch (error) {
    console.error(error);
    alert('Error al eliminar: ' + (error.data?.message || error.message));
  }
};

onMounted(async () => {
    try {
        const data = await $fetch(`${config.public.apiBase}/addresses`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        addresses.value = data;
    } catch (error) {
        console.error('Error cargando direcciones:', error);
    } finally {
        loading.value = false;
    }
});
</script>