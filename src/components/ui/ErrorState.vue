<template>
  <div class="bg-red-50/90 p-6 rounded-xl shadow-lg mb-8 backdrop-blur-sm">
    <div class="flex">
      <div class="flex-shrink-0">
        <svg class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-4">
        <h3 class="text-base font-medium text-red-800">{{ message }}</h3>
        <div class="mt-3">
          <button 
            @click="onDismiss" 
            class="text-sm font-medium text-red-600 hover:text-red-500 transition-colors duration-200"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['dismiss']);

const onDismiss = () => {
  emit('dismiss');
};
</script>
