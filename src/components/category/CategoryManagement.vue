<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-900 via-purple-600 to-white relative overflow-hidden">
    <!-- Background overlay gradient with subtle pattern -->
    <div class="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-600/50 to-white/30 opacity-90"></div>
    <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
    
    <!-- Navigation Bar -->
    <NavBar class="relative z-10" />

    <!-- Main Content -->
    <main class="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Page Header -->
      <PageHeader 
        title="Manage Categories" 
        subtitle="Organize your prayers with custom categories"
      >
        <template #actions>
          <div class="flex gap-3">
            <ActionPill to="/dashboard" class="min-w-[180px] justify-center">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </template>
              Back to Dashboard
            </ActionPill>
          </div>
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
      <div v-else class="bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-purple-100/50 overflow-hidden transition-all duration-300 mb-6 sm:mb-10">

        <!-- Category List -->
        <div class="px-3 md:px-4 py-3">
          <div class="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 gap-3">
            <h2 class="text-xl font-medium text-purple-900 tracking-tight">Your Categories</h2>
            <div class="flex gap-3">
              <BaseButton
                v-if="categoryStore.categories.length > 1"
                variant="secondary"
                size="small"
                class="flex-1 sm:flex-auto text-sm flex items-center justify-center px-4 py-2 border border-purple-200 shadow-sm sm:hidden"
                @click="toggleReorderMode"
              >
                <template v-if="!isReorderMode">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                  Reorder
                </template>
                <template v-else>
                  Done
                </template>
              </BaseButton>
              <BaseButton
                variant="primary"
                size="small"
                class="flex-1 sm:flex-auto text-sm flex items-center justify-center px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white"
                @click="openAddModal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Category
              </BaseButton>
            </div>
          </div>
          <p v-if="!categoryStore.categories.length" class="text-gray-500 italic mb-4">
            You don't have any categories yet. Add your first category above.
          </p>
          
          <TransitionGroup 
            tag="ul" 
            class="space-y-3 px-0.5"
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
              class="bg-white rounded-lg border border-purple-100 shadow-sm hover:shadow-md transition-all duration-300 group overflow-hidden"
              :class="{ 
                'opacity-60': !category.is_visible,
                'border-purple-200 bg-white/95': isReorderMode,
                'border-purple-300 bg-purple-50/30 shadow-md': editingId === category.id
              }"
              @dragover.prevent
              @dragenter.prevent="handleDragEnter($event, category.id)"
              @drop="handleDrop($event, category.id)"
            >
              <div class="p-4 sm:p-5 flex items-center justify-between">

                <!-- Drag Handle (Desktop) -->
                <div 
                  class="hidden sm:flex cursor-grab text-gray-400 hover:text-gray-600 mr-4 p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-150" 
                  draggable="true"
                  @dragstart="startDrag($event, category.id)"
                  @dragover.prevent
                  @dragenter.prevent
                  title="Drag to reorder"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                  </svg>
                </div>
                
                <!-- Reorder Controls (Left Side) -->
                <div v-if="isReorderMode" class="flex items-center mr-3 sm:hidden">
                  <div class="flex flex-col space-y-1">
                    <!-- Up Arrow Button -->
                    <button 
                      @click="moveCategory(category.id, 'up')"
                      class="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-purple-600 transition-colors duration-200 bg-gray-100 hover:bg-purple-50 active:scale-95 rounded-full"
                      :disabled="getCategoryIndex(category.id) === 0"
                      :class="{ 'opacity-40 pointer-events-none': getCategoryIndex(category.id) === 0 }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    
                    <!-- Down Arrow Button -->
                    <button 
                      @click="moveCategory(category.id, 'down')"
                      class="w-9 h-9 flex items-center justify-center text-gray-600 hover:text-purple-600 transition-colors duration-200 bg-gray-100 hover:bg-purple-50 active:scale-95 rounded-full"
                      :disabled="getCategoryIndex(category.id) === categoryStore.sortedCategories.length - 1"
                      :class="{ 'opacity-40 pointer-events-none': getCategoryIndex(category.id) === categoryStore.sortedCategories.length - 1 }"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <!-- Category Name (View/Edit Mode) -->
                <div class="flex-1 flex items-center min-h-[48px]">
                  <!-- View Mode -->
                  <span v-if="!editingId || editingId !== category.id" class="font-medium text-gray-800 text-base ml-3">{{ category.name }}</span>
                  
                  <!-- Edit Mode -->
                  <div v-else class="w-full ml-3">
                    <input 
                      type="text" 
                      v-model="editingName" 
                      class="w-full border-purple-300 rounded-md shadow-sm focus:border-purple-400 focus:ring focus:ring-purple-200 focus:ring-opacity-50 py-2 px-3 bg-purple-50/70" 
                      @keyup.enter="updateCategory(category.id)"
                      @keyup.esc="cancelEdit"
                      ref="editInput"
                    />
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="flex items-center space-x-1.5 sm:space-x-3">
                  <!-- Toggle Visibility Button -->
                  <button 
                    @click="toggleVisibility(category.id)"
                    class="text-gray-500 hover:text-purple-600 transition-colors duration-200 p-2 rounded-full hover:bg-purple-50 active:bg-purple-100 active:scale-95"
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
                    class="text-gray-500 hover:text-purple-600 transition-colors duration-200 p-2 rounded-full hover:bg-purple-50 active:bg-purple-100 active:scale-95"
                    title="Edit category"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button 
                    v-else
                    @click="updateCategory(category.id)"
                    class="text-green-500 hover:text-green-600 transition-colors duration-200 p-1 rounded-full hover:bg-green-50 bg-white shadow-sm"
                    title="Save changes"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  
                  <!-- Delete Button -->
                  <button 
                    @click="deleteCategory(category)"
                    class="p-1.5 rounded-full text-gray-500 hover:text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors duration-200"
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
      <div class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 sm:p-8 border border-purple-100/50 transition-all duration-300 hover:shadow-xl hover:bg-white/90 mt-3 sm:mt-0">
        <h2 class="text-xl font-medium text-purple-900 mb-4 sm:mb-6 tracking-tight">Tips for Managing Categories</h2>
        <ul class="space-y-4 text-gray-700 text-sm sm:text-base">
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span><strong>Add</strong> new categories to organize your prayers by type, person, or any grouping that makes sense to you.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
            <span><strong>Drag</strong> categories to reorder them on your dashboard.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span><strong>Hide</strong> categories that are empty or that you don't want to see on your dashboard.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span><strong>Edit</strong> category names at any time to better reflect their purpose.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span><strong>Delete</strong> categories you no longer need. Note that prayers in deleted categories will need to be reassigned.</span>
          </li>
        </ul>
      </div>
    </main>

    <!-- Category Modal Component -->
    <CategoryModal 
      v-model="showAddModal"
      @save="addCategory"
    />
    
  </div>
