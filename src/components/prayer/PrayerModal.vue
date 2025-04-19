<template>
  <BaseModal v-model="isOpen">
    <!-- Title slot -->  
    <template #title>{{ isEditMode ? 'Edit Prayer' : 'Add New Prayer' }}</template>
    
    <!-- Subtitle slot -->  
    <template #subtitle>{{ isEditMode ? 'Update your prayer request details' : 'Create a new prayer request' }}</template>
    
    <!-- Content slot -->  
    <template #content>
      <!-- Category Selection -->
      <div class="mt-3 mb-3">
        <BaseSelect
          id="category"
          label="Category"
          v-model="prayer.category_id"
          name="category"
          required
          placeholder="Select a category"
        >
          <option 
            v-for="category in categoryStore.sortedVisibleCategories" 
            :key="category.id" 
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </BaseSelect>
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
            :rows="4"
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
              Mark as resolved
            </label>
          </div>
        </form>
      </div>
    </template>
    
    <!-- Footer slot -->  
    <template #footer>
      <BaseButton 
        variant="ghost"
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
        class="w-full sm:w-auto"
      >
        <template #icon v-if="!prayerStore.loading">
          <svg v-if="isEditMode" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </template>
        {{ isEditMode ? 'Update Prayer' : 'Add Prayer' }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { usePrayerStore } from '../../stores/prayerStore';
import { useCategoryStore } from '../../stores/categoryStore';
import BaseModal from '../ui/BaseModal.vue';
import BaseInput from '../ui/BaseInput.vue';
import BaseTextarea from '../ui/BaseTextarea.vue';
import BaseButton from '../ui/BaseButton.vue';
import BaseSelect from '../ui/BaseSelect.vue';

const props = defineProps({
  modelValue: Boolean,
  prayerData: Object,
  isEditMode: Boolean
});

const emit = defineEmits(['update:modelValue', 'save']);

const prayerStore = usePrayerStore();
const categoryStore = useCategoryStore();
const prayer = ref({ ...props.prayerData });

// Create a computed property to handle v-model with the BaseModal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

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

  if (!prayer.value.category_id) {
    alert('Please select a category');
    return;
  }

  emit('save', prayer.value);
};
</script> 