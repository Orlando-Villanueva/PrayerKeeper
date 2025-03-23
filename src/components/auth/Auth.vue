<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
    <!-- Header - Minimal -->
    <header class="py-4 px-6">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600 mr-2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>
          <h1 class="text-xl font-semibold text-gray-800">TrackPrayer</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col md:flex-row items-center justify-center px-6 py-4">
      <!-- Left Side - Value Proposition -->
      <div class="md:w-1/2 mb-6 md:mb-0 md:pr-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Keep Track of Your Prayers
        </h2>
        <p class="text-gray-600 mb-4">
          Organize prayers for 'Unbelievers' and 'Brethren in Hardship'. Add, edit, and track your spiritual support.
        </p>
      </div>
      
      <!-- Right Side - Auth Forms -->
      <div class="md:w-1/2 w-full max-w-md">
        <AuthForm 
          v-model:mode="authMode"
          v-model:email="email"
          v-model:password="password"
          :error="authStore.error"
          :loading="authStore.loading"
          :submitButtonText="submitButtonText"
          @submit="handleSubmit"
        />
      </div>
    </main>

    <!-- Minimal Footer -->
    <footer class="py-3 text-center text-sm text-gray-500">
      &copy; {{ new Date().getFullYear() }} TrackPrayer
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import AuthForm from './AuthForm.vue';

const email = ref('');
const password = ref('');
const authMode = ref('login');
const authStore = useAuthStore();
const router = useRouter();

const submitButtonText = computed(() => {
  if (authStore.loading) {
    return authMode.value === 'login' ? 'Signing in...' : 'Signing up...';
  }
  return authMode.value === 'login' ? 'Sign In' : 'Create Account';
});

onMounted(() => {
  authStore.resetError();
  // Set initial auth mode based on previous URL if available
  if (router.currentRoute.value.query.mode === 'signup') {
    authMode.value = 'signup';
  }
});

const handleSubmit = async () => {
  if (authMode.value === 'login') {
    const { success } = await authStore.signIn(email.value, password.value);
    if (success) {
      router.push('/dashboard');
    }
  } else {
    const { success } = await authStore.signUp(email.value, password.value);
    if (success) {
      router.push('/dashboard');
    }
  }
};
</script> 