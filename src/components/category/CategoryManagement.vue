<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-900 via-purple-600 to-white relative overflow-hidden">
    <!-- Background overlay gradient with subtle pattern -->
    <div class="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-600/50 to-white/30 opacity-90"></div>
    <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
    
    <!-- Navigation Bar -->
    <NavBar class="relative z-10" />

    <!-- Main Content -->
    <main class="relative z-10 max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Page Header -->
      <PageHeader 
        title="Manage Categories" 
        subtitle="Organize your prayers by creating and managing custom categories"
      >
        <template #actions>
          <router-link 
            to="/dashboard" 
            class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-white/20 backdrop-blur-sm text-white shadow-inner hover:bg-white/30 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </router-link>
        </template>
      </PageHeader>
      
      <!-- Loading State -->
      <LoadingState v-if="isInitialLoading" message="Loading categories..." />

      <!-- Error State -->
      <ErrorState 
        v-else-if="categoryStore.error" 
        :message="categoryStore.error" 
        @dismiss="categoryStore.resetError" 
      />

      <!-- Category Management -->
      <div v-else class="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-purple-100/50 overflow-hidden transition-all duration-300 mb-8">
        <!-- Add Category Form -->
        <div class="p-6 border-b border-purple-100/50">
          <h2 class="text-xl font-bold text-purple-900 mb-4 tracking-tight">Add New Category</h2>
          <form @submit.prevent="addCategory" class="flex flex-col sm:flex-row gap-4">
            <BaseInput
              id="new-category"
              label="Category Name"
              v-model="newCategoryName"
              placeholder="Enter category name"
              required
              class="flex-1"
            />
            <div class="flex items-end">
              <BaseButton 
                type="submit" 
                variant="primary"
                :loading="isAddingCategory"
                :disabled="!newCategoryName.trim()"
                @click="addCategory"
              >
                Add Category
              </BaseButton>
            </div>
          </form>
        </div>

        <!-- Category List -->
        <div class="p-6">
          <h2 class="text-xl font-bold text-purple-900 mb-4 tracking-tight">Your Categories</h2>
          <p v-if="!categoryStore.categories.length" class="text-gray-500 italic mb-4">
            You don't have any categories yet. Add your first category above.
          </p>
          
          <TransitionGroup 
            tag="ul" 
            class="space-y-3"
            enter-active-class="transition-all duration-500 ease-out"
            leave-active-class="transition-all duration-500 ease-in"
            enter-from-class="opacity-0 -translate-x-8 scale-95"
            enter-to-class="opacity-100 translate-x-0 scale-100"
            leave-from-class="opacity-100 translate-x-0 scale-100"
            leave-to-class="opacity-0 -translate-x-8 scale-95"
            move-class="transition-transform duration-500"
          >
            <li 
              v-for="category in categoryStore.sortedCategories" 
              :key="category.id"
              class="bg-white rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300"
              :class="{ 'opacity-60': !category.is_visible }"
            >
              <div class="p-4 flex items-center justify-between">
                <!-- Drag Handle -->
                <div class="cursor-grab text-gray-400 hover:text-gray-600 mr-3" @mousedown="startDrag(category.id)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                  </svg>
                </div>
                
                <!-- Category Name (View Mode) -->
                <div v-if="!editingId || editingId !== category.id" class="flex-1 flex items-center">
                  <span class="text-gray-800 font-medium">{{ category.name }}</span>
                  <span 
                    v-if="!category.is_visible" 
                    class="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    Hidden
                  </span>
                </div>
                
                <!-- Category Name (Edit Mode) -->
                <div v-else class="flex-1">
                  <input 
                    type="text" 
                    v-model="editingName" 
                    class="w-full px-3 py-2 border border-purple-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-400"
                    @keyup.enter="updateCategory(category.id)"
                    @keyup.esc="cancelEdit"
                    ref="editInput"
                  />
                </div>
                
                <!-- Actions -->
                <div class="flex items-center space-x-2">
                  <!-- Toggle Visibility Button -->
                  <button 
                    @click="toggleVisibility(category.id)"
                    class="text-gray-500 hover:text-purple-600 transition-colors duration-200 p-1 rounded-full hover:bg-purple-50"
                    :title="category.is_visible ? 'Hide category' : 'Show category'"
                  >
                    <svg v-if="category.is_visible" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                  
                  <!-- Edit/Save Button -->
                  <button 
                    v-if="!editingId || editingId !== category.id"
                    @click="startEdit(category)"
                    class="text-gray-500 hover:text-purple-600 transition-colors duration-200 p-1 rounded-full hover:bg-purple-50"
                    title="Edit category"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    v-else
                    @click="updateCategory(category.id)"
                    class="text-green-500 hover:text-green-600 transition-colors duration-200 p-1 rounded-full hover:bg-green-50"
                    title="Save changes"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  
                  <!-- Delete Button -->
                  <button 
                    @click="confirmDelete(category)"
                    class="text-red-500 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
                    title="Delete category"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </li>
          </TransitionGroup>
        </div>
      </div>

      <!-- Instructions Card -->
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-purple-100/50 transition-all duration-300 hover:shadow-xl hover:bg-white/90">
        <h2 class="text-xl font-bold text-purple-900 mb-4 tracking-tight">Tips for Managing Categories</h2>
        <ul class="space-y-3 text-gray-700">
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span><strong>Add</strong> new categories to organize your prayers by type, person, or any grouping that makes sense to you.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
            <span><strong>Drag</strong> categories to reorder them on your dashboard.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span><strong>Hide</strong> categories that are empty or that you don't want to see on your dashboard.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span><strong>Edit</strong> category names at any time to better reflect their purpose.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span><strong>Delete</strong> categories you no longer need. Note that prayers in deleted categories will need to be reassigned.</span>
          </li>
        </ul>
      </div>
    </main>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="showDeleteModal = false"
    >
      <div 
        class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all"
        @click.stop
      >
        <h3 class="text-lg font-bold text-gray-900 mb-2">Delete Category</h3>
        <p class="text-gray-600 mb-4">
          Are you sure you want to delete the category "{{ categoryToDelete?.name }}"?
          <span class="block mt-2 text-sm text-red-600 font-medium">This action cannot be undone.</span>
        </p>
        <div class="flex justify-end space-x-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
          >
            Cancel
          </button>
          <button 
            @click="deleteCategory"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center"
            :disabled="categoryStore.loading"
          >
            <svg v-if="categoryStore.loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useCategoryStore } from '../../stores/categoryStore';
