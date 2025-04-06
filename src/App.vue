<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
    <InstallPrompt />
  </div>
</template>

<script setup>
import InstallPrompt from './components/InstallPrompt.vue';
// Nothing needed here - routing is handled by vue-router
</script>

<style>
/* Global styles can go here */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>
