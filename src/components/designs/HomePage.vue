<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white shadow-sm py-4">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center">
          <div class="text-purple-600 mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-handshake"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>
          </div>
          <h1 class="text-xl font-semibold text-gray-800">PrayerTrack</h1>
        </div>
        <nav class="hidden md:flex space-x-6">
          <a href="#features" class="text-gray-600 hover:text-purple-600 transition">Features</a>
          <a href="#about" class="text-gray-600 hover:text-purple-600 transition">About</a>
          <a href="#contact" class="text-gray-600 hover:text-purple-600 transition">Contact</a>
        </nav>
        <button class="md:hidden text-gray-600" @click="toggleMobileMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
        </button>
      </div>
      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden container mx-auto px-4 pt-4 pb-2 space-y-3">
        <a href="#features" class="block text-gray-600 hover:text-purple-600 transition">Features</a>
        <a href="#about" class="block text-gray-600 hover:text-purple-600 transition">About</a>
        <a href="#contact" class="block text-gray-600 hover:text-purple-600 transition">Contact</a>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-b from-purple-50 to-white py-12 md:py-20">
      <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div class="md:w-1/2 mb-8 md:mb-0">
          <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Keep Track of Your Prayers
          </h2>
          <p class="text-lg text-gray-600 mb-6">
            Organize, manage, and track your prayers for loved ones and those in need. Never forget who needs your spiritual support.
          </p>
          <button @click="showAuthSection('signup')" class="bg-purple-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-purple-700 transition mr-3">
            Get Started
          </button>
          <button @click="showAuthSection('login')" class="bg-white text-purple-600 border border-purple-600 px-6 py-3 rounded-lg hover:bg-purple-50 transition">
            Sign In
          </button>
        </div>
        <div class="md:w-1/2 flex justify-center">
          <img src="https://placehold.co/600x400" alt="Prayer Tracker App" class="rounded-lg shadow-lg max-w-full h-auto" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-12 md:py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">Key Features</h2>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-purple-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-checks"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Organize Your Prayers</h3>
            <p class="text-gray-600">
              Categorize prayers into 'Unbelievers' and 'Brethren in Hardship' for better organization.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-purple-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Easy Management</h3>
            <p class="text-gray-600">
              Add, edit, resolve, and delete prayers with an intuitive interface.
            </p>
          </div>
          <div class="bg-white p-6 rounded-lg shadow-md">
            <div class="text-purple-600 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-smartphone"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Mobile Responsive</h3>
            <p class="text-gray-600">
              Access your prayer list anywhere, on any device with our responsive design.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Authentication Section -->
    <section class="py-12 md:py-20 bg-gray-50" ref="authSectionRef">
      <div class="container mx-auto px-4">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          <div class="flex">
            <button 
              @click="authMode = 'login'" 
              class="flex-1 text-center py-4 font-medium" 
              :class="authMode === 'login' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'">
              Login
            </button>
            <button 
              @click="authMode = 'signup'"
              class="flex-1 text-center py-4 font-medium"
              :class="authMode === 'signup' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'">
              Sign Up
            </button>
          </div>
          
          <!-- Login Form -->
          <div v-if="authMode === 'login'" class="p-6">
            <form @submit.prevent="handleLogin">
              <div class="mb-4">
                <label for="login-username" class="block text-gray-700 text-sm font-medium mb-2">Username</label>
                <input 
                  type="text" 
                  id="login-username" 
                  v-model="loginForm.username" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required>
              </div>
              <div class="mb-6">
                <label for="login-password" class="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  id="login-password" 
                  v-model="loginForm.password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required>
              </div>
              <div class="flex items-center justify-between mb-4">
                <div class="flex items-center">
                  <input type="checkbox" id="remember-me" class="h-4 w-4 text-purple-600">
                  <label for="remember-me" class="ml-2 block text-sm text-gray-700">Remember me</label>
                </div>
                <a href="#" class="text-sm text-purple-600 hover:underline">Forgot password?</a>
              </div>
              <button type="submit" class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition">
                Sign In
              </button>
            </form>
          </div>
          
          <!-- Sign Up Form -->
          <div v-if="authMode === 'signup'" class="p-6">
            <form @submit.prevent="handleSignup">
              <div class="mb-4">
                <label for="signup-username" class="block text-gray-700 text-sm font-medium mb-2">Username</label>
                <input 
                  type="text" 
                  id="signup-username" 
                  v-model="signupForm.username" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required>
              </div>
              <div class="mb-4">
                <label for="signup-email" class="block text-gray-700 text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  id="signup-email" 
                  v-model="signupForm.email" 
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required>
              </div>
              <div class="mb-4">
                <label for="signup-password" class="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <input 
                  type="password" 
                  id="signup-password" 
                  v-model="signupForm.password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required>
                <p class="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
              </div>
              <div class="mb-6">
                <label for="signup-confirm-password" class="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                <input 
                  type="password" 
                  id="signup-confirm-password" 
                  v-model="signupForm.confirmPassword"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required>
              </div>
              <button type="submit" class="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition">
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between">
          <div class="mb-6 md:mb-0">
            <div class="flex items-center">
              <div class="text-purple-400 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-handshake"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"/><path d="m18 15-2-2"/><path d="m15 18-2-2"/></svg>
              </div>
              <h3 class="text-xl font-semibold">PrayerTrack</h3>
            </div>
            <p class="mt-2 text-gray-400">Your companion for spiritual support</p>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 class="text-sm font-semibold uppercase tracking-wider mb-3">Product</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white transition">Features</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition">Pricing</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-sm font-semibold uppercase tracking-wider mb-3">Company</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white transition">About</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition">Blog</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 class="text-sm font-semibold uppercase tracking-wider mb-3">Legal</h4>
              <ul class="space-y-2">
                <li><a href="#" class="text-gray-400 hover:text-white transition">Privacy</a></li>
                <li><a href="#" class="text-gray-400 hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="mt-8 pt-8 border-t border-gray-700 text-sm text-gray-400 text-center">
          &copy; {{ new Date().getFullYear() }} PrayerTrack. All rights reserved.
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Mobile menu state
const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

// Authentication mode state (login or signup)
const authMode = ref('login');
const authSectionRef = ref(null);

// Form state
const loginForm = ref({
  username: '',
  password: ''
});

const signupForm = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Handle login form submission
const handleLogin = () => {
  // This would connect to your backend authentication system
  console.log('Login submitted:', loginForm.value);
  
  // For demo purposes, just show an alert
  alert('Login functionality would be implemented with backend integration');
};

// Handle signup form submission
const handleSignup = () => {
  // Validation
  if (signupForm.value.password !== signupForm.value.confirmPassword) {
    alert("Passwords don't match!");
    return;
  }
  
  if (signupForm.value.password.length < 8) {
    alert("Password must be at least 8 characters long");
    return;
  }
  
  // This would connect to your backend authentication system
  console.log('Signup submitted:', signupForm.value);
  
  // For demo purposes, just show an alert
  alert('Signup functionality would be implemented with backend integration');
};

// Function to scroll to authentication section
const showAuthSection = (mode) => {
  authMode.value = mode;
  
  // Scroll to auth section
  if (authSectionRef.value) {
    authSectionRef.value.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style>
/* You can add additional custom styles here if needed */
</style>