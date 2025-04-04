<template>
  <AuthLayout>
    <div class="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl">
      <!-- Left Side - Value Proposition -->
      <div class="md:w-1/2 mb-6 md:mb-0 md:pr-8">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          Keep Track of Your Prayers
        </h2>
        <p class="text-gray-600 mb-4">
          Organize and manage prayer lists for both unbelievers and brethren. <br class="hidden lg:block" /> Add new
          prayers, edit existing ones, and
          resolve them when God answers.
        </p>
      </div>

      <!-- Right Side - Auth Forms -->
      <div class="md:w-1/2 w-full max-w-md">
        <AuthForm v-if="authMode !== 'reset'" v-model:mode="authMode" v-model:email="email" v-model:password="password"
          :error="authStore.error" :loading="authStore.loading" :submitButtonText="submitButtonText"
          @submit="handleSubmit" />
        <PasswordResetForm v-else v-model:mode="authMode" v-model:email="email" :error="authStore.error"
          :loading="authStore.loading" :resetEmailSent="authStore.hasResetEmailSent" @submit="handleSubmit" />

        <!-- Social Login Section -->
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div class="mt-6">
            <button @click="handleTwitterSignIn" :disabled="authStore.loading"
              class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:cursor-pointer">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Sign in with X
            </button>
          </div>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import AuthForm from './AuthForm.vue';
import PasswordResetForm from './PasswordResetForm.vue';
import AuthLayout from '../layout/AuthLayout.vue';

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
  } else if (router.currentRoute.value.query.mode === 'reset') {
    authMode.value = 'reset';
  }
});

const handleTwitterSignIn = async () => {
  const { success } = await authStore.signInWithTwitter();
  if (success) {
    // The redirect will be handled by Supabase automatically
    // We don't need to manually redirect here
  }
};

const handleSubmit = async () => {
  if (authMode.value === 'login') {
    const { success } = await authStore.signIn(email.value, password.value);
    if (success) {
      router.push('/dashboard');
    }
  } else if (authMode.value === 'signup') {
    const { success } = await authStore.signUp(email.value, password.value);
    if (success) {
      router.push('/dashboard');
    }
  } else if (authMode.value === 'reset') {
    await authStore.resetPassword(email.value);
  }
};
</script> 