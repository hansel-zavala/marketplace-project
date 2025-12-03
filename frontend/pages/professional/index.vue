<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      <div v-if="fetching" class="flex flex-col items-center justify-center py-20 text-gray-500">
        <Loader2 class="animate-spin mb-2" :size="40" />
        <p>Cargando perfil...</p>
      </div>

      <div v-else-if="!profile" class="max-w-3xl mx-auto">
        <div class="text-center mb-10">
          <div
            class="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Briefcase :size="40" class="text-blue-600" />
          </div>
          <h1 class="text-3xl font-bold text-gray-800">Conviértete en Profesional</h1>
          <p class="text-gray-600 mt-2 text-lg">
            Comienza a ofrecer tus servicios y llega a miles de clientes.
          </p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <ProfessionalForm
            :loading="saving"
            btn-label="Crear mi Perfil Profesional"
            @submit="saveProfile"
          />
        </div>
      </div>

      <div v-else class="max-w-5xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Panel Profesional</h1>
            <p class="text-gray-500">Gestiona tu perfil y visualización</p>
          </div>
          <div class="flex gap-2">
            <NuxtLink
              to="/profile"
              class="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium flex items-center gap-2"
            >
              <User :size="18" /> Volver a Usuario
            </NuxtLink>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="space-y-6">
            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 class="font-bold text-gray-700 mb-4">Estado de Verificación</h3>

              <div
                v-if="profile.verification_status === 'verified'"
                class="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg"
              >
                <BadgeCheck :size="24" />
                <span class="font-medium">Perfil Verificado</span>
              </div>

              <div
                v-else-if="profile.verification_status === 'pending'"
                class="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg"
              >
                <Clock :size="24" />
                <span class="font-medium">En Revisión</span>
              </div>

              <div v-else>
                <div class="flex items-center gap-2 text-gray-500 bg-gray-50 p-3 rounded-lg mb-4">
                  <ShieldAlert :size="24" />
                  <span class="font-medium">No Verificado</span>
                </div>
                <p class="text-sm text-gray-600 mb-4">
                  Verifica tu identidad para obtener el check azul y aparecer primero en las
                  búsquedas.
                </p>
                <NuxtLink
                  to="/professional/verification"
                  class="block w-full text-center bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition font-medium"
                >
                  Solicitar Verificación
                </NuxtLink>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 class="font-bold text-gray-700 mb-4">Estadísticas</h3>
              <div class="flex justify-between items-center border-b pb-2 mb-2">
                <span class="text-gray-600">Trabajos</span>
                <span class="font-bold">{{ profile.total_jobs || 0 }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Calificación</span>
                <span class="font-bold flex items-center gap-1">
                  {{ profile.rating || '0.0' }}
                  <Star :size="14" class="text-yellow-400 fill-current" />
                </span>
              </div>
            </div>

            <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mt-6">
              <h3 class="font-bold text-gray-700 mb-4">Herramientas</h3>
              <NuxtLink
                to="/professional/portfolio"
                class="flex items-center justify-between p-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
              >
                <div class="flex items-center gap-3">
                  <div class="bg-white p-2 rounded text-blue-600 shadow-sm">
                    <Images :size="20" />
                  </div>
                  <span class="font-medium">Mi Portafolio</span>
                </div>
                <ChevronRight :size="18" />
              </NuxtLink>
            </div>
          </div>

          <div class="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-bold text-gray-800">Editar Información Pública</h2>
            </div>

            <ProfessionalForm
              :initial-data="profile"
              :loading="saving"
              btn-label="Actualizar Información"
              @submit="saveProfile"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import ProfessionalForm from '~/components/professional/ProfessionalForm.vue';
  import { useAuthStore } from '~/stores/auth';
  import { Briefcase, BadgeCheck, ShieldAlert, Clock, Star, Loader2, User } from 'lucide-vue-next';

  definePageMeta({ middleware: ['auth'] });

  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const router = useRouter();

  const fetching = ref(true);
  const saving = ref(false);
  const profile = ref(null);

  onMounted(async () => {
    try {
      const data = await $fetch(`${config.public.apiBase}/professionals/me`, {
        headers: { Authorization: `Bearer ${authStore.token}` },
      });
      profile.value = data;
    } catch (error) {
      if (error.statusCode !== 404) {
        console.error(error);
      }
    } finally {
      fetching.value = false;
    }
  });

  const saveProfile = async (formData) => {
    saving.value = true;
    try {
      const response = await $fetch(`${config.public.apiBase}/professionals`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authStore.token}` },
        body: formData,
      });

      profile.value = response.profile;
      alert('Perfil profesional guardado correctamente');

      if (authStore.user.user_type === 'customer') {
        authStore.fetchUser();
      }
    } catch (error) {
      console.error(error);
      alert('Error: ' + (error.data?.message || error.message));
    } finally {
      saving.value = false;
    }
  };
</script>
