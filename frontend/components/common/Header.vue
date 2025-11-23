<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
      <NuxtLink
        to="/"
        class="flex items-center gap-2 text-2xl font-bold text-blue-600"
      >
        <Store :size="28" />
        <span>Marketplace</span>
      </NuxtLink>

      <div class="flex items-center gap-6">
        <NuxtLink
          to="/products"
          class="text-gray-600 hover:text-blue-600 font-medium transition"
          >Productos</NuxtLink
        >
        <NuxtLink
          to="/services"
          class="text-gray-600 hover:text-blue-600 font-medium transition"
          >Servicios</NuxtLink
        >

        <div
          v-if="authStore.user"
          class="flex items-center gap-4 ml-2 border-l pl-6 border-gray-200"
        >
          <NuxtLink
            to="/profile"
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer transition"
          >
            <div class="bg-blue-100 p-2 rounded-full">
              <User :size="20" class="text-blue-600" />
            </div>
            <span class="text-sm font-medium">{{
              authStore.user.first_name
            }}</span>
          </NuxtLink>

          <button
            @click="handleLogout"
            class="text-gray-400 hover:text-red-500 transition p-1"
            title="Cerrar Sesión"
          >
            <LogOut :size="20" />
          </button>
        </div>

        <div v-else class="flex items-center gap-3 ml-4">
          <NuxtLink
            to="/login"
            class="text-gray-600 hover:text-blue-600 font-medium transition"
          >
            Ingresar
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm shadow-blue-200"
          >
            Registro
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from "~/stores/auth";
import { Store, User, LogOut } from "lucide-vue-next";

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push("/login");
};
</script>
