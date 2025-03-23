<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium',
      primary ? 
        'border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 
        'border-gray-300 bg-white text-indigo-600 hover:bg-gray-50'
    ]"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  primary: {
    type: Boolean,
    default: true
  }
});

defineEmits(['click']);
</script> 