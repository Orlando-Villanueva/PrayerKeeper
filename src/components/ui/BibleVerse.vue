<template>
  <div class="flex flex-col items-center my-12 px-4 py-6 text-center max-w-2xl mx-auto">
    <q class="text-lg md:text-xl font-serif text-gray-700 italic">{{ text }}</q>
    <p class="mt-3 text-sm text-purple-600 font-medium">{{ reference }}</p>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    required: true
  }
});
</script> 