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
      <input
        :id="id"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :required="required"
        class="w-full px-3 py-2.5 border border-gray-200 rounded-md shadow-sm 
               bg-white/80 backdrop-blur-sm
               focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400 
               hover:border-purple-200
               transition-all duration-300 ease-in-out
               mt-1"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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

const hasLabelSlot = computed(() => !!slots.label)
</script>