<template>
  <div v-if="showInstallPrompt" class="fixed bottom-0 left-0 right-0 z-50">
    <div class="max-w-md mx-auto m-4 p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-purple-300/70 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0 bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg shadow">
          <img src="/prayer-icon.svg" alt="PrayerKeeper Icon" class="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-gray-900 tracking-tight">Install PrayerKeeper</h3>
          <p class="text-sm text-gray-700">Add to your home screen for quick access</p>
        </div>
      </div>
      <div class="flex space-x-2">
        <button 
          @click="dismissPrompt" 
          class="text-gray-500 hover:text-gray-700 text-sm px-3 py-1.5 rounded transition-colors"
        >
          Later
        </button>
        <button 
          @click="installApp" 
          class="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm hover:shadow transition-all duration-200"
        >
          Install
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const deferredPrompt = ref(null);
const showInstallPrompt = ref(false);

// Check if the user has previously dismissed the prompt
const hasUserDismissedPrompt = () => {
  return localStorage.getItem('installPromptDismissed') === 'true';
};

// Function to handle beforeinstallprompt event
const handleBeforeInstallPrompt = (e) => {
  // Prevent Chrome from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt.value = e;
  
  // Check if user has previously dismissed the prompt
  if (!hasUserDismissedPrompt()) {
    // Show the install prompt
    showInstallPrompt.value = true;
  }
};

// Function to install the PWA
const installApp = async () => {
  if (!deferredPrompt.value) {
    return;
  }
  
  // Show the install prompt
  deferredPrompt.value.prompt();
  
  // Wait for the user to respond to the prompt
  const { outcome } = await deferredPrompt.value.userChoice;
  
  // Log the outcome
  console.log(`User ${outcome === 'accepted' ? 'accepted' : 'dismissed'} the install prompt`);
  
  // We no longer need the prompt
  deferredPrompt.value = null;
  
  // Hide our custom install prompt
  showInstallPrompt.value = false;
};

// Function to dismiss the install prompt
const dismissPrompt = () => {
  // Hide the prompt
  showInstallPrompt.value = false;
  
  // Remember that the user dismissed the prompt
  localStorage.setItem('installPromptDismissed', 'true');
  
  // Optional: Set a timeout to re-show the prompt after a certain period
  // setTimeout(() => {
  //   localStorage.removeItem('installPromptDismissed');
  // }, 1000 * 60 * 60 * 24 * 7); // 1 week
};

// Set up the event listeners when the component mounts
onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  
  // Check if the app is already installed
  window.addEventListener('appinstalled', () => {
    // Log that the app was installed
    console.log('PWA was installed');
    
    // Hide the prompt
    showInstallPrompt.value = false;
  });
});

// Clean up the event listeners when the component unmounts
onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
});
</script>
