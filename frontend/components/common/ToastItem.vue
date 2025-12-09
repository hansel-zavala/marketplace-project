<template>
  <div 
    class="flex items-start p-4 mb-3 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform translate-x-0"
    :class="typeClasses"
    role="alert"
  >
    <div class="mr-3 mt-0.5">
      <CheckCircle v-if="toast.type === 'success'" :size="20" />
      <AlertCircle v-if="toast.type === 'error'" :size="20" />
      <AlertTriangle v-if="toast.type === 'warning'" :size="20" />
      <Info v-if="toast.type === 'info'" :size="20" />
    </div>
    
    <div class="flex-grow text-sm font-medium">
      {{ toast.message }}
    </div>

    <button @click="$emit('remove')" class="ml-3 text-current opacity-70 hover:opacity-100 transition">
      <X :size="16" />
    </button>
  </div>
</template>

<script setup>
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next';

const props = defineProps({
  toast: {
    type: Object,
    required: true
  }
});

const typeClasses = computed(() => {
  switch (props.toast.type) {
    case 'success':
      return 'bg-green-50 text-green-800 border-green-500';
    case 'error':
      return 'bg-red-50 text-red-800 border-red-500';
    case 'warning':
      return 'bg-yellow-50 text-yellow-800 border-yellow-500';
    case 'info':
    default:
      return 'bg-blue-50 text-blue-800 border-blue-500';
  }
});
</script>
