<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="loading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-blue-600" :size="40" />
    </div>

    <div v-else-if="!business" class="text-center py-20">
      <h2 class="text-2xl font-bold text-gray-800">Negocio no encontrado</h2>
      <NuxtLink to="/" class="text-blue-600 hover:underline mt-4 inline-block"
        >Volver al inicio</NuxtLink
      >
    </div>

    <div v-else>
      <div class="relative h-64 md:h-80 bg-gray-800">
        <img
          v-if="business.cover_image"
          :src="getImageUrl(business.cover_image)"
          class="w-full h-full object-cover opacity-90"
        />
        <div
          v-else
          class="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-900 text-white/20"
        >
          <Store :size="80" />
        </div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      <div class="container mx-auto px-4 relative -mt-20 z-10 mb-12">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden pb-8">
          <div class="px-6 md:px-10">
            <div class="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-12 mb-6">
              <div
                class="w-32 h-32 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center shrink-0"
              >
                <img
                  v-if="business.logo"
                  :src="getImageUrl(business.logo)"
                  class="w-full h-full object-cover"
                />
                <div
                  v-else
                  class="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300"
                >
                  <Store :size="48" />
                </div>
              </div>

              <div class="flex-grow pb-2">
                <h1 class="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
                  {{ business.business_name }}
                  <span
                    v-if="business.verification_status === 'verified'"
                    class="text-blue-500"
                    title="Negocio Verificado"
                  >
                    <BadgeCheck :size="24" fill="currentColor" class="text-blue-100" />
                  </span>
                </h1>
                <div class="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span
                    v-if="business.rating > 0"
                    class="flex items-center gap-1 font-bold text-gray-800 bg-yellow-50 px-2 py-1 rounded"
                  >
                    <Star :size="14" class="text-yellow-400 fill-current" /> {{ business.rating }}
                  </span>
                  <span v-if="business.category" class="bg-gray-100 px-2 py-1 rounded">
                    {{ business.category }}
                  </span>
                </div>
              </div>

              <div class="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
                <button
                  class="flex-1 md:flex-none bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <MessageCircle :size="18" /> Contactar
                </button>
                <NuxtLink
                  v-if="isOwner"
                  to="/business"
                  class="flex-1 md:flex-none bg-gray-100 text-gray-700 px-6 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2"
                >
                  <Edit :size="18" /> Gestionar
                </NuxtLink>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
              <div class="space-y-6">
                <div class="prose prose-sm text-gray-600">
                  <h3 class="text-gray-800 font-bold text-lg mb-2">Sobre Nosotros</h3>
                  <p>{{ business.description || 'Sin descripción disponible.' }}</p>
                </div>

                <div class="border-t border-gray-100 pt-6">
                  <h3 class="text-gray-800 font-bold text-lg mb-4">Contacto</h3>
                  <ul class="space-y-4 text-sm text-gray-600">
                    <li v-if="business.address" class="flex items-start gap-3">
                      <MapPin :size="18" class="text-gray-400 shrink-0 mt-0.5" />
                      <span>{{ business.address }}</span>
                    </li>
                    <li v-if="business.phone" class="flex items-center gap-3">
                      <Phone :size="18" class="text-gray-400 shrink-0" />
                      <span>{{ business.phone }}</span>
                    </li>
                    <li v-if="business.website" class="flex items-center gap-3">
                      <Globe :size="18" class="text-gray-400 shrink-0" />
                      <a
                        :href="business.website"
                        target="_blank"
                        class="text-blue-600 hover:underline truncate"
                        >{{ business.website }}</a
                      >
                    </li>
                    <li v-if="business.tax_id" class="flex items-center gap-3">
                      <FileText :size="18" class="text-gray-400 shrink-0" />
                      <span class="font-mono text-xs text-gray-500"
                        >RTN: {{ business.tax_id }}</span
                      >
                    </li>
                  </ul>
                </div>
              </div>

              <div class="lg:col-span-2">
                <h3 class="font-bold text-gray-800 mb-6 text-xl flex items-center gap-2">
                  <Package :size="22" class="text-blue-600" /> Catálogo
                </h3>

                <div
                  v-if="products.length === 0"
                  class="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-12 text-center"
                >
                  <ShoppingBag :size="48" class="mx-auto mb-3 text-gray-300" />
                  <p class="text-gray-500 font-medium">Esta tienda aún no ha subido productos.</p>
                </div>

                <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <NuxtLink
                    v-for="prod in products"
                    :key="prod.id"
                    :to="`/products/${prod.id}`"
                    class="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group"
                  >
                    <div class="aspect-square bg-gray-100 relative overflow-hidden">
                      <img
                        v-if="prod.images && prod.images.length > 0"
                        :src="getImageUrl(prod.images[0].image_url)"
                        class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      <div
                        v-else
                        class="w-full h-full flex items-center justify-center text-gray-400"
                      >
                        <Package :size="32" />
                      </div>
                      <div
                        v-if="prod.stock === 0"
                        class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded font-bold"
                      >
                        Agotado
                      </div>
                    </div>

                    <div class="p-4">
                      <h4
                        class="font-bold text-gray-800 mb-1 line-clamp-1 group-hover:text-blue-600 transition"
                      >
                        {{ prod.title }}
                      </h4>
                      <p class="text-lg font-bold text-blue-600">L. {{ prod.price }}</p>
                      <div class="flex justify-between items-center mt-2">
                        <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{{
                          prod.condition === 'new' ? 'Nuevo' : 'Usado'
                        }}</span>
                      </div>
                    </div>
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {
    Loader2,
    Store,
    BadgeCheck,
    Star,
    MessageCircle,
    Edit,
    Info,
    MapPin,
    Phone,
    Globe,
    FileText,
    Package,
    ShoppingBag,
  } from 'lucide-vue-next';
  import { useAuthStore } from '~/stores/auth';
  import ProductCard from '~/components/products/ProductCard.vue';

  const products = ref([]);

  onMounted(async () => {
    try {
      // 1. Cargar Negocio
      const data = await $fetch(`${config.public.apiBase}/businesses/${businessId}`);
      business.value = data;

      // 2. 👇 CARGAR PRODUCTOS DEL NEGOCIO
      const productsData = await $fetch(`${config.public.apiBase}/products/business/${businessId}`);
      products.value = productsData;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  });
  

  const route = useRoute();
  const config = useRuntimeConfig();
  const authStore = useAuthStore();

  const loading = ref(true);
  const business = ref(null);
  const businessId = route.params.id;

  const isOwner = computed(() => {
    return authStore.user?.user_type === 'business';
  });

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = config.public.apiBase.replace('/api', '');
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

  onMounted(async () => {
    try {
      const data = await $fetch(`${config.public.apiBase}/businesses/${businessId}`);
      business.value = data;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  });
</script>
