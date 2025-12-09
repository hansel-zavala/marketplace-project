import { defineStore } from 'pinia';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);

  const show = (message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    toasts.value.push({ id, message, type });

    setTimeout(() => {
      remove(id);
    }, duration);
  };

  const remove = (id) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return { toasts, show, remove };
});
