<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      
      <div class="bg-blue-600 p-4 text-white flex justify-between items-center">
        <h3 class="font-bold text-lg">Calificar Experiencia</h3>
        <button @click="$emit('close')" class="hover:text-gray-200"><X :size="24" /></button>
      </div>

      <div class="p-6 text-center">
        <p class="text-gray-600 mb-4">{{ title }}</p>
        
        <div class="flex justify-center mb-6">
          <StarRating v-model="form.rating" :size="40" />
        </div>

        <textarea 
          v-model="form.comment" 
          rows="3" 
          class="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
          placeholder="Cuéntanos, ¿qué te pareció? (Opcional)"
        ></textarea>

        <button 
          @click="submit" 
          class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 hover:bg-blue-700 transition"
          :disabled="loading || form.rating === 0"
        >
          {{ loading ? 'Enviando...' : 'Publicar Reseña' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X } from 'lucide-vue-next';
import StarRating from '~/components/common/StarRating.vue';

const props = defineProps({
  isOpen: Boolean,
  title: String,
  loading: Boolean
});

const emit = defineEmits(['close', 'submit']);

const form = reactive({
  rating: 0,
  comment: ''
});

const submit = () => {
  emit('submit', { ...form });
};
</script>