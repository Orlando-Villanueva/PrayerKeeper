
<template>
  <auth-layout>
    <div class="flex flex-col items-center justify-center min-h-[400px] p-6">
      <div v-if="!error" class="text-center">
        <h2 class="text-xl font-semibold mb-4 text-gray-800">Completing sign in...</h2>
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
      </div>

      <div v-if="error" class="text-center max-w-md">
        <svg class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-xl font-semibold mb-3 text-gray-900">Authentication Failed</h3>
        <p class="mb-6 text-gray-600">{{ error }}</p>
        <base-button @click="goToLogin" variant="primary">
          Back to Login
        </base-button>
      </div>
    </div>
  </auth-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import AuthLayout from '../layout/AuthLayout.vue';
import BaseButton from '../ui/BaseButton.vue';

const router = useRouter();
const authStore = useAuthStore();
const error = ref(null);

const goToLogin = () => {
  router.push('/');
};

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const errorDescription = urlParams.get('error_description');
    
    if (errorDescription?.includes('Error getting user email')) {
      error.value = "Unable to sign in. Please make sure you have an email address linked to your X/Twitter account and try again.";
      return;
    }

    await authStore.initialize();
    if (authStore.isAuthenticated) {
      router.push('/dashboard');
    } else {
      error.value = 'Authentication failed. Please try again.';
    }
  } catch (err) {
    console.error('Auth callback error:', err);
    error.value = err.message || 'Authentication failed';
  }
});
</script>