</template>

<script setup>
// Imports
import { ref, onMounted, nextTick } from 'vue';
import { useCategoryStore } from '../../stores/categoryStore';
import NavBar from '../navbar/NavBar.vue';
import BaseButton from '../ui/BaseButton.vue';
import PageHeader from '../ui/PageHeader.vue';
import LoadingState from '../ui/LoadingState.vue';
import ErrorState from '../ui/ErrorState.vue';
import ActionPill from '../ui/ActionPill.vue';
import CategoryModal from './CategoryModal.vue';

// Store initialization
const categoryStore = useCategoryStore();

// State management
const editingId = ref(null);
const editingName = ref('');
const editInput = ref(null);
const showAddModal = ref(false);
const draggedCategoryId = ref(null);
const isInitialLoading = ref(true);
const isReorderMode = ref(false);

// Category modal functions
const openAddModal = () => {
  showAddModal.value = true;
};

const addCategory = async (categoryName) => {
  if (!categoryName.trim()) return;
  
  await categoryStore.addCategory({
    name: categoryName.trim(),
    is_visible: true
  });
  return true;
};

const startEdit = (category) => {
  editingId.value = category.id;
  editingName.value = category.name;
  nextTick(() => {
    if (editInput.value) editInput.value.focus();
  });
};

const updateCategory = async (id) => {
  if (!editingName.value.trim()) return;
  await categoryStore.updateCategory(id, { name: editingName.value.trim() });
  editingId.value = null;
  editingName.value = '';
};

