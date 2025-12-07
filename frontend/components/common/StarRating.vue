<template>
  <div class="flex items-center gap-1">
    <button 
      v-for="star in 5" 
      :key="star"
      type="button"
      @click="handleClick(star)"
      @mouseenter="hoverVal = star"
      @mouseleave="hoverVal = 0"
      class="transition transform hover:scale-110"
      :class="readOnly ? 'cursor-default' : 'cursor-pointer'"
      :disabled="readOnly"
    >
      <Star 
        :size="size" 
        :class="getClass(star)"
        fill="currentColor"
      />
    </button>
  </div>
</template>

<script setup>
import { Star } from 'lucide-vue-next';

const props = defineProps({
  modelValue: { type: Number, default: 0 },
  readOnly: { type: Boolean, default: false },
  size: { type: Number, default: 20 }
});

const emit = defineEmits(['update:modelValue']);
const hoverVal = ref(0);

const handleClick = (val) => {
  if (!props.readOnly) {
    emit('update:modelValue', val);
  }
};

const getClass = (star) => {
  const current = hoverVal.value > 0 ? hoverVal.value : props.modelValue;
  
  if (star <= current) return 'text-yellow-400';
  return 'text-gray-300';
};
</script>