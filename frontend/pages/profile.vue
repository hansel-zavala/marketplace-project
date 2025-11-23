<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Mi Perfil</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white p-6 rounded-lg shadow-md col-span-2">
          <div class="flex items-center gap-4 mb-6">
            <div class="bg-blue-100 p-4 rounded-full">
              <User :size="40" class="text-blue-600" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-800">
                {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
              </h2>
              <p class="text-gray-500 capitalize">{{ authStore.user?.user_type }}</p>
            </div>
          </div>

          <div class="border-t pt-4 space-y-3">
            <div>
              <label class="block text-sm text-gray-500">Correo Electrónico</label>
              <p class="text-gray-800 font-medium">{{ authStore.user?.email }}</p>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Teléfono</label>
              <p class="text-gray-800 font-medium">{{ authStore.user?.phone || 'No registrado' }}</p>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Miembro desde</label>
              <p class="text-gray-800">{{ formatDate(authStore.user?.created_at) }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 class="font-bold text-gray-800 mb-4">Acciones</h3>
          <ul class="space-y-2">
            <li>
              <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-blue-600 font-medium">
                Editar Perfil
              </button>
            </li>
            <li>
              <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-600">
                Mis Direcciones
              </button>
            </li>
            <li>
              <button class="w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-600">
                Cambiar Contraseña
              </button>
            </li>
            <li class="border-t pt-2 mt-2">
              <button @click="handleLogout" class="w-full text-left px-4 py-2 rounded hover:bg-red-50 text-red-500">
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { User } from 'lucide-vue-next';

definePageMeta({
  middleware: ['auth'] 
});

const authStore = useAuthStore();
const router = useRouter();

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-HN', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>