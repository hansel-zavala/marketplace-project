<template>
  <div v-if="isOpen" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="cancel">
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <div class="p-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0">
            <AlertTriangle :size="24" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-900">{{ title }}</h3>
            <p class="text-gray-500 text-sm mt-1">{{ message }}</p>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
        <button 
          @click="cancel" 
          class="px-4 py-2 bg-white text-gray-700 font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="confirm" 
          class="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          {{ confirmText }}
        </button>
      </div>
    
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    default: '¿Estás seguro?'
  },
  message: {
    type: String,
    default: 'Esta acción no se puede deshacer.'
  },
  confirmText: {
    type: String,
    default: 'Confirmar'
  },
  cancelText: {
    type: String,
    default: 'Cancelar'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>
