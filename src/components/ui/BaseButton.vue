<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :form="form"
    @click="$emit('click', $event)"
    class="inline-flex items-center justify-center px-4 py-2.5 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:cursor-pointer transform hover:translate-y-[-1px] hover:shadow-lg"
    :class="buttonClasses"
  >
    <!-- Loading spinner -->
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    
    <!-- Icon slot -->
    <slot name="icon"></slot>
    
    <!-- Default slot for button text -->
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'ghost'].includes(value)
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
  },
  form: {
    type: String,
    default: ''
  }
});

const buttonClasses = computed(() => {
  const classes = {
    primary: 'border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
    secondary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-purple-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
    ghost: 'border-gray-200/50 bg-transparent text-gray-600 hover:text-gray-700 hover:bg-gray-50/50 focus:ring-gray-400 shadow-none disabled:opacity-50 disabled:cursor-not-allowed',
  };
  
  return classes[props.variant];
});

defineEmits(['click']);
</script> 