<template>
  <div class="mb-3">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <textarea
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :name="name"
      :placeholder="placeholder"
      :rows="rows"
      :required="required"
      class="w-full px-3 py-2.5 border border-gray-200 rounded-md shadow-sm 
             bg-white/80 backdrop-blur-sm
             focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 
             hover:border-purple-200
             transition-all duration-300 ease-in-out
             mt-1"
    ></textarea>
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
    type: String,
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
  rows: {
    type: Number,
    default: 3
  },
  required: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:modelValue']);
</script> 