<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {{ title }}
      </h2>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="emit('submit')">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <div class="mt-1">
              <input
                id="email"
                v-model="emailValue"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1">
              <input
                id="password"
                v-model="passwordValue"
                name="password"
                type="password"
                :autocomplete="isLogin ? 'current-password' : 'new-password'"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
            <div class="text-sm text-red-700">{{ authStore.error }}</div>
          </div>

          <div>
            <button
              type="submit"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="authStore.loading"
            >
              {{ authStore.loading ? loadingText : submitText }}
            </button>
          </div>
        </form>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">
                {{ switchText }}
              </span>
            </div>
          </div>

          <div class="mt-6">
            <a :href="switchLink" class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-indigo-600 hover:bg-gray-50">
              {{ switchLinkText }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

const props = defineProps({
  title: {
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
  isLogin: {
    type: Boolean,
    default: false
  },
  submitText: {
    type: String,
    required: true
  },
  loadingText: {
    type: String, 
    required: true
  },
  switchText: {
    type: String,
    required: true
  },
  switchLink: {
    type: String,
    required: true
  },
  switchLinkText: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['update:email', 'update:password', 'submit']);

const emailValue = computed({
  get: () => props.email,
  set: (value) => emit('update:email', value)
});

const passwordValue = computed({
  get: () => props.password,
  set: (value) => emit('update:password', value)
});
</script> 