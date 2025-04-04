<template>
  <AuthLayout>
    <div class="w-full max-w-md">
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-4">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ success ? 'Password Updated' : 'Set New Password' }}
          </h3>

          <template v-if="!success">
            <form @submit.prevent="handleSubmit">
              <BaseInput
                id="new-password"
                label="New Password"
                v-model="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
              />

              <BaseInput
                id="confirm-password"
                label="Confirm Password"
                v-model="confirmPassword"
                name="confirmPassword"
                type="password"
                autocomplete="new-password"
                required
              />
              
              <div v-if="authStore.error" class="rounded-md bg-red-50 p-4 mb-3">
                <div class="text-sm text-red-700">{{ authStore.error }}</div>
              </div>

              <div v-if="validationError" class="rounded-md bg-red-50 p-4 mb-3">
                <div class="text-sm text-red-700">{{ validationError }}</div>
              </div>
              
              <BaseButton 
                type="submit" 
                :disabled="authStore.loading"
                :loading="authStore.loading"
                variant="primary"
                class="mt-4 w-full"
              >
                {{ authStore.loading ? 'Updating Password...' : 'Update Password' }}
              </BaseButton>
            </form>
          </template>

          <template v-else>
            <p class="text-sm text-gray-600 mb-4">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            
            <BaseButton
              type="button"
              variant="primary"
              class="w-full"
              @click="handleSuccessRedirect"
            >
              Go to Login
            </BaseButton>
          </template>
        </div>
      </div>
    </div>
  </AuthLayout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import BaseButton from '../ui/BaseButton.vue';
import BaseInput from '../ui/BaseInput.vue';
import AuthLayout from '../layout/AuthLayout.vue';

const router = useRouter();
const authStore = useAuthStore();

const password = ref('');
const confirmPassword = ref('');
const validationError = ref('');
const success = ref(false);

// Parse hash parameters from URL
const getHashParams = () => {
  const hash = window.location.hash.substring(1);
  if (!hash) return {};

  try {
    const params = {};
    const pairs = hash.split('&');
    
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
    
    return params;
  } catch (e) {
    console.error('Error parsing hash parameters', e);
    return {};
  }
};

const handleSubmit = async () => {
  try {
    validationError.value = '';
    authStore.resetError();

    // Validate passwords match
    if (password.value !== confirmPassword.value) {
      validationError.value = 'Passwords do not match';
      return;
    }

    // Validate password length
    if (password.value.length < 6) {
      validationError.value = 'Password must be at least 6 characters long';
      return;
    }

    // Get hash parameters
    const params = getHashParams();
    const accessToken = params.access_token;
    
    if (!accessToken) {
      validationError.value = 'No access token found. Please request a new password reset link.';
      return;
    }

    // Set the session with the access token for the update operation
    const { success: sessionSet } = await authStore.setSession(
      accessToken, 
      params.refresh_token || ''
    );

    if (!sessionSet) {
      throw new Error(authStore.error || 'Failed to authenticate with the provided token');
    }

    // Use authStore to update the password
    const { success: passwordUpdated } = await authStore.updatePassword(password.value);

    if (!passwordUpdated) {
      throw new Error(authStore.error || 'Failed to update password');
    }

    // Password update successful
    success.value = true;
    // Remove the hash from the URL
    window.history.replaceState(null, '', window.location.pathname);
    
    // Make sure to sign out any session that might have been created
    await authStore.signOut();
  } catch (err) {
    validationError.value = err.message || 'Failed to update password. Please try again.';
    console.error('Password update error:', err);
  }
};

const handleSuccessRedirect = async () => {
  // Make sure to sign out before redirecting to login
  await authStore.signOut();
  router.push('/');
};
</script> 