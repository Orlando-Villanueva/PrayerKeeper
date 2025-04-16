<template>
  <div v-if="modelValue" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-start justify-center min-h-screen pt-4 sm:px-2 pb-20 text-center sm:items-center sm:p-0">
      <!-- Background overlay with gradient -->
      <div class="fixed inset-0" aria-hidden="true" @click="$emit('update:modelValue', false)">
        <div class="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-800/85 to-purple-700/80 backdrop-blur-sm"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white/90 backdrop-blur-sm rounded-xl text-left overflow-hidden shadow-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full relative w-[94%] mx-auto max-h-[90vh] overflow-y-auto border border-white/20">
        <!-- Close button -->
        <button @click="$emit('update:modelValue', false)" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none z-10 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <!-- Header Section -->
        <div class="sm:px-5 px-4 pt-6 pb-2">
          <div class="text-center">
            <h3 class="text-2xl sm:text-3xl font-medium text-gray-800 tracking-tight leading-tight" id="modal-title">
              <slot name="title">Modal Title</slot>
            </h3>
            <p class="text-gray-600 mt-2 tracking-wide text-sm">
              <slot name="subtitle">Modal description</slot>
            </p>
          </div>
          
          <!-- Content Section -->
          <slot name="content"></slot>
        </div>
        
        <!-- Footer Section -->
        <div class="sm:px-5 px-4 py-4 flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3 border-t border-gray-100">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script>
