<template>
  <div class="flex flex-col items-center px-4 py-6 text-center max-w-2xl mx-auto">
    <div class="relative">
      <svg class="absolute -top-6 -left-8 h-12 w-12 text-purple-200 opacity-70" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>
      <q class="text-xl md:text-2xl font-serif text-gray-700 italic leading-relaxed tracking-wide">{{ text }}</q>
      <svg class="absolute -bottom-6 -right-8 h-12 w-12 text-purple-200 opacity-70 transform rotate-180" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
      </svg>
    </div>
    <div class="mt-6 inline-flex items-center px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 font-medium shadow-sm">
      <span class="text-sm">{{ reference }}</span>
    </div>
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