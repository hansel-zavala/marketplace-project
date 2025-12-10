<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <NuxtLink to="/addresses" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
          <ArrowLeft :size="20" /> Volver a mis direcciones
        </NuxtLink>

        <div class="bg-white rounded-lg shadow-md p-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">Nueva Dirección</h1>
          
          <AddressForm 
            :loading="loading" 
            @submit="saveAddress" 
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
import { useToastStore } from '~/stores/toast';

definePageMeta({ middleware: ['auth'] });

const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const toastStore = useToastStore();
const loading = ref(false);

const saveAddress = async (formData) => {
  loading.value = true;
  try {
    await $fetch(`${config.public.apiBase}/addresses`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    });
    toastStore.show('Dirección guardada con éxito', 'success');
    router.push('/addresses');
  } catch (error) {
    console.error(error);
    toastStore.show('Error al guardar: ' + (error.data?.message || error.message), 'error');
  } finally {
    loading.value = false;
  }
};
</script>