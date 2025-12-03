<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4">
      
      <div class="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <div class="flex items-center gap-4">
          <NuxtLink to="/professional" class="text-gray-500 hover:text-gray-800">
            <ArrowLeft :size="24" />
          </NuxtLink>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Mi Portafolio</h1>
            <p class="text-gray-500">Muestra tus mejores trabajos al mundo</p>
          </div>
        </div>
        <NuxtLink 
          to="/professional/portfolio/add" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm"
        >
          <Plus :size="20" /> Agregar Proyecto
        </NuxtLink>
      </div>

      <div class="max-w-5xl mx-auto">
        
        <div v-if="loading" class="text-center py-20 text-gray-500">
          <Loader2 class="animate-spin mx-auto mb-2" :size="32" />
          <p>Cargando proyectos...</p>
        </div>

        <div v-else-if="projects.length === 0" class="bg-white rounded-xl shadow-sm p-12 text-center border border-dashed border-gray-300">
          <div class="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase :size="40" class="text-gray-300" />
          </div>
          <h3 class="text-lg font-bold text-gray-700">Tu portafolio está vacío</h3>
          <p class="text-gray-500 mb-6">Sube fotos de tus trabajos anteriores para ganar la confianza de los clientes.</p>
          <NuxtLink to="/professional/portfolio/add" class="text-blue-600 font-medium hover:underline">
            Subir mi primer proyecto
          </NuxtLink>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProjectCard 
            v-for="proj in projects" 
            :key="proj._id" 
            :project="proj" 
            @delete="deleteProject"
          />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ArrowLeft, Plus, Loader2, Briefcase } from 'lucide-vue-next';
import ProjectCard from '~/components/portfolio/ProjectCard.vue';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const authStore = useAuthStore();
const projects = ref([]);
const loading = ref(true);

const fetchProjects = async () => {
  try {
    const proProfile = await $fetch(`${config.public.apiBase}/professionals/me`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    });

    if (proProfile && proProfile.id) {
      const data = await $fetch(`${config.public.apiBase}/portfolio/${proProfile.id}`);
      projects.value = data;
    }
  } catch (error) {
    console.error('Error cargando portafolio:', error);
  } finally {
    loading.value = false;
  }
};

const deleteProject = async (id) => {
  if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

  try {
    await $fetch(`${config.public.apiBase}/portfolio/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    projects.value = projects.value.filter(p => p._id !== id);
    alert('Proyecto eliminado');
  } catch (error) {
    alert('Error al eliminar');
  }
};

onMounted(() => {
  fetchProjects();
});
</script>