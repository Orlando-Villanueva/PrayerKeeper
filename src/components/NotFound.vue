<template>
  <AuthLayout>
    <div class="w-full max-w-md text-center">
      <h1 class="text-6xl font-bold text-purple-600 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">Oops!! Page not found</p>
      <BaseButton 
        @click="goToHome" 
        variant="primary"
      >
        Return Home
      </BaseButton>
    </div>
  </AuthLayout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import BaseButton from './ui/BaseButton.vue';
import AuthLayout from './layout/AuthLayout.vue';

const router = useRouter();

const goToHome = () => {
  router.push('/');
};
</script>
