<template>
  <div v-if="modelValue" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Background overlay -->
      <div class="fixed inset-0" aria-hidden="true" @click="closeModal">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full relative">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ isEditMode ? 'Edit Prayer' : 'Add New Prayer' }}
              </h3>
              <div class="mt-4">
                <form @submit.prevent="savePrayer">
                  <div class="mb-4">
                    <label for="person_name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input 
                      type="text" 
                      id="person_name" 
                      v-model="prayer.person_name" 
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div class="mb-4">
                    <label for="note" class="block text-sm font-medium text-gray-700">Note (Optional)</label>
                    <textarea 
                      id="note" 
                      v-model="prayer.note" 
                      rows="3" 
                      class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            @click="savePrayer" 
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            :disabled="prayerStore.loading"
          >
            {{ isEditMode ? 'Save Changes' : 'Add Prayer' }}
          </button>
          <button 
            type="button" 
            @click="closeModal" 
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePrayerStore } from '../stores/prayerStore';

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

// Save the current prayer
const savePrayer = async () => {
  if (!prayer.value.person_name.trim()) {
    alert('Please enter a name');
    return;
  }

  emit('save', prayer.value);
};
</script> 