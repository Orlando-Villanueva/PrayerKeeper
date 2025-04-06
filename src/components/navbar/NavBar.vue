<template>
  <nav class="bg-white/90 backdrop-blur-sm shadow-md border-b border-purple-100 relative z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo & App Name -->
        <div class="flex items-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-purple-600 mr-2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>
          <h1 class="text-xl font-bold text-gray-800 tracking-tight">PrayerKeeper</h1>
        </div>
        
        <!-- User Profile & Logout -->
        <div class="flex items-center">
          <!-- User Profile -->
          <div v-if="authStore.user" class="flex items-center">
            <!-- Profile dropdown for all screen sizes -->
            <div class="relative">
              <button 
                @click="toggleProfileDropdown" 
                class="relative flex items-center focus:outline-none"
                aria-haspopup="true"
                :aria-expanded="showProfileDropdown"
              >
                <!-- Avatar with user info for medium screens and up -->
                <div class="hidden md:flex items-center">
                  <!-- Avatar with Twitter badge -->
                  <div class="relative">
                    <!-- Avatar -->
                    <img 
                      v-if="userAvatar" 
                      :src="userAvatar" 
                      class="h-9 w-9 rounded-full border-2 border-white shadow-sm"
                      alt="Profile"
                    />
                    <div 
                      v-else
                      class="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center border-2 border-white shadow-sm"
                    >
                      <span class="text-white font-medium text-sm">{{ userInitial }}</span>
                    </div>
                    
                    <!-- Twitter badge -->
                    <div v-if="isTwitterUser" class="absolute -bottom-0.5 -right-0.5 bg-black rounded-full w-4 h-4 border border-white shadow-sm flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <!-- Name -->
                  <div class="flex flex-col ml-2 mr-1">
                    <span class="text-sm font-semibold text-gray-800">{{ displayName }}</span>
                  </div>
                  
                  <!-- Dropdown indicator -->
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                
                <!-- Avatar only for small screens -->
                <div class="flex md:hidden">
                  <div class="relative">
                    <!-- Avatar -->
                    <img 
                      v-if="userAvatar" 
                      :src="userAvatar" 
                      class="h-9 w-9 rounded-full border-2 border-white shadow-sm"
                      alt="Profile"
                    />
                    <div 
                      v-else
                      class="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center border-2 border-white shadow-sm"
                    >
                      <span class="text-white font-medium text-sm">{{ userInitial }}</span>
                    </div>
                    
                    <!-- Twitter badge -->
                    <div v-if="isTwitterUser" class="absolute -bottom-0.5 -right-0.5 bg-black rounded-full w-4 h-4 border border-white shadow-sm flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                
              </button>
              
              <!-- Profile dropdown menu -->
              <div 
                v-if="showProfileDropdown" 
                class="absolute right-0 top-12 mt-2 w-64 rounded-xl shadow-lg overflow-hidden z-50 border border-purple-200/50 transition-all duration-200 transform"
              >
                <!-- User info section with gradient background -->
                <div class="px-4 py-3 bg-gradient-to-br from-purple-600 to-purple-500 text-white">
                  <!-- User name and email -->
                  <div class="mb-1">
                    <p class="text-sm font-semibold tracking-tight">{{ displayName }}</p>
                    <p class="text-xs opacity-90 truncate">{{ authStore.user.email }}</p>
                  </div>
                  
                  <!-- Twitter badge if applicable -->
                  <div v-if="isTwitterUser" class="flex items-center mt-1.5 bg-black/20 rounded-full px-2.5 py-0.5 w-fit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span class="text-xs font-medium">Signed in with Twitter</span>
                  </div>
                </div>
                
                <!-- Menu options with divider -->
                <div class="bg-white backdrop-blur-sm bg-white/95">
                  <!-- Account settings option could be added here -->
                  
                  <!-- Sign out button with enhanced styling -->
                  <button
                    @click="handleSignOut"
                    class="w-full px-4 py-3 text-left flex items-center text-sm font-medium text-gray-700 hover:bg-purple-50 transition-colors duration-150"
                    :disabled="authStore.loading"
                  >
                    <svg v-if="!authStore.loading" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <svg v-if="authStore.loading" class="animate-spin h-4 w-4 mr-2 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ authStore.loading ? 'Signing out...' : 'Sign out' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../../stores/authStore';
import { useRouter } from 'vue-router';
import { computed, ref, onMounted, onUnmounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();
const showProfileDropdown = ref(false);

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

const toggleProfileDropdown = () => {
  showProfileDropdown.value = !showProfileDropdown.value;
};

// Close dropdown when clicking outside
const closeDropdownOnOutsideClick = (event) => {
  if (showProfileDropdown.value && !event.target.closest('.relative')) {
    showProfileDropdown.value = false;
  }
};

// Add/remove event listener
onMounted(() => {
  document.addEventListener('click', closeDropdownOnOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick);
});

const handleSignOut = async () => {
  showProfileDropdown.value = false;
  const { success } = await authStore.signOut();
  if (success) {
    router.push('/');
  }
};
</script>