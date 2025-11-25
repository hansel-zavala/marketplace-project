<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Mi Perfil</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="bg-white p-6 rounded-lg shadow-md col-span-2 relative">
          
          <button 
            v-if="!isEditing"
            @click="startEditing"
            class="absolute top-6 right-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
          >
            <Edit2 :size="18" /> Editar
          </button>

          <div v-if="!isEditing">
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
                <label class="block text-sm text-gray-500">Teléfono</label>
                <p class="text-gray-800 font-medium">{{ authStore.user?.phone || 'No registrado' }}</p>
              </div>
              <div>
                <label class="block text-sm text-gray-500">Correo</label>
                <p class="text-gray-800">{{ authStore.user?.email }}</p>
              </div>
            </div>
          </div>

          <form v-else @submit.prevent="saveChanges">
            <h3 class="font-bold text-lg mb-4 text-gray-700">Editar Información</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-bold mb-1">Nombre</label>
                <input v-model="form.first_name" type="text" class="w-full border rounded p-2">
              </div>
              <div>
                <label class="block text-sm font-bold mb-1">Apellido</label>
                <input v-model="form.last_name" type="text" class="w-full border rounded p-2">
              </div>
            </div>

            <div class="mb-6">
              <label class="block text-sm font-bold mb-1">Teléfono</label>
              <input v-model="form.phone" type="text" class="w-full border rounded p-2">
            </div>

            <div class="flex gap-3">
              <button 
                type="submit" 
                class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium"
                :disabled="loading"
              >
                {{ loading ? 'Guardando...' : 'Guardar Cambios' }}
              </button>
              <button 
                type="button" 
                @click="cancelEditing"
                class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-medium"
              >
                Cancelar
              </button>
            </div>
          </form>

        </div>

        <div class="bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 class="font-bold text-gray-800 mb-4">Acciones</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink 
                to="/addresses" 
                class="block w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-600"
              >
                Mis Direcciones
              </NuxtLink>
            </li>
            <li class="border-t pt-2 mt-2">
              <button @click="handleLogout" class="w-full text-left px-4 py-2 rounded hover:bg-red-50 text-red-500 flex items-center gap-2">
                <LogOut :size="18" /> Cerrar Sesión
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
import { User, Edit2, LogOut } from 'lucide-vue-next';

definePageMeta({ middleware: ['auth'] });

const authStore = useAuthStore();
const router = useRouter();
const config = useRuntimeConfig();

const isEditing = ref(false);
const loading = ref(false);

const form = reactive({
  first_name: '',
  last_name: '',
  phone: ''
});

const startEditing = () => {
  form.first_name = authStore.user.first_name;
  form.last_name = authStore.user.last_name;
  form.phone = authStore.user.phone || '';
  isEditing.value = true;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const saveChanges = async () => {
  loading.value = true;
  try {
    const response = await $fetch(`${config.public.apiBase}/users/profile`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: form
    });

    authStore.user = response.user;
    
    alert('Perfil actualizado correctamente');
    isEditing.value = false;

  } catch (error) {
    console.error(error);
    alert('Error al actualizar: ' + (error.data?.message || error.message));
  } finally {
    loading.value = false;
  }
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>