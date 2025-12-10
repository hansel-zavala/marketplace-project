<template>
  <div class="relative" ref="bellRef">
    <button 
      @click="toggleDropdown" 
      class="relative p-2 text-gray-600 hover:text-blue-600 transition"
      title="Notificaciones"
    >
      <Bell :size="24" />
      <span 
        v-if="unreadCount > 0" 
        class="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-pulse"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <div 
      v-if="isOpen" 
      class="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden"
    >
      <div class="px-4 py-3 border-b flex justify-between items-center bg-gray-50">
        <h3 class="font-bold text-gray-700">Notificaciones</h3>
        <button 
          v-if="unreadCount > 0"
          @click="markAllRead" 
          class="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          Marcar todo leído
        </button>
      </div>

      <div class="max-h-96 overflow-y-auto">
        <div v-if="loading" class="p-8 text-center text-gray-400">
          <Loader2 class="animate-spin mx-auto mb-2" :size="24" />
        </div>

        <div v-else-if="notifications.length === 0" class="p-8 text-center text-gray-400 text-sm">
          No tienes notificaciones
        </div>

        <div v-else class="divide-y">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="p-4 hover:bg-gray-50 transition cursor-pointer relative"
            :class="{ 'bg-blue-50/50': !notification.is_read }"
            @click="handleNotificationClick(notification)"
          >
            <div class="flex gap-3">
              <div class="mt-1 flex-shrink-0">
                 <Briefcase v-if="notification.type === 'job_request'" class="text-blue-500" :size="20" />
                 <ShoppingBag v-else-if="notification.type === 'new_order'" class="text-green-500" :size="20" />
                 <CheckCircle v-else-if="notification.type === 'order_status'" class="text-purple-500" :size="20" />
                 <Bell v-else class="text-gray-400" :size="20" />
              </div>
              <div>
                <h4 class="text-sm font-semibold text-gray-800" :class="{ 'text-blue-700': !notification.is_read }">
                  {{ notification.title }}
                </h4>
                <p class="text-xs text-gray-600 mt-1 line-clamp-2">{{ notification.message }}</p>
                <p class="text-[10px] text-gray-400 mt-2">{{ formatDate(notification.created_at) }}</p>
              </div>
              <div v-if="!notification.is_read" class="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="p-2 border-t text-center bg-gray-50">
        <NuxtLink to="/notifications" class="text-xs text-blue-600 hover:underline font-medium block w-full py-1">
          Ver todas
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Bell, Briefcase, ShoppingBag, CheckCircle, Loader2 } from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';
import { onClickOutside } from '@vueuse/core';

const config = useRuntimeConfig();
const authStore = useAuthStore();
const router = useRouter();

const isOpen = ref(false);
const loading = ref(false);
const notifications = ref([]);
const unreadCount = ref(0);
const bellRef = ref(null);

onClickOutside(bellRef, () => isOpen.value = false);

const formatDate = (date) => {
  return new Date(date).toLocaleString('es-HN', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const fetchNotifications = async () => {
    if (!authStore.user) return;
    
    loading.value = true;
    try {
        // Correct endpoint
        const data = await $fetch(`${config.public.apiBase}/notifications`, {
            headers: { Authorization: `Bearer ${authStore.token}` },
            query: { limit: 5 }
        });
        notifications.value = data.notifications;
        unreadCount.value = data.unreadCount;
    } catch (error) {
        console.error('Error fetching notifications:', error);
    } finally {
        loading.value = false;
    }
};

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    fetchNotifications();
  }
};

const markAllRead = async () => {
    try {
        await $fetch(`${config.public.apiBase}/notifications/read-all`, {
             method: 'PATCH',
             headers: { Authorization: `Bearer ${authStore.token}` }
        });
        unreadCount.value = 0;
        notifications.value.forEach(n => n.is_read = true);
    } catch (error) {
        console.error(error);
    }
};

const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
         try {
            await $fetch(`${config.public.apiBase}/notifications/${notification.id}/read`, {
                method: 'PATCH',
                 headers: { Authorization: `Bearer ${authStore.token}` }
            });
            notification.is_read = true;
            unreadCount.value = Math.max(0, unreadCount.value - 1);
         } catch (e) { console.error(e); }
    }

    if (notification.data && notification.data.link) {
        router.push(notification.data.link);
        isOpen.value = false;
    }
};

let poller;
onMounted(() => {
    if (authStore.user) {
        fetchNotifications();
        poller = setInterval(fetchNotifications, 5000);
    }
});

onUnmounted(() => {
    clearInterval(poller);
});
</script>
