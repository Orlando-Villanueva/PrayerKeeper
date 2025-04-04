<template>
  <AuthLayout>
    <div class="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl">
      <!-- Left Side - Value Proposition -->
      <div class="md:w-1/2 mb-6 md:mb-0 md:pr-8">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-md">
          Keep Track of Your Prayers
        </h2>
        <p class="text-white/90 text-lg md:text-xl mb-6 drop-shadow-sm">
          Organize and manage prayer lists for both unbelievers and brethren. Add new
          prayers, edit existing ones, and
          resolve them when God answers.
        </p>
      </div>

      <!-- Right Side - Auth Forms -->
      <div class="md:w-1/2 w-full max-w-md">
        <AuthForm v-if="authMode !== 'reset'" 
          v-model:mode="authMode" 
          v-model:email="email" 
          v-model:password="password"
          :error="authStore.error" 
          :loading="authStore.loading" 
          :submitButtonText="submitButtonText"
          @submit="handleSubmit"
          @twitter-sign-in="handleTwitterSignIn" />
        <PasswordResetForm v-else 
          v-model:mode="authMode" 
          v-model:email="email" 
          :error="authStore.error"
          :loading="authStore.loading" 
          :resetEmailSent="authStore.hasResetEmailSent" 
          @submit="handleSubmit" />
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