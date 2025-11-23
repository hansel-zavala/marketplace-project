<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-blue-600 text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-4">
          Encuentra el profesional ideal
        </h1>
        <p class="text-xl mb-8 text-blue-100">
          O compra los productos que necesitas, todo en un solo lugar.
        </p>
        
        <div class="flex justify-center gap-4">
          <NuxtLink 
            to="/services" 
            class="bg-white text-blue-600 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition flex items-center gap-2"
          >
            <Search :size="20" />
            Buscar Servicios
          </NuxtLink>
          <NuxtLink 
            to="/products" 
            class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold hover:bg-white/10 transition flex items-center gap-2"
          >
            <ShoppingBag :size="20" />
            Ver Productos
          </NuxtLink>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Explora por categorías</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div class="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer text-center group">
          <div class="flex justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
            <Home :size="40" stroke-width="1.5" />
          </div>
          <h3 class="font-medium text-gray-700">Hogar</h3>
        </div>

        <div class="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer text-center group">
          <div class="flex justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
            <Monitor :size="40" stroke-width="1.5" />
          </div>
          <h3 class="font-medium text-gray-700">Tecnología</h3>
        </div>

        <div class="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer text-center group">
          <div class="flex justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
            <BookOpen :size="40" stroke-width="1.5" />
          </div>
          <h3 class="font-medium text-gray-700">Clases</h3>
        </div>

        <div class="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer text-center group">
          <div class="flex justify-center text-blue-600 mb-3 group-hover:scale-110 transition-transform">
            <Car :size="40" stroke-width="1.5" />
          </div>
          <h3 class="font-medium text-gray-700">Mecánica</h3>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { Search, ShoppingBag, Home, Monitor, BookOpen, Car } from 'lucide-vue-next';
</script>