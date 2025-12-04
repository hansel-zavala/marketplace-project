<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        <NuxtLink to="/business/products" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition">
          <ArrowLeft :size="20" /> Volver al inventario
        </NuxtLink>

        <div class="bg-white rounded-xl shadow-md p-8">
          <h1 class="text-2xl font-bold text-gray-800 mb-6">Editar Producto</h1>
          
          <div v-if="fetching" class="flex justify-center py-10">
            <Loader2 class="animate-spin text-blue-600" :size="40" />
          </div>
          
          <ProductForm 
            v-else-if="product" 
            :initial-data="product" 
            :loading="saving" 
            btn-label="Guardar Cambios" 
            @submit="updateProduct" 
          />
          
          <div v-else class="text-center py-10 text-gray-500">
            Producto no encontrado
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ProductForm from '~/components/products/ProductForm.vue';
import { ArrowLeft, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();

const fetching = ref(true);
const saving = ref(false);
const product = ref(null);

onMounted(async () => {
  try {
    const data = await $fetch(`${config.public.apiBase}/products/${route.params.id}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    product.value = data;
  } catch (error) {
    console.error(error);
    alert('Error al cargar el producto');
    router.push('/business/products');
  } finally {
    fetching.value = false;
  }
});

const updateProduct = async ({ form, files }) => {
  saving.value = true;
  const formData = new FormData();

  for (const key in form) formData.append(key, form[key]);
  
  files.forEach(file => formData.append('images', file));

  try {
    await $fetch(`${config.public.apiBase}/products/${route.params.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    });
    alert('Producto actualizado exitosamente');
    router.push('/business/products');
  } catch (error) {
    console.error(error);
    alert('Error: ' + (error.data?.message || error.message));
  } finally {
    saving.value = false;
  }
};
</script>