import NavBar from '../navbar/NavBar.vue';
import BaseInput from '../ui/BaseInput.vue';
import BaseButton from '../ui/BaseButton.vue';
import PageHeader from '../ui/PageHeader.vue';
import LoadingState from '../ui/LoadingState.vue';
import ErrorState from '../ui/ErrorState.vue';

// Initialize store
const categoryStore = useCategoryStore();

// State for adding new category
const newCategoryName = ref('');
const isAddingCategory = ref(false);

// State for editing category
const editingId = ref(null);
const editingName = ref('');
const editInput = ref(null);

// State for delete confirmation
const showDeleteModal = ref(false);
const categoryToDelete = ref(null);

// State for drag and drop
const draggedCategoryId = ref(null);

// State for initial loading
const isInitialLoading = ref(true);

// Add a new category
const addCategory = async () => {
  if (!newCategoryName.value.trim()) return;
  
  isAddingCategory.value = true;
  const result = await categoryStore.addCategory({ name: newCategoryName.value.trim() });
  isAddingCategory.value = false;
  if (result.success) {
    newCategoryName.value = '';
  }
};

// Start editing a category
const startEdit = (category) => {
  editingId.value = category.id;
  editingName.value = category.name;
  
  // Focus the input after the DOM updates
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus();
    }
  });
};

// Cancel editing
const cancelEdit = () => {
  editingId.value = null;
  editingName.value = '';
};

// Update a category
const updateCategory = async (id) => {
  if (!editingName.value.trim()) return;
  
  const result = await categoryStore.updateCategory(id, { name: editingName.value.trim() });
  if (result.success) {
    cancelEdit();
  }
};

// Toggle category visibility
const toggleVisibility = async (id) => {
  await categoryStore.toggleCategoryVisibility(id);
};

// Confirm delete
const confirmDelete = (category) => {
  categoryToDelete.value = category;
  showDeleteModal.value = true;
};

// Delete a category
const deleteCategory = async () => {
  if (!categoryToDelete.value) return;
  
  const result = await categoryStore.deleteCategory(categoryToDelete.value.id);
  if (result.success) {
    showDeleteModal.value = false;
    categoryToDelete.value = null;
  }
};

// Drag and drop functionality
const startDrag = (id) => {
  draggedCategoryId.value = id;
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
};

const onDrag = (e) => {
  // This would be implemented with a proper drag and drop library
  // For now, we're just capturing the events
};

const endDrag = () => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  draggedCategoryId.value = null;
  
  // In a real implementation, we would reorder the categories here
  // based on the drop position
};

// Implement actual drag and drop reordering
// This is a simplified version - in a real app, you would use a library like vue-draggable
const reorderCategories = async (newOrder) => {
  await categoryStore.reorderCategories(newOrder);
};

// Fetch categories when component mounts
onMounted(async () => {
  if (!categoryStore.hasFetched) {
    isInitialLoading.value = true;
    await categoryStore.fetchCategories();
  }
  isInitialLoading.value = false;
});
</script>

<style scoped>
/* Add subtle grid pattern to background */
.bg-grid-pattern {
  background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
