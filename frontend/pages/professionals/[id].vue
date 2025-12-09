<template>
  <div class="min-h-screen bg-gray-100 py-12">
    
    <div v-if="loading" class="flex justify-center py-20 text-gray-500">
      <Loader2 class="animate-spin" :size="40" />
    </div>

    <div v-else-if="!professional" class="text-center py-20">
      <h2 class="text-2xl font-bold text-gray-800">Profesional no encontrado</h2>
      <NuxtLink to="/" class="text-blue-600 hover:underline mt-4 inline-block">Volver al inicio</NuxtLink>
    </div>

    <div v-else class="container mx-auto px-4 max-w-5xl">
      
      <div class="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
        <div class="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
        
        <div class="px-8 pb-8">
          <div class="relative flex justify-between items-end -mt-12 mb-6">
            <div class="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
              <img 
                v-if="professional.User?.profile_image" 
                :src="getAvatarUrl(professional.User.profile_image)" 
                class="w-full h-full object-cover"
              />
              <UserIcon v-else :size="64" class="text-gray-400" />
            </div>
            
            <button 
              @click="openRequestModal"
              class="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition transform hover:-translate-y-1 flex items-center gap-2"
            >
              <Briefcase :size="20" />
              Contratar / Solicitar
            </button>
          </div>

          <div class="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
                {{ professional.User?.first_name }} {{ professional.User?.last_name }}
                <span v-if="professional.verification_status === 'verified'" class="text-blue-500" title="Verificado">
                  <BadgeCheck :size="24" fill="currentColor" class="text-blue-100" />
                </span>
              </h1>
              <p class="text-xl text-blue-600 font-medium mt-1">{{ professional.profession }}</p>
            </div>

            <div class="flex gap-8 text-center bg-gray-50 p-4 rounded-lg">
              <div class="text-right">
                  <p v-if="professional.billing_type === 'hourly'" class="text-xs text-gray-500 uppercase font-bold">Tarifa por hora</p>
                  <p v-else-if="professional.billing_type === 'daily'" class="text-xs text-gray-500 uppercase font-bold">Tarifa por dia</p>
                  <p v-else-if="professional.billing_type === 'job'" class="text-xs text-gray-500 uppercase font-bold">Tarifa por trabajo</p>
                  <p v-else class="text-xs text-gray-500 uppercase font-bold">Tarifa por {{ professional.billing_type }}</p>
                  <p class="text-lg font-bold text-gray-800">
                    L. {{ professional.fee }}
                    <span v-if="professional.billing_type === 'hourly'" class="text-sm font-normal text-gray-500">/hr</span>
                    <span v-if="professional.billing_type === 'daily'" class="text-sm font-normal text-gray-500">/dia</span>
                    <span v-if="professional.billing_type === 'job'" class="text-sm font-normal text-gray-500">/trabajo</span>
                  </p>
                </div>
              <div class="border-l border-gray-200 pl-8">
                <p class="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Calificación</p>
                <div class="flex items-center justify-center gap-1">
                  <span class="text-2xl font-bold text-gray-800">{{ professional.rating || '0.0' }}</span>
                  <Star :size="20" class="text-yellow-400 fill-current" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-4 text-lg flex items-center gap-2">
              <Info :size="20" class="text-blue-600" /> Sobre mí
            </h3>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">
              {{ professional.bio || 'Este profesional no ha añadido una biografía aún.' }}
            </p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 class="font-bold text-gray-800 mb-4 text-lg">Detalles</h3>
            <ul class="space-y-4 text-gray-600">
              <li class="flex items-center gap-3">
                <MapPin :size="20" class="text-gray-400" />
                <span>{{ professional.department }}, {{ professional.municipality }}</span>
              </li>
              <li class="flex items-center gap-3">
                <Clock :size="20" class="text-gray-400" />
                <span>Experiencia: <strong>{{ professional.experience_years }} años</strong></span>
              </li>
            </ul>
          </div>
        </div>

        <div class="lg:col-span-2">
          <h3 class="font-bold text-gray-800 mb-6 text-xl flex items-center gap-2">
            <Images :size="24" class="text-blue-600" /> Portafolio de Trabajo
          </h3>
          <div v-if="portfolio.length === 0" class="bg-white p-12 rounded-xl shadow-sm text-center text-gray-500 border border-dashed border-gray-300">
            <ImageOff :size="48" class="mx-auto mb-3 text-gray-300" />
            <p>Este profesional aún no ha subido fotos de sus trabajos.</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              v-for="project in portfolio" 
              :key="project._id"
              class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer group border border-gray-100"
            >
              <div class="aspect-video bg-gray-100 relative overflow-hidden">
                <img 
                  v-if="project.images && project.images.length > 0" 
                  :src="getAvatarUrl(project.images[0])" 
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  @click.stop="openLightbox(project.images, 0)"
                />
              </div>
              <div class="p-4">
                <h4 class="font-bold text-gray-800 mb-1 line-clamp-1">{{ project.title }}</h4>
                <p class="text-sm text-gray-500 line-clamp-2">{{ project.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="lightboxOpen" class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm" @click.self="closeLightbox">
      <button @click="closeLightbox" class="absolute top-4 right-4 text-white/70 hover:text-white p-2"><X :size="32" /></button>
      <button v-if="currentProjectImages.length > 1" @click.stop="prevImage" class="absolute left-4 text-white/50 hover:text-white p-2"><ChevronLeft :size="48" /></button>
      <div class="max-w-5xl max-h-[90vh] px-4 relative">
        <img :src="getAvatarUrl(currentProjectImages[currentImageIndex])" class="max-w-full max-h-[85vh] object-contain rounded shadow-2xl" />
      </div>
      <button v-if="currentProjectImages.length > 1" @click.stop="nextImage" class="absolute right-4 text-white/50 hover:text-white p-2"><ChevronRight :size="48" /></button>
    </div>

    <div v-if="requestModalOpen" class="fixed inset-0 z-[50] bg-black/50 flex items-center justify-center backdrop-blur-sm p-4" @click.self="requestModalOpen = false">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
        
        <div class="bg-blue-600 p-6 text-white flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold">Solicitar Servicio</h3>
            <p class="text-blue-100 text-sm mt-1">Pide una cotización o agenda una visita con {{ professional.User?.first_name }}</p>
          </div>
          <button @click="requestModalOpen = false" class="text-blue-100 hover:text-white">
            <X :size="24" />
          </button>
        </div>

        <form @submit.prevent="sendRequest" class="p-6 space-y-4">
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">¿Qué necesitas?</label>
            <input 
              v-model="serviceForm.title" 
              type="text" 
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Ej: Revisión de cableado eléctrico"
              required
            >
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Fecha Deseada</label>
              <div class="relative">
                <Calendar :size="18" class="absolute left-3 top-2.5 text-gray-400" />
                <input 
                  v-model="serviceForm.service_date" 
                  type="date" 
                  class="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  required
                  :min="todayStr"
                >
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <div class="relative">
                <MapPin :size="18" class="absolute left-3 top-2.5 text-gray-400" />
                <input 
                  v-model="serviceForm.location" 
                  type="text" 
                  class="w-full border rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                  placeholder="Colonia / Barrio"
                  required
                >
              </div>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Detalles del Trabajo</label>
            <textarea 
                v-model="serviceForm.description" 
                rows="4" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Describe el problema o lo que necesitas que haga el profesional..."
                required
            ></textarea>
          </div>

          <button 
            type="submit" 
            class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
            :disabled="sendingRequest"
          >
            <Loader2 v-if="sendingRequest" class="animate-spin" :size="20" />
            {{ sendingRequest ? 'Enviando Solicitud...' : 'Enviar Solicitud' }}
          </button>
        </form>

      </div>
    </div>

  </div>
</template>

<script setup>
import { 
  Loader2, User as UserIcon, BadgeCheck, Star, MapPin, 
  Briefcase, Clock, Images, ImageOff, MessageCircle, Info,
  X, ChevronLeft, ChevronRight, Calendar
} from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const authStore = useAuthStore();

const loading = ref(true);
const professional = ref(null);
const portfolio = ref([]);
const professionalId = route.params.id;

const requestModalOpen = ref(false);
const sendingRequest = ref(false);
const lightboxOpen = ref(false);
const currentImageIndex = ref(0);
const currentProjectImages = ref([]);

const serviceForm = reactive({
  title: '',
  description: '',
  service_date: '',
  location: ''
});

const todayStr = new Date().toISOString().split('T')[0];

const getAvatarUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-HN', { month: 'short', year: 'numeric' });
};

const openLightbox = (images, index) => {
  currentProjectImages.value = images;
  currentImageIndex.value = index;
  lightboxOpen.value = true;
};
const closeLightbox = () => lightboxOpen.value = false;
const nextImage = () => currentImageIndex.value = (currentImageIndex.value + 1) % currentProjectImages.value.length;
const prevImage = () => currentImageIndex.value = (currentImageIndex.value - 1 + currentProjectImages.value.length) % currentProjectImages.value.length;

const openRequestModal = () => {
  if (!authStore.token) {
    if (confirm('Necesitas iniciar sesión para contratar a un profesional. ¿Ir al login?')) {
      router.push('/login');
    }
    return;
  }
    
  requestModalOpen.value = true;
};

const sendRequest = async () => {
  sendingRequest.value = true;
  try {
    await $fetch(`${config.public.apiBase}/service-requests`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: {
        ...serviceForm,
        professional_id: professional.value.id
      }
    });

    alert('¡Solicitud enviada con éxito! El profesional la revisará pronto.');
    requestModalOpen.value = false;
    
    serviceForm.title = '';
    serviceForm.description = '';
    serviceForm.service_date = '';
    serviceForm.location = '';

  } catch (error) {
    console.error(error);
    alert('Error al enviar la solicitud: ' + (error.data?.message || error.message));
  } finally {
    sendingRequest.value = false;
  }
};

onMounted(async () => {
  try {
    const proData = await $fetch(`${config.public.apiBase}/professionals/${professionalId}`);
    professional.value = proData;

    if (proData && proData.id) {
      const portData = await $fetch(`${config.public.apiBase}/portfolio/${proData.id}`);
      portfolio.value = portData;
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>