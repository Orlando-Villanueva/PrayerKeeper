<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo & App Name -->
        <div class="flex items-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600 mr-2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>
          <h1 class="text-xl font-semibold text-gray-900">PrayerKeeper</h1>
        </div>
        
        <!-- User Profile & Logout -->
        <div class="flex items-center">
          <!-- User Profile -->
          <div v-if="authStore.user" class="flex items-center">
            <!-- Medium screens and larger - Full profile info -->
            <div class="hidden md:flex items-center mr-4">
              <!-- Avatar -->
              <img 
                v-if="userAvatar" 
                :src="userAvatar" 
                class="h-8 w-8 rounded-full mr-2"
                alt="Profile"
              />
              <div 
                v-else
                class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2"
              >
                <span class="text-blue-600 font-medium text-sm">{{ userInitial }}</span>
              </div>
              
              <!-- Name & Email -->
              <div class="flex flex-col">
                <span class="text-sm font-medium text-gray-700">{{ displayName }}</span>
                <span class="text-xs text-gray-500">{{ authStore.user.email }}</span>
                <span v-if="isTwitterUser" class="text-xs text-blue-500">via X</span>
              </div>
            </div>
            
            <!-- Small screens - Compact profile -->
            <div class="flex md:hidden items-center mr-2">
              <div class="relative">
                <button 
                  @click="showMobileProfile = !showMobileProfile" 
                  class="relative flex items-center focus:outline-none"
                >
                  <img 
                    v-if="userAvatar" 
                    :src="userAvatar" 
                    class="h-8 w-8 rounded-full"
                    alt="Profile"
                  />
                  <div 
                    v-else
                    class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center"
                  >
                    <span class="text-blue-600 font-medium text-sm">{{ userInitial }}</span>
                  </div>
                  <!-- Twitter badge -->
                  <div v-if="isTwitterUser" class="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-3 h-3 border border-white"></div>
                </button>
                
                <!-- Mobile dropdown -->
                <div 
                  v-if="showMobileProfile" 
                  class="absolute right-0 top-10 mt-1 max-w-64 bg-white rounded-md shadow-lg py-1 z-10"
                >
                  <div class="px-4 py-2 border-b">
                    <p class="text-sm font-medium text-gray-700">{{ displayName }}</p>
                    <p class="text-xs text-gray-500 truncate">{{ authStore.user.email }}</p>
                    <p v-if="isTwitterUser" class="text-xs text-blue-500 mt-1">Signed in with X</p>
                  </div>
                  <button
                    @click="handleSignOut"
                    class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Logout button (visible on medium screens and up) -->
          <button 
            @click="handleSignOut" 
            class="hidden md:block px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const showMobileProfile = ref(false);

// User display name - use name if available, otherwise use email
const displayName = computed(() => {
  if (!authStore.user) return '';
  
  // Try to get name from user metadata or identities
  const user = authStore.user;
  
  // First check if we have a name in user metadata
  if (user.user_metadata && user.user_metadata.full_name) {
    return user.user_metadata.full_name;
  }
  
  // Next check if we have a name from a provider (like Twitter)
  if (user.identities && user.identities.length > 0) {
    const identity = user.identities[0];
    if (identity.identity_data && identity.identity_data.full_name) {
      return identity.identity_data.full_name;
    }
    if (identity.identity_data && identity.identity_data.name) {
      return identity.identity_data.name;
    }
  }
  
  // If no name available, use the part of the email before @
  return user.email ? user.email.split('@')[0] : 'User';
});

// Get user avatar if available
const userAvatar = computed(() => {
  if (!authStore.user) return null;
  
  const user = authStore.user;
  
  // Check for avatar in user metadata
  if (user.user_metadata && user.user_metadata.avatar_url) {
    return user.user_metadata.avatar_url;
  }
  
  // Check for avatar from provider (like Twitter)
  if (user.identities && user.identities.length > 0) {
    const identity = user.identities[0];
    if (identity.identity_data && identity.identity_data.avatar_url) {
      return identity.identity_data.avatar_url;
    }
  }
  
  return null;
});

// Get first letter of display name for default avatar
const userInitial = computed(() => {
  return displayName.value.charAt(0).toUpperCase();
});

// Check if user is authenticated with Twitter
const isTwitterUser = computed(() => {
  if (!authStore.user || !authStore.user.identities) return false;
  
  return authStore.user.identities.some(
    identity => identity.provider === 'twitter'
  );
});

const handleSignOut = async () => {
  showMobileProfile.value = false;
  const { success } = await authStore.signOut();
  if (success) {
    router.push('/auth');
  }
};
</script> 