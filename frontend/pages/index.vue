<template>
  <div class="min-h-screen bg-gray-50">
    
    <div class="bg-blue-600 text-white py-24 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-full bg-blue-600 opacity-50 pattern-grid-lg"></div>

      <div class="container mx-auto px-4 text-center relative z-10">
        <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Encuentra el profesional <br class="hidden md:block" /> ideal para tu proyecto
        </h1>
        <p class="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
          Plomeros, Electricistas, Abogados y más. Expertos verificados listos para ayudarte.
        </p>
        
        <form @submit.prevent="handleSearch" class="max-w-2xl mx-auto relative">
          <div class="flex items-center bg-white rounded-full p-2 shadow-lg">
            <div class="pl-4 text-gray-400">
              <Search :size="24" />
            </div>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="flex-grow px-4 py-3 text-gray-700 bg-transparent outline-none placeholder-gray-400 text-lg"
              placeholder="¿Qué servicio buscas? Ej: Electricista"
            >
            <button 
              type="submit" 
              class="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition duration-200 flex items-center gap-2"
            >
              Buscar
            </button>
          </div>
        </form>

        <div class="mt-6 flex flex-wrap justify-center gap-3 text-sm text-blue-200">
          <span>Tendencias:</span>
          <button @click="quickSearch('Electricista')" class="hover:text-white underline decoration-dotted">Electricista</button>
          <button @click="quickSearch('Plomero')" class="hover:text-white underline decoration-dotted">Plomero</button>
          <button @click="quickSearch('Jardinería')" class="hover:text-white underline decoration-dotted">Jardinería</button>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
       </div>

  </div>
</template>

<script setup>
import { Search, ShoppingBag, Home, Monitor, BookOpen, Car } from 'lucide-vue-next';

const router = useRouter();
const searchQuery = ref('');

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