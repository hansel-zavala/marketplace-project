<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <NuxtLink to="/business/products" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
          <ArrowLeft :size="20" /> Volver al inventario
        </NuxtLink>

        <div class="bg-white rounded-xl shadow-md p-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">Nuevo Producto</h1>
          <ProductForm :loading="saving" @submit="saveProduct" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductForm from '~/components/products/ProductForm.vue';
import { ArrowLeft } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const saving = ref(false);

const saveProduct = async ({ form, files }) => {
  saving.value = true;
  const formData = new FormData();

  for (const key in form) formData.append(key, form[key]);
  
  files.forEach(file => formData.append('images', file));

  try {
    await $fetch(`${config.public.apiBase}/products`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    });
    alert('Producto publicado exitosamente');
    router.push('/business/products');
  } catch (error) {
    console.error(error);
    alert('Error: ' + (error.data?.message || error.message));
  } finally {
    saving.value = false;
  }
};
</script>