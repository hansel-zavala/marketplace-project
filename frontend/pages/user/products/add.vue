<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto">
        
        <NuxtLink to="/user/products" class="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-6 transition font-medium">
          <ArrowLeft :size="20" /> Volver a mis ventas
        </NuxtLink>

        <div class="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div class="mb-8 border-b pb-4">
             <h1 class="text-2xl font-bold text-gray-800">¿Qué vas a vender hoy?</h1>
             <p class="text-gray-500 text-sm">Publica tu artículo en el Marketplace general.</p>
          </div>
          
          <ProductForm 
            :loading="saving" 
            btn-label="Publicar Anuncio"
            @submit="saveProduct" 
          />
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

onMounted(() => {
  if (!authStore.user?.phone) {
    alert('⚠️ Para vender artículos, necesitamos tu número de teléfono. Por favor agrégalo en tu perfil.');
    router.push('/profile?edit=true');
  }
});

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
    
    alert('¡Artículo publicado! Ahora es visible en el Marketplace.');
    router.push('/user/products');

  } catch (error) {
    console.error(error);
    alert('Error al publicar: ' + (error.data?.message || error.message));
  } finally {
    saving.value = false;
  }
};
</script>