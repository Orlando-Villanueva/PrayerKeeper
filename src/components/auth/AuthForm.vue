<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="flex">
      <button 
        @click="$emit('update:mode', 'login')" 
        class="flex-1 text-center py-3 font-medium transition" 
        :class="mode === 'login' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 border-b-2 border-transparent hover:text-purple-600 hover:border-purple-600'"
      >
        Login
      </button>
      <button 
        @click="$emit('update:mode', 'signup')"
        class="flex-1 text-center py-3 font-medium transition"
        :class="mode === 'signup' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 border-b-2 border-transparent hover:text-purple-600 hover:border-purple-600'"
      >
        Sign Up
      </button>
    </div>
    
    <div class="p-4">
      <form @submit.prevent="$emit('submit')">
        <BaseInput
          :id="mode === 'login' ? 'login-email' : 'signup-email'"
          label="Email"
          :modelValue="email"
          @update:modelValue="$emit('update:email', $event)"
          :name="'email'"
          type="email"
          :autocomplete="'email'"
          :required="true"
        />

        <BaseInput
          :id="mode === 'login' ? 'login-password' : 'signup-password'"
          label="Password"
          :modelValue="password"
          @update:modelValue="$emit('update:password', $event)"
          :name="'password'"
          type="password"
          :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
          :required="true"
        />
        
        <div v-if="error" class="rounded-md bg-red-50 p-4 mb-3">
          <div class="text-sm text-red-700">{{ error }}</div>
        </div>
        
        <BaseButton 
          type="submit" 
          :disabled="loading"
          :loading="loading"
          variant="primary"
          class="mt-2 w-full"
        >
          {{ submitButtonText }}
        </BaseButton>
      </form>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../ui/BaseButton.vue';
import BaseInput from '../ui/BaseInput.vue';

defineProps({
  mode: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitButtonText: {
    type: String,
    required: true
  }
});

defineEmits(['update:mode', 'update:email', 'update:password', 'submit']);
</script> 