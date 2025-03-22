<template>
  <AuthForm
    title="Create your account"
    :email="email"
    :password="password"
    :is-login="false"
    submit-text="Sign up"
    loading-text="Signing up..."
    switch-text="Already have an account?"
    switch-link="/login"
    switch-link-text="Sign in"
    @update:email="email = $event"
    @update:password="password = $event"
    @submit="handleSignup"
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

const handleSignup = async () => {
  const { success } = await authStore.signUp(email.value, password.value);
  
  if (success) {
    router.push('/');
  }
};
</script>
