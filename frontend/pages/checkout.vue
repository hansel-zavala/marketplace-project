<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <div class="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <NuxtLink to="/cart" class="hover:text-blue-600">Carrito</NuxtLink>
        <span>/</span>
        <span class="text-gray-800 font-medium">Finalizar Compra</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-6">
          
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin :size="24" class="text-blue-600" /> Dirección de Envío
            </h2>

            <div v-if="loadingAddresses" class="py-4 text-center text-gray-500">
              Cargando direcciones...
            </div>

            <div v-else-if="addresses.length === 0" class="text-center py-6">
               <p class="text-gray-500 mb-3">No tienes direcciones guardadas.</p>
               <NuxtLink to="/addresses/add" class="text-blue-600 font-medium hover:underline">
                 + Agregar nueva dirección
               </NuxtLink>
            </div>

            <div v-else class="space-y-3">
              <label 
                v-for="addr in addresses" 
                :key="addr.id"
                class="block border rounded-lg p-4 cursor-pointer transition hover:border-blue-400"
                :class="selectedAddress === addr.id ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200'"
              >
                <div class="flex items-start gap-3">
                  <input 
                    type="radio" 
                    :value="addr.id" 
                    v-model="selectedAddress"
                    class="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span class="font-bold text-gray-800 block">
                      {{ addr.street_address }} <span v-if="addr.is_default" class="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full ml-2">Default</span>
                    </span>
                    <span class="text-sm text-gray-600 block">{{ addr.city }}, {{ addr.state }}</span>
                    <span class="text-xs text-gray-500 block">CP: {{ addr.postal_code }}</span>
                  </div>
                </div>
              </label>

              <div class="mt-4 pt-4 border-t">
                 <NuxtLink to="/addresses/add" class="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                   <Plus :size="16" /> Agregar otra dirección
                 </NuxtLink>
              </div>
            </div>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard :size="24" class="text-blue-600" /> Método de Pago
            </h2>
            
            <div class="space-y-3">
              <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 border-gray-200">
                <input type="radio" name="payment" value="card" v-model="paymentMethod" class="w-4 h-4 text-blue-600" />
                <CreditCard :size="20" class="text-gray-600" />
                <span class="font-medium text-gray-700">Tarjeta de Crédito / Débito</span>
              </label>
              
              <label class="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 border-gray-200">
                <input type="radio" name="payment" value="cod" v-model="paymentMethod" class="w-4 h-4 text-blue-600" />
                <Banknote :size="20" class="text-green-600" />
                <span class="font-medium text-gray-700">Pago Contra Entrega</span>
              </label>
            </div>
          </div>

        </div>

        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-xl shadow-md border border-gray-100 sticky top-24">
            <h3 class="font-bold text-gray-800 mb-6 text-lg">Resumen del Pedido</h3>
            
            <div class="space-y-4 mb-6">
              <div v-for="item in cartStore.items" :key="item.id" class="flex gap-3 text-sm">
                <div class="w-12 h-12 bg-gray-100 rounded overflow-hidden shrink-0 border">
                  <img v-if="item.image" :src="getImageUrl(item.image)" class="w-full h-full object-cover" />
                </div>
                <div class="flex-grow">
                  <p class="text-gray-800 font-medium line-clamp-1">{{ item.title }}</p>
                  <p class="text-gray-500">Cant: {{ item.quantity }}</p>
                </div>
                <p class="font-medium text-gray-800">L. {{ (item.price * item.quantity).toFixed(2) }}</p>
              </div>
            </div>

            <div class="border-t pt-4 space-y-2 text-sm text-gray-600">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>L. {{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Envío</span>
                <span class="text-green-600 font-medium">Gratis</span>
              </div>
              <div class="flex justify-between pt-2 border-t mt-2 items-end">
                <span class="font-bold text-gray-800 text-base">Total a Pagar</span>
                <span class="font-bold text-blue-600 text-2xl">L. {{ cartStore.totalPrice.toFixed(2) }}</span>
              </div>
            </div>

            <button 
              @click="processOrder"
              :disabled="placingOrder || !selectedAddress"
              class="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              <Loader2 v-if="placingOrder" class="animate-spin" :size="20" />
              <span v-else>Confirmar Pedido</span>
            </button>
            
            <p v-if="!selectedAddress" class="text-center text-xs text-red-500 mt-2 font-medium">
              * Selecciona una dirección para continuar
            </p>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '~/stores/cart';
import { useAuthStore } from '~/stores/auth';
import { MapPin, CreditCard, Banknote, Plus, Loader2 } from 'lucide-vue-next';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const addresses = ref([]);
const loadingAddresses = ref(true);
const selectedAddress = ref(null);
const paymentMethod = ref('card');
const placingOrder = ref(false);

const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

onMounted(async () => {
    if (cartStore.totalItems === 0) {
        router.push('/cart');
        return;
    }

    try {
        const data = await $fetch(`${config.public.apiBase}/addresses`, {
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        addresses.value = data;

        const defaultAddr = data.find(a => a.is_default);
        if (defaultAddr) {
            selectedAddress.value = defaultAddr.id;
        } else if (data.length > 0) {
            selectedAddress.value = data[0].id;
        }
    } catch (error) {
        console.error('Error cargando direcciones:', error);
    } finally {
        loadingAddresses.value = false;
    }
});

const processOrder = async () => {
    if (!selectedAddress.value) {
        alert("Por favor selecciona una dirección de envío.");
        return;
    }

    placingOrder.value = true;
    
    try {
        const orderData = {
          shipping_address_id: selectedAddress.value,
          payment_method: paymentMethod.value === 'cod' ? 'cash_on_delivery' : 'card',
          items: cartStore.items.map(item => ({
            product_id: item.id,
            quantity: item.quantity
          }))
        };

        const response = await $fetch(`${config.public.apiBase}/orders`, {
            method: 'POST',
            body: orderData,
            headers: { Authorization: `Bearer ${authStore.token}` }
        });
        
        alert(`¡Pedido Confirmado! ID: ${response.order?.id}`);
        
        cartStore.clearCart();
        router.push('/');
        
    } catch (error) {
        console.error(error);
        alert('Error al procesar el pedido: ' + (error.data?.message || 'Error desconocido'));
    } finally {
        placingOrder.value = false;
    }
};
</script>
