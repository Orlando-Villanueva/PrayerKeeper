<template>
  <div class="flex flex-col justify-center items-center py-16">
    <div class="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-white mb-4"></div>
    <p class="text-white/80 text-lg animate-pulse">{{ message || 'Loading...' }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
});
</script>
