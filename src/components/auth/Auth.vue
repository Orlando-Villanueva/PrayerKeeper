<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ isLogin ? 'Sign in to your account' : 'Create your account' }}
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <AuthInput
            id="email"
            label="Email address"
            v-model="email"
            name="email"
            type="email"
            autocomplete="email"
            :required="true"
          />

          <AuthInput
            id="password"
            label="Password"
            v-model="password"
            name="password"
            type="password"
            :autocomplete="isLogin ? 'current-password' : 'new-password'"
            :required="true"
          />

          <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
            <div class="text-sm text-red-700">{{ authStore.error }}</div>
          </div>

          <div>
            <AuthButton 
              type="submit" 
              :disabled="authStore.loading"
              :primary="true"
            >
              {{ authStore.loading ? (isLogin ? 'Signing in...' : 'Signing up...') : (isLogin ? 'Sign in' : 'Sign up') }}
            </AuthButton>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                {{ isLogin ? 'New to our platform?' : 'Already have an account?' }}
              </span>
            </div>
          </div>

          <div class="mt-6">
            <AuthButton 
              @click="toggleAuthMode"
              :primary="false"
            >
              {{ isLogin ? 'Create an account' : 'Sign in' }}
            </AuthButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import AuthInput from './AuthInput.vue';
import AuthButton from './AuthButton.vue';

const email = ref('');
const password = ref('');
const route = useRoute();
const isLogin = computed(() => route.path === '/login' || route.path === '/');
const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  authStore.resetError();
});

const toggleAuthMode = () => {
  // Clear form and errors when switching modes
  email.value = '';
  password.value = '';
  authStore.resetError();
  
  // Navigate to the other auth route
  const newPath = route.path === '/login' ? '/signup' : '/login';
  router.push(newPath);
};

const handleSubmit = async () => {
  if (isLogin.value) {
    const { success } = await authStore.signIn(email.value, password.value);
    if (success) {
      router.push('/');
    }
  } else {
    const { success } = await authStore.signUp(email.value, password.value);
    if (success) {
      router.push('/');
    }
  }
};
</script> 