<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
    
    <div class="flex justify-between items-start mb-4">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border border-gray-100">
          <img 
            v-if="displayImage" 
            :src="getAvatarUrl(displayImage)" 
            class="w-full h-full object-cover"
          />
          <UserIcon v-else :size="24" class="text-gray-400" />
        </div>
        <div>
          <h4 class="font-bold text-gray-800">{{ displayName }}</h4>
          <p class="text-xs text-gray-500">Solicitado el {{ formatDate(request.createdAt) }}</p>
        </div>
      </div>
      
      <span 
        class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
        :class="statusColor(request.status)"
      >
        {{ translateStatus(request.status) }}
      </span>
    </div>

    <div class="mb-6">
      <h3 class="text-lg font-bold text-blue-600 mb-2">{{ request.title }}</h3>
      <p class="text-gray-600 text-sm mb-4 bg-gray-50 p-3 rounded border border-gray-100">
        "{{ request.description }}"
      </p>
      
      <div class="flex flex-wrap gap-4 text-sm text-gray-500">
        <div class="flex items-center gap-2">
          <Calendar :size="16" class="text-blue-500" />
          <span class="font-medium text-gray-700">{{ formatDate(request.service_date) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <MapPin :size="16" class="text-red-500" />
          <span class="font-medium text-gray-700 truncate max-w-[200px]" :title="request.location">{{ request.location }}</span>
        </div>
      </div>
    </div>

    <div v-if="isProfessionalView">
      <div v-if="request.status === 'pending'" class="flex gap-3 pt-4 border-t border-gray-100">
        <button 
          @click="$emit('updateStatus', request.id, 'accepted')" 
          class="flex-1 bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <CheckCircle :size="18" /> Aceptar
        </button>
        <button 
          @click="$emit('updateStatus', request.id, 'rejected')" 
          class="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-lg font-bold hover:bg-red-50 transition flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <XCircle :size="18" /> Rechazar
        </button>
      </div>

      <div v-else-if="request.status === 'accepted'" class="pt-4 border-t border-gray-100">
        <button 
          @click="$emit('updateStatus', request.id, 'completed')" 
          class="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <CheckCheck :size="18" /> Marcar como Completado
        </button>
        <p class="text-xs text-center text-gray-400 mt-2">Contacta al cliente para coordinar.</p>
      </div>
    </div>

    <div v-else class="pt-4 border-t border-gray-100">
       <div v-if="request.status === 'accepted'" class="text-center">
          <p class="text-sm text-green-700 font-medium flex items-center justify-center gap-2">
             <Phone :size="16" /> El profesional te contactará pronto.
          </p>
       </div>
       <div v-else-if="request.status === 'pending'" class="text-center">
          <p class="text-xs text-gray-400">Esperando respuesta del profesional...</p>
       </div>
    </div>

  </div>
</template>

<script setup>
import { User as UserIcon, Calendar, MapPin, CheckCircle, XCircle, CheckCheck, Phone } from 'lucide-vue-next';

const props = defineProps({
  request: Object,
  loading: Boolean,
  viewMode: {
    type: String,
    default: 'professional' 
  }
});

defineEmits(['updateStatus']);
const config = useRuntimeConfig();

const isProfessionalView = computed(() => props.viewMode === 'professional');

const displayName = computed(() => {
  if (isProfessionalView.value) {
    return `${props.request.Client?.first_name} ${props.request.Client?.last_name}`;
  } else {
    const proUser = props.request.Professional?.User;
    return proUser ? `${proUser.first_name} ${proUser.last_name}` : 'Profesional';
  }
});

const displayImage = computed(() => {
  if (isProfessionalView.value) {
    return props.request.Client?.profile_image;
  } else {
    return props.request.Professional?.User?.profile_image;
  }
});

const getAvatarUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/${path.replace(/\\/g, '/')}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('es-HN', { 
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const translateStatus = (status) => {
  const map = { pending: 'Pendiente', accepted: 'Aceptado', rejected: 'Rechazado', completed: 'Completado', cancelled: 'Cancelado' };
  return map[status] || status;
};

const statusColor = (status) => {
  const map = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800'
  };
  return map[status] || 'bg-gray-100';
};
</script>