const cancelEdit = () => {
  editingId.value = null;
  editingName.value = '';
};

// Delete category function
const deleteCategory = async (category) => {
  // Show a confirmation dialog
  if (confirm(`Are you sure you want to delete the category "${category.name}"? This action cannot be undone.`)) {
    const result = await categoryStore.deleteCategory(category.id);
    if (!result.success) {
      // Error is already set in the store and will be displayed by the ErrorState component
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top to show the error message
    }
  }
};

// Visibility toggle
const toggleVisibility = async (id) => {
  await categoryStore.toggleCategoryVisibility(id);
};

// Mobile reordering functions
const toggleReorderMode = () => {
  isReorderMode.value = !isReorderMode.value;
};

const getCategoryIndex = (id) => {
  return categoryStore.sortedCategories.findIndex(cat => cat.id === id);
};

const moveCategory = async (id, direction) => {
  // Get the current order
  const currentOrder = categoryStore.sortedCategories.map(cat => cat.id);
  const currentIndex = currentOrder.indexOf(id);
  
  // Determine target index
  const targetIndex = direction === 'up' 
    ? Math.max(0, currentIndex - 1) 
    : Math.min(currentOrder.length - 1, currentIndex + 1);
  
  // Don't proceed if we're already at the edge
  if (currentIndex === targetIndex) return;
  
  // Create new order
  const newOrder = [...currentOrder];
  newOrder.splice(currentIndex, 1); // Remove from current position
  newOrder.splice(targetIndex, 0, id); // Insert at new position
  
  // Update order in database
  await reorderCategories(newOrder);
};

// Drag and drop (simplified)
const startDrag = (event, id) => {
  draggedCategoryId.value = id;
  event.dataTransfer.effectAllowed = 'move';
  // Add a ghost image effect to the dragged element
  event.dataTransfer.setDragImage(event.target.closest('li'), 10, 10);
};

const handleDragEnter = (event, id) => {
  // Only proceed if we're dragging a category and it's not the same one
  if (draggedCategoryId.value && draggedCategoryId.value !== id) {
    // Add a visual indicator that this is a drop target
    event.currentTarget.classList.add('bg-purple-50', 'border-purple-200');
  }
};

const handleDrop = async (event, targetId) => {
  event.preventDefault();
  // Remove any visual indicators
  document.querySelectorAll('li').forEach(el => {
    el.classList.remove('bg-purple-50', 'border-purple-200');
  });
  
  // Only proceed if we're dragging a category and it's not the same one
  if (draggedCategoryId.value && draggedCategoryId.value !== targetId) {
    // Get the current order of categories
    const currentOrder = categoryStore.sortedCategories.map(cat => cat.id);
    // Find the positions
    const draggedIndex = currentOrder.indexOf(draggedCategoryId.value);
    const dropIndex = currentOrder.indexOf(targetId);
    
    if (draggedIndex !== -1 && dropIndex !== -1) {
      // Create new order by moving the dragged item
      const newOrder = [...currentOrder];
      newOrder.splice(draggedIndex, 1); // Remove from old position
      newOrder.splice(dropIndex, 0, draggedCategoryId.value); // Insert at new position
      
      // Save the new order
      await reorderCategories(newOrder);
    }
  }
  
  // Reset dragged item
  draggedCategoryId.value = null;
};

const reorderCategories = async (newOrder) => {
  await categoryStore.reorderCategories(newOrder);
};

// Add dragend event to document to handle case when dragging ends outside of a valid drop target
onMounted(async () => {
  if (!categoryStore.hasFetched) {
    isInitialLoading.value = true;
    await categoryStore.fetchCategories();
  }
  isInitialLoading.value = false;
  
  // Add global dragend event listener
  document.addEventListener('dragend', () => {
    // Reset dragged item
    draggedCategoryId.value = null;
    // Remove any visual indicators
    document.querySelectorAll('li').forEach(el => {
      el.classList.remove('bg-purple-50', 'border-purple-200');
    });
  });
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
