<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Dirección, calle, número de casa</label>
      <input 
        v-model="formData.street_address" 
        type="text" 
        class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
        required 
        placeholder="Ej: Col. Los Alamos, Calle 4, Casa 202"
      >
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
        <div class="relative">
          <select 
            v-model="selectedDepartment" 
            @change="handleDepartmentChange"
            class="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            required
          >
            <option value="" disabled>Selecciona un departamento</option>
            <option v-for="dept in locations" :key="dept.department" :value="dept.department">
              {{ dept.department }}
            </option>
          </select>
          <ChevronDown :size="16" class="absolute right-3 top-3 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Municipio / Ciudad</label>
        <div class="relative">
          <select 
            v-model="formData.city" 
            class="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none disabled:bg-gray-100"
            required
            :disabled="!selectedDepartment"
          >
            <option value="" disabled>Selecciona una ciudad</option>
            <option v-for="city in availableCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
          <ChevronDown :size="16" class="absolute right-3 top-3 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Código Postal</label>
        <input 
          v-model="formData.postal_code" 
          type="text" 
          class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          required 
          placeholder="Ej: 21102"
        >
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Dirección</label>
        <div class="relative">
          <select v-model="formData.address_type" class="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none">
            <option value="shipping">Para Envíos</option>
            <option value="billing">Facturación</option>
            <option value="service">Servicio a Domicilio</option>
          </select>
          <ChevronDown :size="16" class="absolute right-3 top-3 text-gray-500 pointer-events-none" />
        </div>
      </div>
    </div>

    <div class="flex items-center">
      <input 
        v-model="formData.is_default" 
        id="default-addr" 
        type="checkbox" 
        class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
      >
      <label for="default-addr" class="ml-2 text-sm text-gray-700 cursor-pointer select-none">
        Establecer como dirección predeterminada
      </label>
    </div>

    <button 
      type="submit" 
      class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center gap-2"
      :disabled="loading"
    >
      <span v-if="loading" class="animate-spin">⌛</span>
      {{ loading ? 'Guardando...' : (isEditMode ? 'Actualizar Dirección' : 'Guardar Dirección') }}
    </button>

  </form>
</template>

<script setup>
import { locations } from '~/utils/honduras_locations';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => null
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['submit']);

const isEditMode = computed(() => !!props.initialData);
const selectedDepartment = ref('');
const availableCities = ref([]);

const formData = reactive({
  street_address: '',
  city: '',
  state: '',
  postal_code: '',
  address_type: 'shipping',
  is_default: false
});


const updateCities = (deptName) => {
  const found = locations.find(l => l.department === deptName);
  availableCities.value = found ? found.cities : [];
};

const handleDepartmentChange = () => {
  formData.state = selectedDepartment.value;
  formData.city = '';
  updateCities(selectedDepartment.value);
};

const handleSubmit = () => {
  emit('submit', { ...formData });
};


watchEffect(() => {
  if (props.initialData) {
    Object.assign(formData, props.initialData);
    
    selectedDepartment.value = props.initialData.state; 
    
    updateCities(props.initialData.state); 
  }
});
</script>