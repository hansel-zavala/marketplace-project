<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <h1 class="text-3xl font-bold text-gray-800 mb-8">Mi Perfil</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="md:col-span-2 space-y-6">
          <div class="bg-white p-6 rounded-lg shadow-md relative">
            <button
              v-if="!isEditing"
              @click="startEditing"
              class="absolute top-6 right-6 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
            >
              <Edit2 :size="18" /> Editar
            </button>

            <div class="flex flex-col sm:flex-row items-center gap-6 mb-8">
              <div class="relative group w-24 h-24 shrink-0">
                <div
                  class="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md flex items-center justify-center"
                >
                  <img
                    v-if="authStore.user?.profile_image"
                    :src="getAvatarUrl(authStore.user.profile_image)"
                    class="w-full h-full object-cover"
                  />
                  <User v-else :size="48" class="text-gray-400" />
                </div>
                <button
                  @click="triggerFileInput"
                  class="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-sm border-2 border-white disabled:opacity-50"
                  :disabled="uploading"
                >
                  <Loader2 v-if="uploading" :size="16" class="animate-spin" />
                  <Camera v-else :size="16" />
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleFileUpload"
                />
              </div>

              <div class="text-center sm:text-left">
                <h2 class="text-2xl font-bold text-gray-800">
                  {{ authStore.user?.first_name }} {{ authStore.user?.last_name }}
                </h2>
                <p class="text-gray-500 capitalize font-medium">{{ authStore.user?.user_type }}</p>
                <p class="text-sm text-gray-400 mt-1">
                  Miembro desde {{ formatDate(authStore.user?.created_at) }}
                </p>
              </div>
            </div>

            <div v-if="!isEditing" class="border-t pt-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs uppercase tracking-wide text-gray-500 font-bold mb-1"
                    >Correo</label
                  >
                  <p class="text-gray-800 font-medium">{{ authStore.user?.email }}</p>
                </div>
                <div>
                  <label class="block text-xs uppercase tracking-wide text-gray-500 font-bold mb-1"
                    >Teléfono</label
                  >
                  <p class="text-gray-800 font-medium">
                    {{ authStore.user?.phone || 'No registrado' }}
                  </p>
                </div>
              </div>
            </div>

            <form v-else @submit.prevent="saveChanges" class="border-t pt-6">
              <h3 class="font-bold text-lg mb-4 text-gray-700">Editar Información</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label class="block text-sm font-bold mb-1">Nombre</label>
                  <input
                    v-model="form.first_name"
                    type="text"
                    class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label class="block text-sm font-bold mb-1">Apellido</label>
                  <input
                    v-model="form.last_name"
                    type="text"
                    class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div class="mb-6">
                <label class="block text-sm font-bold mb-1">Teléfono</label>
                <input
                  v-model="form.phone"
                  type="text"
                  class="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
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

          <div
            v-if="professionalProfile"
            class="bg-white rounded-lg shadow-md overflow-hidden border border-blue-100"
          >
            <div
              class="bg-blue-50 px-6 py-3 border-b border-blue-100 flex justify-between items-center"
            >
              <h3 class="font-bold text-blue-800 flex items-center gap-2">
                <Briefcase :size="20" /> Perfil Profesional
              </h3>
              <span
                v-if="professionalProfile.verification_status === 'verified'"
                class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1"
              >
                <BadgeCheck :size="14" /> Verificado
              </span>
              <span
                v-else
                class="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full font-bold"
              >
                {{
                  professionalProfile.verification_status === 'pending'
                    ? 'En Revisión'
                    : 'No Verificado'
                }}
              </span>
            </div>

            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h4 class="text-xl font-bold text-gray-800">
                    {{ professionalProfile.profession }}
                  </h4>
                  <p v-if="professionalProfile.business_name" class="text-gray-500 text-sm">
                    {{ professionalProfile.business_name }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="text-xs text-gray-500 uppercase font-bold">Tarifa</p>
                  <p class="text-lg font-bold text-gray-800">
                    L. {{ professionalProfile.hourly_rate }}
                    <span class="text-sm font-normal text-gray-500">/hr</span>
                  </p>
                </div>
              </div>

              <div class="mb-4">
                <p class="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {{ professionalProfile.bio || 'Sin biografía.' }}
                </p>
              </div>

              <div class="flex items-center gap-6 text-sm text-gray-500 border-t pt-4">
                <div class="flex items-center gap-1">
                  <Star :size="16" class="text-yellow-400 fill-current" />
                  <span class="font-bold text-gray-700">{{
                    professionalProfile.rating || '0.0'
                  }}</span>
                </div>
                <div class="flex items-center gap-1">
                  <Briefcase :size="16" />
                  <span>{{ professionalProfile.total_jobs || 0 }} trabajos</span>
                </div>
                <div class="flex items-center gap-1">
                  <MapPin :size="16" />
                  <span>{{ professionalProfile.service_radius }} km radio</span>
                </div>
              </div>

              <div class="mt-6">
                <NuxtLink
                  to="/professional"
                  class="block w-full text-center border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 font-medium transition"
                >
                  Gestionar Perfil Profesional
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 class="font-bold text-gray-800 mb-4">Acciones</h3>
          <ul class="space-y-2">
            <li>
              <NuxtLink
                to="/professional"
                class="block w-full text-left px-4 py-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition flex items-center gap-2"
              >
                <Briefcase :size="18" />
                {{
                  professionalProfile
                    ? 'Panel Profesional'
                    : 'Conviértete en Profesional'
                }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/business"
                class="block w-full text-left px-4 py-2 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium transition flex items-center gap-2"
              >
                <Store :size="18" />
                {{
                  businessProfile
                    ? 'Panel de Negocio'
                    : 'Registrar mi Negocio'
                }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/addresses"
                class="block w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-600 transition flex items-center gap-2"
              >
                <Map :size="18" /> Mis Direcciones
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/change-password"
                class="block w-full text-left px-4 py-2 rounded hover:bg-gray-50 text-gray-600 transition flex items-center gap-2"
              >
                <Key :size="18" /> Cambiar Contraseña
              </NuxtLink>
            </li>
            <li class="border-t pt-2 mt-2">
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 rounded hover:bg-red-50 text-red-500 flex items-center gap-2"
              >
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
  import {
    User,
    Edit2,
    LogOut,
    Camera,
    Loader2,
    Briefcase,
    Map,
    Key,
    BadgeCheck,
    Star,
    MapPin,
    Store,
  } from 'lucide-vue-next';

  definePageMeta({ middleware: ['auth'] });

  const authStore = useAuthStore();
  const router = useRouter();
  const config = useRuntimeConfig();

  const isEditing = ref(false);
  const loading = ref(false);
  const uploading = ref(false);
  const fileInput = ref(null);

  const professionalProfile = ref(null);
  const businessProfile = ref(null);

  const form = reactive({
    first_name: '',
    last_name: '',
    phone: '',
  });

  onMounted(async () => {
    try {
      const data = await $fetch(`${config.public.apiBase}/professionals/me`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      professionalProfile.value = data;
    } catch (error) {
      if (error.statusCode !== 404) console.error('Error cargando perfil profesional:', error);
    }

    try {
      const data = await $fetch(`${config.public.apiBase}/businesses/me`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      businessProfile.value = data;
    } catch (error) {
      if (error.statusCode !== 404) console.error('Error cargando perfil de negocio:', error);
    }
  });

  const triggerFileInput = () => fileInput.value.click();

  const getAvatarUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const baseUrl = config.public.apiBase.replace('/api', '');
    return `${baseUrl}/${path.replace(/\\/g, '/')}`;
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no puede pesar más de 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    uploading.value = true;
    try {
      const response = await $fetch(`${config.public.apiBase}/users/avatar`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: formData,
      });
      authStore.user.profile_image = response.imageUrl;
    } catch (error) {
      console.error(error);
      alert('Error al subir imagen');
    } finally {
      uploading.value = false;
      if (fileInput.value) fileInput.value.value = '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('es-HN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const startEditing = () => {
    form.first_name = authStore.user.first_name;
    form.last_name = authStore.user.last_name;
    form.phone = authStore.user.phone || '';
    isEditing.value = true;
  };

  const cancelEditing = () => (isEditing.value = false);

  const saveChanges = async () => {
    loading.value = true;
    try {
      const response = await $fetch(`${config.public.apiBase}/users/profile`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: form,
      });
      authStore.user = response.user;
      isEditing.value = false;
    } catch (error) {
      console.error(error);
      alert('Error al actualizar');
    } finally {
      loading.value = false;
    }
  };

  const handleLogout = () => {
    authStore.logout();
    router.push('/login');
  };
</script>
