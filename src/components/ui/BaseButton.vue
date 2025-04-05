<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
    class="inline-flex items-center justify-center px-5 py-2.5 border rounded-md text-sm font-medium focus:outline-none transition-all duration-300 hover:cursor-pointer transform hover:translate-y-[-1px] hover:shadow-lg"
    :class="buttonClasses"
  >
    <div v-if="loading" class="mr-2">
      <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const buttonClasses = computed(() => {
  const classes = {
    primary: 'border-transparent bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 focus:ring-2 focus:ring-purple-500/50 shadow-md',
    secondary: 'border-gray-200 bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white hover:border-purple-200 focus:ring-2 focus:ring-purple-500/30 shadow-sm',
    danger: 'border-transparent bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white hover:from-red-600 hover:via-red-700 hover:to-red-800 focus:ring-2 focus:ring-red-500/50 shadow-md',
  };
  
  return classes[props.variant] + (props.disabled || props.loading ? ' opacity-60 cursor-not-allowed' : '');
});

defineEmits(['click']);
</script> 