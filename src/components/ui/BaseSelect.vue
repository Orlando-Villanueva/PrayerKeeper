<template>
  <div class="mb-3">
    <div class="flex flex-col">
      <div class="flex items-center">
        <div class="flex-1">
          <slot name="label">
            <label :for="id" class="text-sm font-medium text-gray-700 tracking-wide">
              {{ label }}
            </label>
          </slot>
        </div>
        <div class="flex-none">
          <slot name="button"></slot>
        </div>
      </div>
      <div class="relative">
        <select
          :id="id"
          :value="modelValue"
          @input="$emit('update:modelValue', $event.target.value)"
          :name="name"
          :required="required"
          class="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-lg shadow-sm 
                 bg-white/80 backdrop-blur-sm text-gray-800
                 focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 
                 hover:border-purple-200
                 transition-all duration-300 ease-in-out
                 appearance-none
                 mt-1"
        >
          <option v-if="placeholder" value="" disabled selected class="text-gray-400">{{ placeholder }}</option>
          <slot></slot>
        </select>
        <!-- Custom dropdown arrow -->
        <div class="absolute inset-y-0 right-0 flex items-center px-2 mt-1 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  name: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script>
