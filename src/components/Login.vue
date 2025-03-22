<template>
  <AuthForm
    title="Sign in to your account"
    :email="email"
    :password="password"
    is-login
    submit-text="Sign in"
    loading-text="Signing in..."
    switch-text="New to our platform?"
    switch-link="/signup"
    switch-link-text="Create an account"
    @update:email="email = $event"
    @update:password="password = $event"
    @submit="handleLogin"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import AuthForm from './AuthForm.vue';

const email = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  authStore.resetError();
});

const handleLogin = async () => {
  const { success } = await authStore.signIn(email.value, password.value);
  
  if (success) {
    // Redirect to dashboard or home page after successful login
    router.push('/');
  }
};
</script>
