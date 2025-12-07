<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div v-if="loading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-blue-600" :size="40" />
    </div>

    <div v-else-if="!product" class="text-center py-20">
      <h2 class="text-2xl font-bold text-gray-800">Producto no encontrado</h2>
      <NuxtLink to="/" class="text-blue-600 hover:underline mt-4 inline-block"
        >Volver al inicio</NuxtLink
      >
    </div>

    <div v-else class="container mx-auto px-4 max-w-6xl">
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <NuxtLink to="/" class="hover:text-blue-600">Inicio</NuxtLink>
        <span>/</span>
        <span class="text-gray-800 font-medium truncate">{{ product.title }}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <div class="space-y-4">
          <div
            class="aspect-square bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center relative"
          >
            <img
              v-if="selectedImage"
              :src="getImageUrl(selectedImage)"
              class="max-w-full max-h-full object-contain"
            />
            <div v-else class="text-gray-300">
              <Package :size="64" />
            </div>
          </div>

          <div
            v-if="product.images && product.images.length > 1"
            class="flex gap-3 overflow-x-auto pb-2"
          >
            <button
              v-for="img in product.images"
              :key="img.id"
              @click="selectedImage = img.image_url"
              class="w-20 h-20 rounded-lg border-2 overflow-hidden shrink-0 transition"
              :class="
                selectedImage === img.image_url
                  ? 'border-blue-600 ring-2 ring-blue-100'
                  : 'border-transparent hover:border-gray-300'
              "
            >
              <img :src="getImageUrl(img.image_url)" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <div>
          <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-full">
            <div class="flex items-center gap-3 mb-4 text-sm">
              <span
                v-if="product.category"
                class="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium"
              >
                {{ product.category }}
              </span>
              <span class="text-gray-500 capitalize">{{
                translateCondition(product.condition)
              }}</span>
            </div>

            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ product.title }}</h1>
            <p class="text-4xl font-bold text-blue-600 mb-6">L. {{ product.price }}</p>

            <div class="space-y-4 border-b border-gray-100 pb-8 mb-8">
              <div v-if="product.stock > 0">
                <div class="flex items-center gap-4 mb-4">
                  <label class="font-medium text-gray-700">Cantidad:</label>
                  <div class="flex items-center border rounded-lg overflow-hidden">
                    <button
                      @click="quantity > 1 ? quantity-- : null"
                      class="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                    >
                      -
                    </button>
                    <input
                      v-model.number="quantity"
                      type="text"
                      class="w-12 text-center py-2 outline-none"
                      readonly
                    />
                    <button
                      @click="quantity < product.stock ? quantity++ : null"
                      class="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                    >
                      +
                    </button>
                  </div>
                  <span class="text-sm text-gray-500">({{ product.stock }} disponibles)</span>
                </div>

                <div class="flex gap-3">
                  <button
                    @click="cartStore.addItem(product, quantity)"
                    class="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-bold shadow-md hover:bg-blue-700 transition transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <ShoppingCart :size="20" />
                    Agregar al Carrito
                  </button>
                </div>
              </div>

              <div v-else class="bg-red-50 text-red-600 p-4 rounded-lg text-center font-bold">
                Producto Agotado
              </div>

              <p class="text-center text-xs text-gray-400 pt-2">
                Vendido y enviado por
                {{
                  product.seller_type === 'business'
                    ? product.seller?.business_name
                    : 'un profesional verificado'
                }}.
              </p>
            </div>

            <div class="mb-8">
              <h3 class="font-bold text-gray-800 mb-2">Descripción</h3>
              <p class="text-gray-600 leading-relaxed whitespace-pre-line">
                {{ product.description || 'Sin descripción detallada.' }}
              </p>
            </div>

            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p class="text-xs uppercase font-bold text-gray-400 mb-3">Vendido por</p>

              <NuxtLink
                v-if="product.seller_type === 'business' && product.seller"
                :to="`/businesses/${product.seller.id}`"
                class="flex items-center gap-3 group"
              >
                <div
                  class="w-12 h-12 bg-white rounded-full border flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="product.seller.logo"
                    :src="getImageUrl(product.seller.logo)"
                    class="w-full h-full object-cover"
                  />
                  <Store v-else :size="20" class="text-gray-400" />
                </div>
                <div>
                  <h4 class="font-bold text-gray-800 group-hover:text-blue-600 transition">
                    {{ product.seller.business_name }}
                  </h4>
                  <p class="text-xs text-gray-500">Ver perfil de la tienda</p>
                </div>
              </NuxtLink>

              <NuxtLink
                v-else-if="product.seller_type === 'professional' && product.seller"
                :to="`/professionals/${product.seller.id}`"
                class="flex items-center gap-3 group"
              >
                <div
                  class="w-12 h-12 bg-white rounded-full border flex items-center justify-center overflow-hidden"
                >
                  <img
                    v-if="product.seller.User?.profile_image"
                    :src="getImageUrl(product.seller.User.profile_image)"
                    class="w-full h-full object-cover"
                  />
                  <User :size="20" class="text-gray-400" />
                </div>
                <div>
                  <h4 class="font-bold text-gray-800 group-hover:text-blue-600 transition">
                    {{ product.seller.User?.first_name }} {{ product.seller.User?.last_name }}
                  </h4>
                  <p class="text-xs text-gray-500">{{ product.seller.profession }}</p>
                </div>
              </NuxtLink>
            </div>
            <div class="mt-12 border-t border-gray-100 pt-8">
              <h3 class="font-bold text-gray-800 text-xl mb-6 flex items-center gap-2">
                Opiniones de Clientes 
                <span class="text-sm font-normal text-gray-500">({{ reviews.length }})</span>
              </h3>

              <div v-if="reviews.length === 0" class="text-gray-500 italic">
                Nadie ha opinado sobre este producto aún.
              </div>

              <div v-else class="space-y-6">
                <div v-for="review in reviews" :key="review.id" class="bg-gray-50 p-4 rounded-xl">
                  
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                      <div class="font-bold text-gray-800 text-sm">
                        {{ review.Author?.first_name }} {{ review.Author?.last_name }}
                      </div>
                      <span class="text-xs text-gray-400">• {{ formatDate(review.createdAt) }}</span>
                    </div>
                    <StarRating :model-value="review.rating" :read-only="true" :size="14" />
                  </div>

                  <p class="text-gray-600 text-sm">{{ review.comment }}</p>
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
  import { Loader2, Package, MessageCircle, Store, User, ShoppingCart } from 'lucide-vue-next';
  import { useCartStore } from '@/stores/cart';
  import StarRating from '~/components/common/StarRating.vue';

  const route = useRoute();
  const config = useRuntimeConfig();
  const cartStore = useCartStore();
  const loading = ref(true);
  const product = ref(null);
  const selectedImage = ref(null);
  const quantity = ref(1);
  const reviews = ref([]);

  const productId = route.params.id;

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = config.public.apiBase.replace('/api', '');
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

  const translateCondition = (condition) => {
    const map = { new: 'Nuevo', used: 'Usado', refurbished: 'Restaurado' };
    return map[condition] || condition;
  };

  onMounted(async () => {
    try {
      const data = await $fetch(`${config.public.apiBase}/products/${productId}`);
      product.value = data;

      if (data.images && data.images.length > 0) {
        selectedImage.value = data.images[0].image_url;
      }

      const reviewsData = await $fetch(`${config.public.apiBase}/reviews/product/${productId}`);
      reviews.value = reviewsData;
    } catch (error) {
      console.error(error); 
    } finally {
      loading.value = false;
    }
  });
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-HN', { year: 'numeric', month: 'short', day: 'numeric' });
  };
</script>
