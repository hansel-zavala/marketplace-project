<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <NuxtLink to="/addresses" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
          <ArrowLeft :size="20" /> Cancelar
        </NuxtLink>

        <div class="bg-white rounded-lg shadow-md p-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">Editar Dirección</h1>
          
          <div v-if="fetching" class="text-center py-8 text-gray-500">
            Cargando datos...
          </div>

          <AddressForm 
            v-else
            :initial-data="addressData"
            :loading="saving" 
            @submit="updateAddress" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AddressForm from '~/pages/addresses/AddressForm.vue';
import { ArrowLeft } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();

const fetching = ref(true);
const saving = ref(false);
const addressData = ref(null);
const addressId = route.params.id;

onMounted(async () => {
  try {
    const allAddresses = await $fetch(`${config.public.apiBase}/addresses`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    const found = allAddresses.find(a => a.id == addressId);
    if (!found) {
      alert('Dirección no encontrada');
      router.push('/addresses');
      return;
    }
    addressData.value = found;
  } catch (error) {
    console.error(error);
  } finally {
    fetching.value = false;
  }
});

const updateAddress = async (formData) => {
  saving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/addresses/${addressId}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    });
    
    alert('Dirección actualizada');
    router.push('/addresses');
  } catch (error) {
    console.error(error);
    alert('Error: ' + (error.data?.message || error.message));
  } finally {
    saving.value = false;
  }
};
</script>