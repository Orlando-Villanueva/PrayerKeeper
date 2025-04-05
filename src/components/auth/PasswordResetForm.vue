<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/20">
    <div class="px-7 py-5">
      <h3 class="text-3xl font-bold text-gray-800 mb-4 tracking-tight leading-tight text-center">
        {{ resetEmailSent ? 'Check Your Email' : 'Reset Password' }}
      </h3>

      <template v-if="!resetEmailSent">
        <p class="text-sm text-gray-600 mb-5 tracking-wide text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form @submit.prevent="$emit('submit')">
          <BaseInput
            id="reset-email"
            label="Email"
            :modelValue="email"
            @update:modelValue="$emit('update:email', $event)"
            name="email"
            type="email"
            autocomplete="email"
            required
          />
          
          <div v-if="error" class="rounded-md bg-red-50/80 backdrop-blur-sm p-4 mb-4 border border-red-100/50 shadow-sm transition-all duration-300">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
              <div class="text-sm font-medium text-red-700">{{ error }}</div>
            </div>
          </div>
          
          <div class="flex items-center justify-between mt-6">
            <BaseButton
              type="button"
              variant="secondary"
              @click="$emit('update:mode', 'login')"
            >
              Back to Login
            </BaseButton>
            
            <BaseButton 
              type="submit" 
              :disabled="loading"
              :loading="loading"
              variant="primary"
            >
              {{ loading ? 'Sending...' : 'Send Reset Link' }}
            </BaseButton>
          </div>
        </form>
      </template>

      <template v-else>
        <p class="text-sm text-gray-600 mb-5 tracking-wide text-center">
          We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
        </p>
        
        <BaseButton
          type="button"
          variant="secondary"
          class="w-full"
          @click="$emit('update:mode', 'login')"
        >
          Back to Login
        </BaseButton>
      </template>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../ui/BaseButton.vue';
import BaseInput from '../ui/BaseInput.vue';

defineProps({
  email: {
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
  resetEmailSent: {
    type: Boolean,
    default: false
  }
});

defineEmits(['update:mode', 'update:email', 'submit']);
</script> 