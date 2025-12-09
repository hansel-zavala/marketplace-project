<template>
  <div class="min-h-screen flex flex-col">
    <ToastContainer />
    <CommonHeader />
    <main class="flex-grow">
      <NuxtPage />
    </main>
    <footer class="bg-gray-800 text-white py-6 text-center mt-auto">
      <p class="text-sm text-gray-400">&copy; 2025 Marketplace. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import ToastContainer from '~/components/common/ToastContainer.vue';

const authStore = useAuthStore();

await callOnce(async () => {
  await authStore.fetchUser();
});
</script>