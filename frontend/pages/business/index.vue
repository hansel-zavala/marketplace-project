<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div v-if="fetching" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-blue-600" :size="40" />
      </div>

      <div v-else-if="!business" class="max-w-3xl mx-auto">
        <div class="text-center mb-10">
          <div
            class="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Store :size="40" class="text-blue-600" />
          </div>
          <h1 class="text-3xl font-bold text-gray-800">Registra tu Negocio</h1>
          <p class="text-gray-600 mt-2 text-lg">
            Crea tu tienda oficial para vender productos y llegar a más clientes.
          </p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <BusinessForm :loading="saving" btn-label="Crear mi Tienda" @submit="saveBusiness" />
        </div>
      </div>

      <div v-else class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Store :size="32" class="text-blue-600" />
              {{ business.business_name }}
            </h1>
            <p class="text-gray-500">Panel de Administración</p>
          </div>
          <div class="flex gap-3">
            <NuxtLink
              :to="`/businesses/${business.id}`"
              class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2 transition"
            >
              <ExternalLink :size="18" /> Ver como Cliente
            </NuxtLink>
            <NuxtLink
              to="/profile"
              class="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium flex items-center gap-2"
            >
              Volver a Usuario
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="space-y-6">
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div class="flex items-center gap-4 mb-4">
                <img
                  v-if="business.logo"
                  :src="getImageUrl(business.logo)"
                  class="w-16 h-16 rounded-full object-cover border border-gray-200"
                />
                <div
                  v-else
                  class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"
                >
                  <Store :size="24" />
                </div>
                <div>
                  <p class="font-bold text-gray-800">Estado</p>
                  <span
                    v-if="business.verification_status === 'verified'"
                    class="text-green-600 text-sm font-medium flex items-center gap-1"
                  >
                    <BadgeCheck :size="14" /> Verificado
                  </span>
                  <span v-else class="text-gray-500 text-sm font-medium">No Verificado</span>
                </div>
              </div>

              <div class="border-t pt-4 mt-4">
                <p class="text-sm text-gray-500 mb-1">RTN / Tax ID</p>
                <p class="font-mono text-gray-800">{{ business.tax_id || 'No registrado' }}</p>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 class="font-bold text-gray-700 mb-4">Gestión</h3>
              <ul class="space-y-2">
                <li>
                  <NuxtLink
                    to="/business/products"
                    class="block w-full text-left p-3 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-2"
                  >
                    <Package :size="18" /> Gestión de Productos
                  </NuxtLink>
                </li>

                <li>
                  <NuxtLink
                    to="/business/orders"
                    class="block w-full text-left p-3 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center gap-2"
                  >
                    <ShoppingCart :size="18" /> Pedidos
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>

          <div class="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Editar Información del Negocio</h2>
            </div>

            <BusinessForm
              :initial-data="business"
              :loading="saving"
              btn-label="Actualizar Datos"
              @submit="saveBusiness"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import BusinessForm from '~/components/business/BusinessForm.vue';
  import { useAuthStore } from '~/stores/auth';
  import { Store, Loader2, ExternalLink, BadgeCheck, Package, ShoppingCart } from 'lucide-vue-next';

  definePageMeta({ middleware: ['auth'] });

  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const fetching = ref(true);
  const saving = ref(false);
  const business = ref(null);

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = config.public.apiBase.replace('/api', '');
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

  onMounted(async () => {
    try {
      const data = await $fetch(`${config.public.apiBase}/businesses/me`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      business.value = data;
    } catch (error) {
      if (error.statusCode !== 404) console.error(error);
    } finally {
      fetching.value = false;
    }
  });

  const saveBusiness = async ({ form, files }) => {
    saving.value = true;

    const formData = new FormData();

    for (const key in form) {
      if (form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key]);
      }
    }

    if (files.logo) formData.append('logo', files.logo);
    if (files.cover) formData.append('cover', files.cover);

    try {
      const response = await $fetch(`${config.public.apiBase}/businesses`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: formData,
      });

      business.value = response.business;
      alert('Negocio guardado correctamente');

      if (authStore.user.user_type !== 'business') {
        authStore.fetchUser(true);
      }
    } catch (error) {
      console.error(error);
      alert('Error: ' + (error.data?.message || error.message));
    } finally {
      saving.value = false;
    }
  };
</script>
