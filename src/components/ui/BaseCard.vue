<template>
  <div class="bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-sm rounded-xl shadow-xl border border-purple-100/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-[-1px] hover:border-purple-200">
    <!-- Card Header -->
    <div class="px-3 md:px-4 py-3 sm:px-8" :class="headerClass">
      <div class="flex justify-between gap-3">
        <div class="flex flex-col self-center">
          <h2 class="text-xl font-bold tracking-tight text-gray-900">{{ title }}</h2>
          <!-- Subtitle slot -->
          <slot name="subtitle"></slot>
        </div>
        <!-- Action buttons slot -->
        <slot name="action"></slot>
      </div>
    </div>
    
    <!-- Card Content -->
    <div class="px-3 md:px-4 py-2 sm:px-8 flex-1 overflow-y-auto">
      <slot></slot>
    </div>
    
    <!-- Bottom Area -->
    <slot name="footer"></slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  headerClass: {
    type: String,
    default: 'bg-gradient-to-r from-purple-300 to-purple-200 border-b border-purple-300/70'
  }
});
</script>
