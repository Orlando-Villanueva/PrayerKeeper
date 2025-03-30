<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div class="p-4">
      <h3 class="text-lg font-medium text-gray-900 mb-4">
        {{ resetEmailSent ? 'Check Your Email' : 'Reset Password' }}
      </h3>

      <template v-if="!resetEmailSent">
        <p class="text-sm text-gray-600 mb-4">
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
          
          <div v-if="error" class="rounded-md bg-red-50 p-4 mb-3">
            <div class="text-sm text-red-700">{{ error }}</div>
          </div>
          
          <div class="flex items-center justify-between mt-4">
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
        <p class="text-sm text-gray-600 mb-4">
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