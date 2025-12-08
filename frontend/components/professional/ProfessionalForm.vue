<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Profesión u Oficio Principal</label>
      <input 
        v-model="form.profession" 
        type="text" 
        class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Ej: Electricista, Abogado, Diseñador..."
        required
      >
      <p class="text-xs text-gray-500 mt-1">Esto es lo primero que verán los clientes.</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono de Contacto <span class="text-red-500">*</span></label>
      <input 
        v-model="form.phone" 
        type="tel" 
        class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Ej: 9999-9999"
        required
      >
      <p class="text-xs text-gray-500 mt-1">Será visible para tus clientes.</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de tu Negocio (Opcional)</label>
      <div class="relative">
        <Briefcase :size="18" class="absolute left-3 top-3 text-gray-400" />
        <input 
          v-model="form.business_name" 
          type="text" 
          class="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Ej: Soluciones Rápidas S. de R.L."
        >
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tarifa por Hora (Lempiras)</label>
        <div class="relative">
          <span class="absolute left-3 top-2 text-gray-500 font-bold">L.</span>
          <input 
            v-model="form.hourly_rate" 
            type="number" 
            min="0"
            step="0.01"
            class="w-full border rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0.00"
          >
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Radio de Cobertura (Km)</label>
        <div class="relative">
          <MapIcon :size="18" class="absolute left-3 top-3 text-gray-400" />
          <input 
            v-model="form.service_radius" 
            type="number" 
            min="1"
            class="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: 10"
          >
        </div>
        <p class="text-xs text-gray-500 mt-1">¿Qué tan lejos estás dispuesto a viajar?</p>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Sobre mí / Experiencia</label>
      <textarea 
        v-model="form.bio" 
        rows="4" 
        class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Cuéntale a tus clientes sobre tu experiencia, especialidades y por qué deberían contratarte."
      ></textarea>
      <p class="text-right text-xs text-gray-400 mt-1">{{ form.bio?.length || 0 }} / 500</p>
    </div>

    <button 
      type="submit" 
      class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
      :disabled="loading"
    >
      <Loader2 v-if="loading" class="animate-spin" :size="20" />
      <span v-else>{{ btnLabel }}</span>
    </button>

  </form>
</template>

<script setup>
import { Briefcase, Map as MapIcon, Loader2 } from 'lucide-vue-next';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null
  },
  loading: Boolean,
  btnLabel: {
    type: String,
    default: 'Guardar Perfil'
  }
});

const emit = defineEmits(['submit']);

  import { useAuthStore } from '~/stores/auth';
  const authStore = useAuthStore();
  
  const form = reactive({
    profession: '',
    business_name: '',
    hourly_rate: '',
    service_radius: 10,
    phone: '',
    bio: ''
  });

  watchEffect(() => {
    if (props.initialData) {
      Object.assign(form, props.initialData);
    }
    // If phone is empty in initialData, try to get it from authStore
    if (!form.phone && authStore.user?.phone) {
      form.phone = authStore.user.phone;
    }
  });

const handleSubmit = () => {
  emit('submit', { ...form });
};
</script>