<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <h1 class="text-xl font-semibold text-gray-900">Prayer Dashboard</h1>
        </div>
        <div class="flex items-center">
          <button 
            @click="handleSignOut" 
            class="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            :disabled="authStore.loading"
          >
            {{ authStore.loading ? 'Signing out...' : 'Logout' }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleSignOut = async () => {
  const { success } = await authStore.signOut();
  if (success) {
    router.push('/login');
  }
};
</script> 