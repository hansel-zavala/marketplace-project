<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-800">Notificaciones</h1>
          <p class="text-gray-600">Revisa tu historial de actividad y alertas</p>
        </div>
        <button 
          @click="markAllRead" 
          class="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition"
          :disabled="loading || unreadCount === 0"
        >
          <CheckCheck :size="20" />
          Marcar todas como leídas
        </button>
      </div>

      <div v-if="loading && !notifications.length" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-gray-400" :size="40" />
      </div>

      <div v-else-if="notifications.length === 0" class="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
        <BellOff class="mx-auto text-gray-300 mb-4" :size="48" />
        <h3 class="text-xl font-medium text-gray-800">No tienes notificaciones</h3>
        <p class="text-gray-500 mt-2">Te avisaremos cuando haya novedades importantes.</p>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="divide-y divide-gray-100">
          <div 
            v-for="notification in notifications" 
            :key="notification.id"
            class="p-6 hover:bg-gray-50 transition relative group"
            :class="{ 'bg-blue-50/30': !notification.is_read }"
          >
            <div class="flex gap-4">
              <div class="mt-1 flex-shrink-0">
                 <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="getTypeColor(notification.type)">
                    <Briefcase v-if="notification.type === 'job_request'" :size="20" />
                    <ShoppingBag v-else-if="notification.type === 'new_order'" :size="20" />
                    <CheckCircle v-else-if="notification.type === 'order_status'" :size="20" />
                    <Bell v-else :size="20" />
                 </div>
              </div>
              
              <div class="flex-grow">
                <div class="flex justify-between items-start">
                  <h4 class="font-semibold text-gray-800 text-lg mb-1" :class="{ 'text-blue-700': !notification.is_read }">
                    {{ notification.title }}
                  </h4>
                  <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {{ formatDate(notification.created_at) }}
                  </span>
                </div>
                
                <p class="text-gray-600 mb-3">{{ notification.message }}</p>
                
                <div class="flex items-center gap-4 mt-2">
                  <button 
                    v-if="notification.data?.link"
                    @click="router.push(notification.data.link)"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                  >
                    Ver detalles <ArrowRight :size="16" />
                  </button>
                  
                  <button 
                    v-if="!notification.is_read"
                    @click="markAsRead(notification)"
                    class="text-sm text-gray-500 hover:text-gray-700 font-medium"
                  >
                    Marcar como leída
                  </button>
                </div>
              </div>

              <button 
                @click="deleteNotification(notification.id)"
                class="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-1"
                title="Eliminar"
              >
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-100 flex justify-center gap-2">
          <button 
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft :size="20" />
          </button>
          <span class="py-2 px-4 text-sm text-gray-600">
            Página {{ currentPage }} de {{ totalPages }}
          </span>
          <button 
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight :size="20" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { 
  Bell, Briefcase, ShoppingBag, CheckCircle, BellOff, 
  Loader2, CheckCheck, Trash2, ArrowRight, ChevronLeft, ChevronRight 
} from 'lucide-vue-next';
import { useAuthStore } from '~/stores/auth';
import { useToastStore } from '~/stores/toast';

definePageMeta({ middleware: ['auth'] });

const config = useRuntimeConfig();
const authStore = useAuthStore();
const toastStore = useToastStore();
const router = useRouter();

const loading = ref(true);
const notifications = ref([]);
const unreadCount = ref(0);
const currentPage = ref(1);
const totalPages = ref(1);
const limit = 10;

const getTypeColor = (type) => {
  switch (type) {
    case 'job_request': return 'bg-blue-100 text-blue-600';
    case 'new_order': return 'bg-green-100 text-green-600';
    case 'order_status': return 'bg-purple-100 text-purple-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString('es-HN', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });
};

const fetchNotifications = async (page = 1) => {
  loading.value = true;
  try {
    const data = await $fetch(`${config.public.apiBase}/notifications`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
      query: { page, limit }
    });
    
    notifications.value = data.notifications;
    currentPage.value = parseInt(data.currentPage);
    totalPages.value = data.totalPages;
    unreadCount.value = data.unreadCount;
  } catch (error) {
    console.error(error);
    toastStore.show('Error al cargar notificaciones', 'error');
  } finally {
    loading.value = false;
  }
};

const markAllRead = async () => {
  try {
    await $fetch(`${config.public.apiBase}/notifications/read-all`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    notifications.value.forEach(n => n.is_read = true);
    unreadCount.value = 0;
    toastStore.show('Todas las notificaciones marcadas como leídas', 'success');
  } catch (error) {
    toastStore.show('Error al actualizar notificaciones', 'error');
  }
};

const markAsRead = async (notification) => {
  try {
    await $fetch(`${config.public.apiBase}/notifications/${notification.id}/read`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    notification.is_read = true;
    unreadCount.value = Math.max(0, unreadCount.value - 1);
  } catch (error) {
    console.error(error);
  }
};

const deleteNotification = async (id) => {
  if (!confirm('¿Estás seguro de eliminar esta notificación?')) return;

  try {
    await $fetch(`${config.public.apiBase}/notifications/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${authStore.token}` }
    });
    
    notifications.value = notifications.value.filter(n => n.id !== id);
    toastStore.show('Notificación eliminada', 'success');
    
    if (notifications.value.length === 0 && currentPage.value > 1) {
      changePage(currentPage.value - 1);
    } else if (notifications.value.length === 0) {
      fetchNotifications(currentPage.value);
    }
  } catch (error) {
    toastStore.show('Error al eliminar notificación', 'error');
  }
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    fetchNotifications(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

onMounted(() => {
  fetchNotifications();
});
</script>
