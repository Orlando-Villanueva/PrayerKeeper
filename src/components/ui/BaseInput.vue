<template>
  <div class="mb-3">
    <label :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <input
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :name="name"
      :type="type"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      :required="required"
      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
             focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 
             hover:border-gray-400
             transition-all duration-300 ease-in-out"
    />
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
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  autocomplete: {
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