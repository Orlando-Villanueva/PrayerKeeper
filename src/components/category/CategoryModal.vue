<template>
  <BaseModal v-model="isOpen">
    <!-- Title slot -->  
    <template #title>Add New Category</template>
    
    <!-- Subtitle slot -->  
    <template #subtitle>Create a new category to organize your prayers</template>
    
    <!-- Content slot -->  
    <template #content>
      <div class="mt-6">
        <form id="categoryForm" @submit.prevent="saveCategory" class="space-y-3 px-0.5">
          <BaseInput
            id="category_name"
            label="Category Name"
            v-model="categoryName"
            name="category_name"
            required
            placeholder="Enter category name"
          />
        </form>
      </div>
    </template>
    
    <!-- Footer slot -->  
    <template #footer>
      <BaseButton 
        variant="ghost"
        @click="closeModal"
        class="w-full sm:w-auto py-2.5"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </template>
        Cancel
      </BaseButton>
      
      <BaseButton 
        type="submit"
        form="categoryForm"
        :loading="isSubmitting"
        class="w-full sm:w-auto py-2.5"
      >
        <template #icon>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </template>
        Add Category
      </BaseButton>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed } from 'vue';
import BaseModal from '../ui/BaseModal.vue';
import BaseInput from '../ui/BaseInput.vue';
import BaseButton from '../ui/BaseButton.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:modelValue', 'save']);

// Create a computed property to handle v-model with the BaseModal
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const categoryName = ref('');
const isSubmitting = ref(false);

function closeModal() {
  emit('update:modelValue', false);
}

// Form validation
const isFormValid = computed(() => {
  return categoryName.value.trim().length > 0;
});

async function saveCategory() {
  if (!isFormValid.value) {
    alert('Please enter a category name');
    return;
  }

  try {
    isSubmitting.value = true;
    
    // Emit the category name to be created by the parent component
    emit('save', categoryName.value.trim());
    
    // Reset the form
    categoryName.value = '';
    
    // Close the modal
    closeModal();
  } catch (error) {
    console.error('Error creating category:', error);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
