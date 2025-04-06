<template>
  <div class="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-white/20 transition-all duration-200 hover:shadow-xl hover:translate-y-[-1px]">
    <!-- Welcome message instead of tabs -->
    <div class="p-7 pb-2 text-center">
      <h2 class="text-3xl font-bold text-gray-800 tracking-tight leading-tight" v-if="mode === 'login'">Welcome back</h2>
      <h2 class="text-3xl font-bold text-gray-800 tracking-tight leading-tight" v-else>Create account</h2>
      <p class="text-gray-600 mt-3 tracking-wide text-sm" v-if="mode === 'login'">Login to your PrayerKeeper account</p>
      <p class="text-gray-600 mt-3 tracking-wide text-sm" v-else>Sign up for a new PrayerKeeper account</p>
    </div>
    
    <div class="px-7 py-5">
      <form @submit.prevent="$emit('submit')">
        <BaseInput
          :id="mode === 'login' ? 'login-email' : 'signup-email'"
          label="Email"
          :modelValue="email"
          @update:modelValue="$emit('update:email', $event)"
          :name="'email'"
          type="email"
          :autocomplete="'email'"
          :required="true"
        />

        <BaseInput
          :id="mode === 'login' ? 'login-password' : 'signup-password'"
          label="Password"
          :modelValue="password"
          @update:modelValue="$emit('update:password', $event)"
          :name="'password'"
          type="password"
          :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
          :required="true"
        >
          <template v-if="mode === 'login'" #button>
            <button
              type="button"
              class="text-sm text-purple-600 hover:text-purple-800 transition-all duration-200"
              @click="$emit('update:mode', 'reset')"
            >
              Forgot your password?
            </button>
          </template>
        </BaseInput>
        
        <div v-if="error" class="rounded-md bg-red-50/80 backdrop-blur-sm p-4 mb-4 mt-3 border border-red-100/50 shadow-sm transition-all duration-300">
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <div class="text-sm font-medium text-red-700">{{ error }}</div>
          </div>
        </div>
        
        <BaseButton 
          type="submit" 
          :disabled="loading"
          :loading="loading"
          variant="primary"
          class="mt-2 w-full shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-1px]"
          @click="$emit('submit')"
        >
          {{ submitButtonText }}
        </BaseButton>
        
        <!-- Sign up prompt at the bottom -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600" v-if="mode === 'login'">
            Don't have an account? 
            <button 
              type="button" 
              class="text-purple-600 font-medium hover:text-purple-800 transition-all duration-200 ml-1"
              @click="$emit('update:mode', 'signup')"
            >
              Sign up
            </button>
          </p>
          <p class="text-sm text-gray-600" v-else>
            Already have an account? 
            <button 
              type="button" 
              class="text-purple-600 font-medium hover:text-purple-800 transition-all duration-200 ml-1"
              @click="$emit('update:mode', 'login')"
            >
              Login
            </button>
          </p>
        </div>
      </form>
      
      <!-- Social Login Section -->
      <div class="mt-8">
        <div class="flex items-center my-4">
          <div class="flex-grow border-t border-gray-200"></div>
          <div class="mx-4 text-gray-500 text-sm font-medium tracking-wide">Or continue with</div>
          <div class="flex-grow border-t border-gray-200"></div>
        </div>

        <div class="mt-4">
          <button @click="$emit('twitter-sign-in')" :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-gray-200 rounded-md shadow-sm bg-white/80 backdrop-blur-sm text-sm font-medium text-gray-700 hover:bg-white hover:shadow-lg hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400 hover:cursor-pointer transition-all duration-200">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            Sign in with X
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '../ui/BaseButton.vue';
import BaseInput from '../ui/BaseInput.vue';

defineProps({
  mode: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  error: {
    type: String,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  submitButtonText: {
    type: String,
    required: true
  }
});

defineEmits(['update:mode', 'update:email', 'update:password', 'submit', 'twitter-sign-in']);
</script> 