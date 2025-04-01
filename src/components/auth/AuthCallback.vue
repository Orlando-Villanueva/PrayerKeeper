<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="text-center max-w-lg px-4">
      <div v-if="!error && !emailMissingError">
        <h2 class="text-xl font-semibold mb-2">Completing sign in...</h2>
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p v-if="debug" class="mt-2 text-xs text-gray-500">{{ debug }}</p>
      </div>
      
      <!-- Twitter Email Missing Error -->
      <div v-if="emailMissingError" class="mt-4 max-w-md mx-auto bg-amber-50 border border-amber-200 rounded-lg p-6">
        <svg class="h-12 w-12 text-amber-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3 class="text-xl font-semibold mt-3 text-gray-900 text-center">Email Access Required</h3>
        <p class="mt-3 text-gray-700 text-center">
          We need access to your email address to create your account. This helps us secure your account and send important notifications.
        </p>
        <div class="mt-6 space-y-4">
          <button 
            @click="goToLogin" 
            class="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Try Another Sign In Method
          </button>
          <p class="text-sm text-gray-600 text-center">
            Please ensure you've granted email access permissions when authenticating with Twitter.
          </p>
        </div>
      </div>
      
      <!-- Generic Error -->
      <div v-if="error && !emailMissingError" class="mt-4">
        <svg class="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
        <h3 class="text-xl font-medium mt-3 text-gray-900">Authentication Failed</h3>
        <p class="mt-2 text-gray-600">{{ error }}</p>
        <button 
          @click="goToLogin" 
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Back to Login
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../db/supabase';

const router = useRouter();
const authStore = useAuthStore();
const error = ref(null);
const emailMissingError = ref(false);
const debug = ref('');

const goToLogin = () => {
  router.push('/auth');
};

onMounted(() => {
  // Check for errors in URL
  const urlParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  
  const urlError = urlParams.get('error');
  const hashError = hashParams.get('error');
  const errorDescription = urlParams.get('error_description') || hashParams.get('error_description');
  
  if (urlError || hashError) {
    console.error('OAuth error:', errorDescription);
    
    if (errorDescription && (
      errorDescription.includes('Error getting user email') ||
      errorDescription.includes('email') ||
      errorDescription.includes('Email')
    )) {
      emailMissingError.value = true;
    } else {
      error.value = errorDescription || 'Authentication failed';
    }
    return;
  }
  
  debug.value = `Processing authentication...`;
  
  // Use a timeout to give Supabase time to process the auth
  setTimeout(async () => {
    try {
      // Explicitly get the session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw sessionError;
      }
      
      // Refresh the auth state
      await authStore.initialize();
      
      // Check if the user is now authenticated
      if (authStore.isAuthenticated) {
        // Redirect to dashboard on success
        router.push('/dashboard');
      } else {
        // If not authenticated after refresh, try again with a longer delay
        setTimeout(async () => {
          await authStore.initialize();
          if (authStore.isAuthenticated) {
            router.push('/dashboard');
          } else {
            error.value = 'Authentication failed. Please try again.';
          }
        }, 2000);
      }
    } catch (err) {
      console.error('Auth callback error:', err);
      
      if (err.message && err.message.includes('email')) {
        emailMissingError.value = true;
      } else {
        error.value = `Authentication failed: ${err.message}`;
      }
    }
  }, 1000);
});
</script> 