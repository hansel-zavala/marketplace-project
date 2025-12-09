<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"
        >Profesión u Oficio Principal</label
      >
      <input
        v-model="form.profession"
        type="text"
        class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Ej: Electricista, Abogado, Diseñador..."
        required
      />
      <p class="text-xs text-gray-500 mt-1">Esto es lo primero que verán los clientes.</p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1"
        >Teléfono de Contacto <span class="text-red-500">*</span></label
      >
      <input
        v-model="form.phone"
        type="tel"
        class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
        placeholder="Ej: 9999-9999"
        required
      />
      <p class="text-xs text-gray-500 mt-1">Será visible para tus clientes.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1"
          >Nombre de tu Negocio (Opcional)</label
        >
        <div class="relative">
          <Briefcase :size="18" class="absolute left-3 top-3 text-gray-400" />
          <input
            v-model="form.business_name"
            type="text"
            class="w-full border rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej: Soluciones Rápidas S. de R.L."
          />
        </div>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Años de Experiencia</label>
        <input
          v-model="form.experience_years"
          type="number"
          min="0"
          class="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="0"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <ChevronDown
            :size="16"
            class="absolute right-3 top-3 text-gray-500 pointer-events-none"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Municipio</label>
        <div class="relative">
          <select
            v-model="form.municipality"
            class="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none disabled:bg-gray-100"
            required
            :disabled="!selectedDepartment"
          >
            <option value="" disabled>Selecciona un municipio</option>
            <option v-for="city in availableCities" :key="city" :value="city">
              {{ city }}
            </option>
          </select>
          <ChevronDown
            :size="16"
            class="absolute right-3 top-3 text-gray-500 pointer-events-none"
          />
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Cobro</label>
        <div class="relative">
          <select
            v-model="form.billing_type"
            class="w-full border rounded-lg px-4 py-2 bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            required
          >
            <option value="hourly">Por Hora</option>
            <option value="daily">Por Día</option>
            <option value="job">Por Trabajo Completado</option>
          </select>
          <ChevronDown
            :size="16"
            class="absolute right-3 top-3 text-gray-500 pointer-events-none"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          {{ feeLabel }} (Lempiras)
        </label>
        <div class="relative">
          <span class="absolute left-3 top-2 text-gray-500 font-bold">L.</span>
          <input
            v-model="form.fee"
            type="number"
            min="0"
            step="0.01"
            class="w-full border rounded-lg pl-8 pr-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="0.00"
          />
        </div>
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
  import { Briefcase, Loader2, ChevronDown } from 'lucide-vue-next';
  import { locations } from '~/utils/honduras_locations';

  const props = defineProps({
    initialData: {
      type: Object,
      default: () => null,
    },
    loading: Boolean,
    btnLabel: {
      type: String,
      default: 'Guardar Perfil',
    },
  });

  const emit = defineEmits(['submit']);

  import { useAuthStore } from '~/stores/auth';
  const authStore = useAuthStore();

  const selectedDepartment = ref('');
  const availableCities = ref([]);

  const form = reactive({
    profession: '',
    business_name: '',
    fee: '',
    billing_type: 'hourly',
    experience_years: '',
    department: '',
    municipality: '',
    phone: '',
    bio: '',
  });

  const feeLabel = computed(() => {
    switch (form.billing_type) {
      case 'hourly':
        return 'Tarifa por Hora';
      case 'daily':
        return 'Tarifa por Día';
      case 'job':
        return 'Tarifa Base Estimada';
      default:
        return 'Tarifa';
    }
  });

  const updateCities = (deptName) => {
    const found = locations.find((l) => l.department === deptName);
    availableCities.value = found ? found.cities : [];
  };

  const handleDepartmentChange = () => {
    form.department = selectedDepartment.value;
    form.municipality = '';
    updateCities(selectedDepartment.value);
  };

  watchEffect(() => {
    if (props.initialData) {
      Object.assign(form, props.initialData);

      if (props.initialData.hourly_rate && !form.fee) {
        form.fee = props.initialData.hourly_rate;
      }

      if (props.initialData.department) {
        selectedDepartment.value = props.initialData.department;
        updateCities(props.initialData.department);
        form.department = props.initialData.department; // Ensure sync
        form.municipality = props.initialData.municipality;
      }
    }

    if (!form.phone && authStore.user?.phone) {
      form.phone = authStore.user.phone;
    }
  });

  const handleSubmit = () => {
    // Ensure department is set from selectedDepartment if not yet in form
    form.department = selectedDepartment.value;
    emit('submit', { ...form });
  };
</script>
