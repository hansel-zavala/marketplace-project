<template>
  <div class="min-h-screen bg-gray-50 py-12">
    
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
            <div class="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden">
              <img 
                v-if="user.profile_image" 
                :src="getAvatarUrl(user.profile_image)" 
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                <User :size="64" />
              </div>
            </div>
            
            <button class="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition transform hover:-translate-y-1" @click="contactModalOpen = true">
              Contactar / Cotizar

            </button>
          </div>

          <div class="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
                {{ user.first_name }} {{ user.last_name }}
                <span v-if="professional.verification_status === 'verified'" class="text-blue-500" title="Verificado">
                  <BadgeCheck :size="24" fill="currentColor" class="text-blue-100" />
                </span>
              </h1>
              <p class="text-xl text-blue-600 font-medium mt-1">{{ professional.profession }}</p>
              <p v-if="professional.business_name" class="text-gray-500 text-sm mt-1">
                <Briefcase :size="14" class="inline" /> {{ professional.business_name }}
              </p>
            </div>

            <div class="flex gap-8 text-center">
              <div>
                <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Tarifa</p>
                <p class="text-2xl font-bold text-gray-800">L. {{ professional.hourly_rate }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 uppercase font-bold tracking-wider">Calificación</p>
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
          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-bold text-gray-800 mb-4 text-lg">Sobre mí</h3>
            <p class="text-gray-600 leading-relaxed whitespace-pre-line">
              {{ professional.bio || 'Este profesional no ha añadido una biografía aún.' }}
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl shadow-sm">
            <h3 class="font-bold text-gray-800 mb-4 text-lg">Detalles</h3>
            <ul class="space-y-4 text-gray-600">
              <li class="flex items-center gap-3">
                <MapPin :size="20" class="text-gray-400" />
                <span>Cobertura: <strong>{{ professional.service_radius }} km</strong></span>
              </li>
              <li class="flex items-center gap-3">
                <Clock :size="20" class="text-gray-400" />
                <span>Experiencia: <strong>{{ professional.experience_years }} años</strong></span>
              </li>
              <li class="flex items-center gap-3">
                <Briefcase :size="20" class="text-gray-400" />
                <span>Trabajos: <strong>{{ professional.total_jobs }} completados</strong></span>
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
              class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition cursor-pointer group"
              @click="openLightbox(project.images, 0)"
            >
              <div class="aspect-video bg-gray-100 relative overflow-hidden">
                <img 
                  v-if="project.images && project.images.length > 0" 
                  :src="getAvatarUrl(project.images[0])" 
                  class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div v-if="project.images.length > 1" class="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Images :size="12" /> +{{ project.images.length - 1 }}
                </div>
              </div>
              <div class="p-4">
                <h4 class="font-bold text-gray-800 mb-1 line-clamp-1">{{ project.title }}</h4>
                <p class="text-sm text-gray-500 line-clamp-2">{{ project.description }}</p>
                <div class="mt-3 pt-3 border-t flex justify-between text-xs text-gray-400">
                  <span class="bg-blue-50 text-blue-600 px-2 py-0.5 rounded">{{ project.category }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>

    <div v-if="lightboxOpen" class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center backdrop-blur-sm" @click.self="closeLightbox">
      
      <button @click="closeLightbox" class="absolute top-4 right-4 text-white/70 hover:text-white p-2">
        <X :size="32" />
      </button>

      <button 
        v-if="currentProjectImages.length > 1"
        @click.stop="prevImage" 
        class="absolute left-4 text-white/50 hover:text-white p-2 transition hover:bg-white/10 rounded-full"
      >
        <ChevronLeft :size="48" />
      </button>

      <div class="max-w-5xl max-h-[90vh] px-4 relative">
        <img 
          :src="getAvatarUrl(currentProjectImages[currentImageIndex])" 
          class="max-w-full max-h-[85vh] object-contain rounded shadow-2xl"
        />
        <p class="text-center text-white/80 mt-4 font-medium text-lg">
          {{ currentImageIndex + 1 }} / {{ currentProjectImages.length }}
        </p>
      </div>

      <button 
        v-if="currentProjectImages.length > 1"
        @click.stop="nextImage" 
        class="absolute right-4 text-white/50 hover:text-white p-2 transition hover:bg-white/10 rounded-full"
      >
        <ChevronRight :size="48" />
      </button>

    </div>
    <div v-if="contactModalOpen" class="fixed inset-0 z-[50] bg-black/50 flex items-center justify-center backdrop-blur-sm p-4" @click.self="contactModalOpen = false">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        
        <div class="bg-blue-600 p-6 text-white flex justify-between items-start">
          <div>
            <h3 class="text-xl font-bold">Contactar Profesional</h3>
            <p class="text-blue-100 text-sm mt-1">Envía un mensaje directo a {{ professional.User?.first_name }}</p>
          </div>
          <button @click="contactModalOpen = false" class="text-blue-100 hover:text-white">
            <X :size="24" />
          </button>
        </div>

        <form @submit.prevent="sendContact" class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tu Nombre</label>
            <input v-model="contactForm.name" type="text" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="contactForm.email" type="email" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input v-model="contactForm.phone" type="tel" class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
            <textarea 
                v-model="contactForm.message" 
                rows="4" 
                class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Hola, necesito una cotización para..."
                required
            ></textarea>
          </div>

          <button 
            type="submit" 
            class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition flex justify-center items-center gap-2"
            :disabled="sendingContact"
          >
            <Loader2 v-if="sendingContact" class="animate-spin" :size="20" />
            {{ sendingContact ? 'Enviando...' : 'Enviar Mensaje' }}
          </button>
        </form>

      </div>
    </div>
  </div>
  
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { 
  Loader2, User, BadgeCheck, Star, MapPin, 
  Briefcase, Clock, Images, ImageOff, X, ChevronLeft, ChevronRight
} from 'lucide-vue-next';

const route = useRoute();
const config = useRuntimeConfig();
const authStore = useAuthStore();

const loading = ref(true);
const professional = ref(null);
const user = ref(null); // Este es el usuario del PROFESIONAL que estamos viendo
const portfolio = ref([]);

const lightboxOpen = ref(false);
const currentImageIndex = ref(0);
const currentProjectImages = ref([]);

const professionalId = route.params.id;

const contactModalOpen = ref(false);
const sendingContact = ref(false);
const contactForm = reactive({
  name: '',
  email: '',
  phone: '',
  message: ''
});

const getAvatarUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

const openLightbox = (images, index) => {
  if (!images || images.length === 0) return;
  currentProjectImages.value = images;
  currentImageIndex.value = index;
  lightboxOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  lightboxOpen.value = false;
  document.body.style.overflow = 'auto';
};

const nextImage = () => {
  if (currentImageIndex.value < currentProjectImages.value.length - 1) {
    currentImageIndex.value++;
  } else {
    currentImageIndex.value = 0;
  }
};

const prevImage = () => {
  if (currentImageIndex.value > 0) {
    currentImageIndex.value--;
  } else {
    currentImageIndex.value = currentProjectImages.value.length - 1;
  }
};

onMounted(async () => {
  try {
    const [profileData, portData] = await Promise.all([
      $fetch(`${config.public.apiBase}/professionals/${professionalId}`),
      $fetch(`${config.public.apiBase}/portfolio/${professionalId}`)
    ]);
    
    professional.value = profileData;
    user.value = profileData.User || profileData.user;
    portfolio.value = portData;

  } catch (error) {
    console.error('Error cargando perfil:', error);
  } finally {
    loading.value = false;
  }
});

// Pre-llenar formulario si el usuario está logueado
watch(() => authStore.user, (currentUser) => {
    if (currentUser) {
        contactForm.name = `${currentUser.first_name} ${currentUser.last_name}`;
        contactForm.email = currentUser.email;
        contactForm.phone = currentUser.phone || '';
    }
}, { immediate: true });

const sendContact = async () => {
    sendingContact.value = true;
    try {
        await $fetch(`${config.public.apiBase}/professionals/${professionalId}/contact`, {
            method: 'POST',
            body: contactForm
        });
        alert('Mensaje enviado con éxito');
        contactModalOpen.value = false;
        contactForm.message = ''; // Limpiar mensaje
    } catch (error) {
        console.error(error);
        alert('Error al enviar mensaje');
    } finally {
        sendingContact.value = false;
    }
};
</script>
