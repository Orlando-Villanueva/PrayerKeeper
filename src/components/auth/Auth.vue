<template>
  <AuthLayout>
    <div class="flex-1 flex flex-col md:flex-row items-center justify-center w-full max-w-6xl">
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
          v-if="authMode !== 'reset'"
          v-model:mode="authMode"
          v-model:email="email"
          v-model:password="password"
          :error="authStore.error"
          :loading="authStore.loading"
          :submitButtonText="submitButtonText"
          @submit="handleSubmit"
        />
        <PasswordResetForm
          v-else
          v-model:mode="authMode"
          v-model:email="email"
          :error="authStore.error"
          :loading="authStore.loading"
          :resetEmailSent="authStore.hasResetEmailSent"
          @submit="handleSubmit"
        />
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