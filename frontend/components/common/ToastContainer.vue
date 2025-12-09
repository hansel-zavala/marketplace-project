<template>
  <div class="fixed top-20 right-4 z-[9999] w-full max-w-xs flex flex-col pointer-events-none">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toastStore.toasts" 
        :key="toast.id" 
        class="pointer-events-auto"
      >
        <ToastItem 
          :toast="toast" 
          @remove="toastStore.remove(toast.id)" 
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToastStore } from '~/stores/toast';
import ToastItem from './ToastItem.vue';

const toastStore = useToastStore();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
