<template>
  <div v-if="modelValue" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-start justify-center min-h-screen pt-4 sm:px-2 pb-20 text-center sm:items-center sm:p-0">
      <!-- Background overlay with gradient -->
      <div class="fixed inset-0" aria-hidden="true" @click="closeModal">
        <div class="absolute inset-0 bg-gradient-to-b from-purple-900/90 via-purple-800/85 to-purple-700/80 backdrop-blur-sm"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white/90 backdrop-blur-sm rounded-xl text-left overflow-hidden shadow-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative w-[94%] mx-auto max-h-[90vh] overflow-y-auto border border-white/20">
        <!-- Close button -->
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none z-10 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <!-- Content wrapper -->
        <div class="sm:px-5 px-3 pt-6 pb-2">
          <div class="text-center">
            <h3 class="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight leading-tight" id="modal-title">
              {{ isEditMode ? 'Edit Prayer' : 'Add New Prayer' }}
            </h3>
            <p class="text-gray-600 mt-2 tracking-wide text-sm">
              {{ isEditMode ? 'Update your prayer request details' : 'Create a new prayer request' }}
            </p>
          </div>
              
          <!-- Category Tabs (Only shown in Add mode) -->
          <div v-if="!isEditMode" class="mt-3 mb-3">
            <div class="flex space-x-2 justify-center">
              <button 
                @click="prayer.category = 'unbelievers'" 
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200" 
                :class="prayer.category === 'unbelievers' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                Unbelievers
              </button>
              <button 
                @click="prayer.category = 'brethren'"
                class="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                :class="prayer.category === 'brethren' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
              >
                Believers
              </button>
            </div>
          </div>
              
          <div class="mt-3">
            <form id="prayerForm" @submit.prevent="savePrayer" class="space-y-3 px-0.5">
              <BaseInput
                id="person_name"
                label="Name"
                v-model="prayer.person_name"
                name="person_name"
                required
                placeholder="Enter person's name"
              />
              
              <BaseTextarea
                id="note"
                label="Prayer Details (Optional)"
                v-model="prayer.note"
                name="note"
                rows="4"
                placeholder="Add details about your prayer request"
              />
              
              <!-- Resolved checkbox for edit mode -->
              <div v-if="isEditMode" class="flex items-center mt-3">
                <input 
                  id="resolved" 
                  type="checkbox" 
                  v-model="prayer.resolved" 
                  class="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded transition-colors duration-200"
                >
                <label for="resolved" class="ml-2 block text-sm text-gray-700">
                  Mark as {{ prayer.category === 'unbelievers' ? 'converted' : 'resolved' }}
                </label>
              </div>
            </form>
          </div>
        </div>
        <div class="sm:px-5 px-3 py-4 flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 border-t border-gray-100">
          <BaseButton 
            variant="secondary"
            @click="closeModal"
            class="w-full sm:w-auto"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </template>
            Cancel
          </BaseButton>
          <BaseButton
            variant="primary"
            type="submit"
            form="prayerForm"
            :loading="prayerStore.loading"
            :disabled="!isFormValid"
            class="w-full sm:w-auto"
          >
            <template #icon v-if="!prayerStore.loading">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </template>
            {{ isEditMode ? 'Update Prayer' : 'Add Prayer' }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePrayerStore } from '../../stores/prayerStore';
import BaseInput from '../ui/BaseInput.vue';
import BaseTextarea from '../ui/BaseTextarea.vue';
import BaseButton from '../ui/BaseButton.vue';

const props = defineProps({
  modelValue: Boolean,
  prayerData: Object,
  isEditMode: Boolean
});

const emit = defineEmits(['update:modelValue', 'save']);

const prayerStore = usePrayerStore();
const prayer = ref({ ...props.prayerData });

// Update local prayer data when props change
watch(() => props.prayerData, (newValue) => {
  prayer.value = { ...newValue };
}, { deep: true });

// Close the modal
const closeModal = () => {
  emit('update:modelValue', false);
};

// Form validation
const isFormValid = computed(() => {
  return prayer.value && prayer.value.person_name && prayer.value.person_name.trim().length > 0;
});

// Save the current prayer
const savePrayer = async () => {
  if (!isFormValid.value) {
    alert('Please enter a name');
    return;
  }

  emit('save', prayer.value);
};
</script> 