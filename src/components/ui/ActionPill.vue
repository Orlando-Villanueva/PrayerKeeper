<template>
  <router-link 
    :to="to" 
    class="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white shadow-inner hover:bg-white/30 transition-all duration-300"
  >
    <slot name="icon"></slot>
    <slot></slot>
  </router-link>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true
  }
});
</script>
