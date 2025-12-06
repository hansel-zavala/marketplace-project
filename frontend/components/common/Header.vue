<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <nav class="container mx-auto px-4 py-3 flex justify-between items-center">
      <NuxtLink to="/" class="flex items-center gap-2 text-2xl font-bold text-blue-600">
        <Store :size="28" />
        <span>MercaApp</span>
      </NuxtLink>

      <div class="flex items-center gap-6">
        <NuxtLink to="/products" class="text-gray-600 hover:text-blue-600 font-medium transition">
          Productos
        </NuxtLink>
        <NuxtLink to="/services" class="text-gray-600 hover:text-blue-600 font-medium transition">
          Servicios
        </NuxtLink>

        <div
          v-if="authStore.user"
          class="flex items-center gap-4 ml-2 border-l pl-6 border-gray-200"
        >
          <NuxtLink
            to="/profile"
            class="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer transition"
          >
            <div
              class="w-9 h-9 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center"
            >
              <img
                v-if="authStore.user.profile_image"
                :src="getAvatarUrl(authStore.user.profile_image)"
                alt="Perfil"
                class="w-full h-full object-cover"
              />
              <User v-else :size="18" class="text-gray-400" />
            </div>
            <span class="text-sm font-medium">{{ authStore.user.first_name }}</span>
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
          <NuxtLink to="/login" class="text-gray-600 hover:text-blue-600 font-medium transition">
            Ingresar
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm shadow-blue-200"
          >
            Registro
          </NuxtLink>
        </div>
        <NuxtLink to="/cart" class="relative text-gray-600 hover:text-blue-600 mr-4 transition">
            <ShoppingCart :size="24" />
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm"
            >
              {{ cartStore.totalItems }}
            </span>
          </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup>
  import { useAuthStore } from '~/stores/auth';
  import { useCartStore } from '~/stores/cart';
  import { Store, User, LogOut, ShoppingCart } from 'lucide-vue-next';

  const authStore = useAuthStore();
  const router = useRouter();
  const config = useRuntimeConfig();
  const cartStore = useCartStore();

  const getAvatarUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    const baseUrl = config.public.apiBase.replace('/api', '');
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

  const handleLogout = () => {
    authStore.logout();
    router.push('/login');
  };
</script>
