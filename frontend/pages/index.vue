<template>
  <div class="min-h-screen bg-gray-50">
    
    <div class="bg-gradient-to-br from-white to-blue-600 text-white py-24 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full opacity-60 pointer-events-none">
         <img src="../public/images/christmas-hero.png" alt="" class="w-full h-full object-cover"></img>
      </div>

      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-4xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          Todo lo que necesitas, <br class="hidden md:block" /> en un solo lugar.
        </h1>
        <p class="text-xl mb-12 text-white max-w-2xl mx-auto font-light">
          Desde profesionales expertos hasta los mejores productos locales. Todo al alcance de un clic.
        </p>
        
        <form @submit.prevent="handleSearch" class="max-w-2xl mx-auto relative group">
          <div class="flex items-center bg-white p-2 rounded-full shadow-2xl transition-transform transform group-hover:scale-[1.01]">
            <div class="pl-4 text-gray-400">
              <Search :size="24" />
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="flex-grow px-4 py-3 text-gray-700 bg-transparent outline-none placeholder-gray-400 text-lg"
              placeholder="¿Qué servicio o producto buscas?"
            >
            <button 
              type="submit" 
              class="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition duration-200 flex items-center gap-2 shadow-md"
            >
              Buscar
            </button>
          </div>
        </form>

        <div class="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-white">
          <span class="opacity-75">Tendencias:</span>
          <button @click="quickSearch('Electricista')" class="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition flex items-center gap-1">
            <Zap :size="14" /> Electricista
          </button>
          <button @click="quickSearch('Plomero')" class="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition flex items-center gap-1">
            <Wrench :size="14" /> Plomero
          </button>
          <button @click="quickSearch('Jardinería')" class="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full transition flex items-center gap-1">
            <Sprout :size="14" /> Jardinería
          </button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-16 space-y-20">

      <section v-if="!pendingProfessionals">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Expertos Recomendados</h2>
            <p class="text-gray-500 mt-2">Profesionales verificados listos para trabajar</p>
          </div>
          <NuxtLink to="/search?type=professional" class="text-blue-600 font-bold hover:underline flex items-center gap-1">
            Ver todos <ArrowRight :size="18" />
          </NuxtLink>
        </div>

        <div v-if="professionals?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProfessionalCard 
            v-for="prof in professionals.slice(0, 4)" 
            :key="prof.id" 
            :professional="prof" 
          />
        </div>
        <div v-else class="text-center py-10 bg-white rounded-xl shadow-sm">
          <p class="text-gray-500">No hay profesionales destacados en este momento.</p>
        </div>
      </section>

      <section v-if="!pendingBusinesses">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Tiendas Oficiales</h2>
            <p class="text-gray-500 mt-2">Negocios locales con los mejores productos</p>
          </div>
          <NuxtLink to="/search?type=business" class="text-blue-600 font-bold hover:underline flex items-center gap-1">
            Ver todas <ArrowRight :size="18" />
          </NuxtLink>
        </div>

        <div v-if="businesses?.length > 0" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <BusinessCard 
            v-for="business in businesses.slice(0, 5)" 
            :key="business.id" 
            :business="business" 
          />
        </div>
        <div v-else class="text-center py-10 bg-white rounded-xl shadow-sm">
           <p class="text-gray-500">No hay tiendas registradas aún.</p>
        </div>
      </section>

      <section v-if="!pendingProducts">
        <div class="flex justify-between items-end mb-8">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900">Descubrimientos del Día</h2>
            <p class="text-gray-500 mt-2">Artículos recientes a precios increíbles</p>
          </div>
          <NuxtLink to="/search?type=product" class="text-blue-600 font-bold hover:underline flex items-center gap-1">
            Explorar Mercado <ArrowRight :size="18" />
          </NuxtLink>
        </div>

        <div v-if="products?.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="product in products.slice(0, 8)" 
            :key="product.id" 
            :product="product" 
          />
        </div>
        <div v-else class="text-center py-10 bg-white rounded-xl shadow-sm">
           <p class="text-gray-500">Aún no hay productos publicados.</p>
        </div>
      </section>

    </div>

    <div v-if="!authStore.user" class="bg-gray-900 text-white py-16 mt-12">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">¿Quieres ofrecer tus servicios o productos?</h2>
        <p class="text-gray-400 mb-8 max-w-2xl mx-auto">Únete a nuestra comunidad de profesionales y vendedores. Es gratis crear tu cuenta y empezar a conectar con clientes.</p>
        <div class="flex justify-center gap-4">
          <NuxtLink to="/register" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold transition">
            Registrarme Gratis
          </NuxtLink>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { Search, ArrowRight, Zap, Wrench, Sprout } from 'lucide-vue-next';
import ProductCard from '~/components/products/ProductCard.vue';
import ProfessionalCard from '~/components/professional/ProfessionalCard.vue';
import BusinessCard from '~/components/business/BusinessCard.vue'; 
import { useAuthStore } from '~/stores/auth'; 

const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();
const searchQuery = ref('');

// Fetch Data
const { data: professionals, pending: pendingProfessionals } = useFetch(`${config.public.apiBase}/professionals`);
const { data: businesses, pending: pendingBusinesses } = useFetch(`${config.public.apiBase}/businesses`);
const { data: products, pending: pendingProducts } = useFetch(`${config.public.apiBase}/products`);

const handleSearch = () => {
  if (!searchQuery.value.trim()) return;
  
  router.push({ 
    path: '/search', 
    query: { q: searchQuery.value } 
  });
};

const quickSearch = (term) => {
  searchQuery.value = term;
  handleSearch();
};
</script>