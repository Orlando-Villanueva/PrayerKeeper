<template>
  <button
    :type="type"
    :disabled="disabled"
    :title="title"
    @click="$emit('click', $event)"
    class="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-200"
    :class="buttonClasses"
  >
    <!-- Icon slot -->
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'primary', 'success', 'danger', 'info'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  }
});

const buttonClasses = computed(() => {
  const classes = {
    default: 'text-gray-500 hover:text-purple-600 hover:bg-purple-50 active:bg-purple-100 active:scale-95 active:text-purple-700 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed',
    primary: 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 active:bg-blue-100 active:scale-95 active:text-blue-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
    success: 'text-gray-500 hover:text-green-600 hover:bg-green-50 active:bg-green-100 active:scale-95 active:text-green-700 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed',
    danger: 'text-gray-500 hover:text-red-600 hover:bg-red-50 active:bg-red-100 active:scale-95 active:text-red-700 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed',
    info: 'text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 active:scale-95 active:text-indigo-700 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed',
  };
  
  return classes[props.variant];
});

defineEmits(['click']);
</script>
