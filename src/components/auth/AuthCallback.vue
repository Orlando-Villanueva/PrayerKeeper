<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center max-w-lg px-4">
      <div v-if="!error">
        <h2 class="text-xl font-semibold mb-2">Completing sign in...</h2>
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>

      <div v-if="error" class="mt-4">
        <svg class="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 class="text-xl font-medium mt-3 text-gray-900">Authentication Failed</h3>
        <p class="mt-2 text-gray-600">{{ error }}</p>
        <button @click="goToLogin" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();
const error = ref(null);

const goToLogin = () => {
  router.push('/auth');
};

onMounted(async () => {
  try {
    await authStore.initialize();
    if (authStore.isAuthenticated) {
      router.push('/dashboard');
    } else {
      error.value = 'Authentication failed. Please try again.';
    }
  } catch (err) {
    console.error('Auth callback error:', err);
    if (err.message.includes('email_missing')) {
      error.value = "Unable to sign in. Please make sure you have an email address linked to your X/Twitter account and try again.";
    } else {
      error.value = err.message || 'Authentication failed';
    }
  }
});
</script>