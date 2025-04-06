<template>
  <div class="min-h-screen flex flex-col relative">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0 overflow-hidden">
      <!-- Fallback background color that shows before image loads -->
      <div class="w-full h-full bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 absolute inset-0"></div>
      
      <!-- Background image with fade-in effect -->
      <img 
        src="/img/homepage_background_optimized.jpg" 
        alt="Background" 
        class="w-full h-full object-cover absolute inset-0 transition-all duration-700 ease-in-out scale-[1.01]"
        :class="{'opacity-100 scale-100': imageLoaded, 'opacity-0': !imageLoaded}"
        @load="imageLoaded = true" 
      />
      
      <!-- Gradient overlay with enhanced colors -->
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-purple-600/50 to-white/30"></div>
    </div>
    
    <!-- Header - Minimal -->
    <header class="py-4 px-6 relative z-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="text-white mr-2">
            <path
              d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            <path
              d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
            <path d="m18 15-2-2" />
            <path d="m15 18-2-2" />
          </svg>
          <h1 class="text-xl font-semibold text-white">PrayerKeeper</h1>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex items-center justify-center px-3 md:px-6 py-4 relative z-10">
      <!-- Slot for main content -->
      <slot></slot>
    </main>

    <!-- Minimal Footer -->
    <footer class="py-3 text-center text-sm text-white/80 relative z-10">
    &copy; {{ new Date().getFullYear() }} PrayerKeeper
  </footer>
</div>
</template>

<script setup>
import { ref } from 'vue';

const imageLoaded = ref(false);
</script>