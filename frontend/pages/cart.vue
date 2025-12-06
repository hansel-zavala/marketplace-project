<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-5xl">
      
      <h1 class="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
        <ShoppingBag :size="32" class="text-blue-600" />
        Mi Carrito
      </h1>

      <div v-if="cartStore.totalItems === 0" class="bg-white rounded-xl shadow-sm p-12 text-center border border-dashed border-gray-300">
        <div class="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart :size="48" class="text-gray-300" />
        </div>
        <h3 class="text-xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h3>
        <p class="text-gray-500 mb-8">Parece que aún no has agregado productos.</p>
        <NuxtLink to="/" class="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition inline-flex items-center gap-2">
          <ArrowLeft :size="20" /> Ir a comprar
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-4">
          <div 
            v-for="item in cartStore.items" 
            :key="item.id"
            class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex gap-4 items-center"
          >
            <div class="w-24 h-24 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-100">
              <img 
                v-if="item.image" 
                :src="getImageUrl(item.image)" 
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <ImageIcon :size="24" />
              </div>
            </div>

            <div class="flex-grow">
              <h3 class="font-bold text-gray-800 line-clamp-1 text-lg">
                <NuxtLink :to="`/products/${item.id}`" class="hover:text-blue-600 transition">
                  {{ item.title }}
                </NuxtLink>
              </h3>
              <p class="text-blue-600 font-bold">L. {{ item.price }}</p>
            </div>

            <div class="flex flex-col items-end gap-3">
              <div class="flex items-center border rounded-lg overflow-hidden h-9">
                <button 
                  @click="cartStore.updateQuantity(item.id, item.quantity - 1)" 
                  class="w-8 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                  :disabled="item.quantity <= 1"
                >
                  <Minus :size="14" />
                </button>
                <span class="w-10 text-center font-medium text-sm">{{ item.quantity }}</span>
                <button 
                  @click="cartStore.updateQuantity(item.id, item.quantity + 1)" 
                  class="w-8 h-full flex items-center justify-center bg-gray-50 hover:bg-gray-100 text-gray-600 transition"
                  :disabled="item.quantity >= item.stock"
                >
                  <Plus :size="14" />
                </button>
              </div>

              <button 
                @click="cartStore.removeItem(item.id)"
                class="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
              >
                <Trash2 :size="14" /> Eliminar
              </button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
            <h3 class="font-bold text-gray-800 mb-6 text-lg">Resumen del Pedido</h3>
            
            <div class="space-y-3 mb-6 text-sm">
              <div class="flex justify-between text-gray-600">
                <span>Subtotal ({{ cartStore.totalItems }} items)</span>
                <span>L. {{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Envío</span>
                <span class="text-green-600 font-medium">Gratis</span> </div>
              <div class="border-t pt-3 mt-3 flex justify-between items-end">
                <span class="font-bold text-gray-800 text-lg">Total</span>
                <span class="font-bold text-blue-600 text-2xl">L. {{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
            </div>

            <NuxtLink 
              to="/checkout" 
              class="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Procesar Pago <ArrowRight :size="20" />
            </NuxtLink>
            
            <p class="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
              <ShieldCheck :size="14" /> Compra 100% Segura
            </p>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';
import { 
  ShoppingBag, ShoppingCart, ArrowLeft, ArrowRight, 
  Minus, Plus, Trash2, Image as ImageIcon, ShieldCheck 
} from 'lucide-vue-next';

const cartStore = useCartStore();
const config = useRuntimeConfig();

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};
</script>