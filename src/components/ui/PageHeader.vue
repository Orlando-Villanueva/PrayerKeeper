<template>
  <div class="text-center mb-6 sm:mb-12">
    <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">{{ title }}</h1>
    <p v-if="subtitle" class="mt-2 sm:mt-3 text-base sm:text-lg tracking-wide text-white/90 drop-shadow font-medium">
      {{ subtitle }}
    </p>
    <div class="mt-4 sm:mt-6 flex justify-center space-x-4">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>
