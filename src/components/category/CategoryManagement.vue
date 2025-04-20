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
      <PageHeader title="Manage Categories" subtitle="Organize your prayers with custom categories">
        <template #actions>
          <div class="flex gap-3">
            <ActionPill to="/dashboard" class="min-w-[180px] justify-center" ref="dashboardPillRef">
              <template #icon>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
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
      <ErrorState v-if="categoryStore.error" :message="categoryStore.error" @dismiss="categoryStore.resetError" />
      <ErrorState v-if="deleteError" :message="deleteError" @dismiss="deleteError = null" />

      <!-- Category Management -->
      <BaseCard v-else title="Your Categories"
        headerClass="bg-gradient-to-r from-purple-300 to-purple-200 border-b border-purple-300/70"
        class="mb-6 sm:mb-10">

        <!-- Subtitle slot -->
        <template #subtitle>
          <p v-if="!categoryStore.categories.length" class="text-gray-600 italic">
            You don't have any categories yet. Add your first category above.
          </p>
        </template>

        <!-- Action slot with Add/Done Button based on mode -->
        <template #action>
          <BaseButton @click="openAddModal" variant="primary"
            class="shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-1px] self-start flex-shrink-0 px-3 py-1.5 bg-purple-600 text-white">
            <span class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Category
            </span>
          </BaseButton>
        </template>

        <div v-if="!categoryStore.categories.length">
          <!-- Empty state is handled by the subtitle slot -->
        </div>
        <div v-else-if="categoryStore.sortedCategories.length > 0" class="overflow-visible py-2">
          <TransitionGroup tag="ul" name="list" class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
            enter-from-class="opacity-0 -translate-x-8"
            enter-active-class="transition-all duration-300 ease-out"
            enter-to-class="opacity-100 translate-x-0" leave-from-class="opacity-100 translate-x-0"
            leave-to-class="opacity-0 -translate-x-8" move-class="transition-transform duration-500"
            @after-leave="onCategoriesLeave">

            <CategoryItem v-for="category in categoryStore.sortedCategories" :key="category.id" :category="category"
              :editing-id="editingId" :is-reorder-mode="isReorderMode" :category-index="getCategoryIndex(category.id)"
              :total-categories="categoryStore.sortedCategories.length" @update="updateCategory"
              @toggle-visibility="toggleVisibility" @delete="deleteCategory" @drag-start="startDrag"
              @drag-enter="handleDragEnter" @drop="handleDrop" @edit="startEdit" @cancel-edit="cancelEdit"
              @move="moveCategory" @delete-error="showDeleteError" />
          </TransitionGroup>
        </div>

        <!-- Bottom reorder button area - when not in reorder mode -->
        <template #footer>
          <transition name="fade-slide" appear>
            <div v-if="categoryStore.categories.length > 1 && !isReorderMode && showReorderButton"
              class="pb-3 px-4 flex justify-center sm:hidden">
              <button
                class="w-full bg-white rounded-lg py-3 text-gray-700 font-medium flex items-center justify-center shadow-sm border border-gray-200 hover:bg-gray-50 active:scale-[0.98] transition-all duration-150"
                @click="toggleReorderMode">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                Reorder
              </button>
            </div>
          </transition>
        </template>
      </BaseCard>

      <!-- Floating reorder mode action bar -->
      <transition enter-active-class="transform transition ease-out duration-300"
        enter-from-class="opacity-0 translate-y-4" enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transform transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4">
        <div v-if="isReorderMode" class="fixed bottom-0 inset-x-0 z-50 pb-safe">
          <div
            class="bg-gradient-to-r from-purple-600 to-purple-500 shadow-lg border-t border-purple-400/30 px-4 py-3 flex items-center justify-between">
            <div class="text-white font-medium flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
              </svg>
              <span>Reorder Mode</span>
            </div>
            <BaseButton variant="secondary"
              class="bg-white/90 hover:bg-white text-purple-700 border-white/70 backdrop-blur-sm font-semibold px-5 py-2"
              @click="toggleReorderMode">
              Done
            </BaseButton>
          </div>
        </div>
      </transition>

      <!-- Instructions Card -->
      <div
        class="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-5 sm:p-8 border border-purple-100/50 transition-all duration-300 hover:shadow-xl hover:bg-white/90 mt-3 sm:mt-0">
        <h2 class="text-xl font-medium text-purple-900 mb-4 sm:mb-6 tracking-tight">Tips for Managing Categories</h2>
        <ul class="space-y-4 text-gray-700 text-sm sm:text-base">
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span><strong>Add</strong> new categories to organize your prayers by type, person, or any grouping that
              makes
              sense to you.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
            </svg>
            <span><strong>Reorder</strong> categories to customize your dashboard: <span class="hidden sm:inline">drag
                and
                drop</span><span class="sm:hidden">tap "Reorder" and use arrow buttons</span> to change their
              position.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span><strong>Hide</strong> categories that are empty or that you don't want to see on your
              dashboard.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <span><strong>Edit</strong> category names at any time to better reflect their purpose.</span>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span><strong>Delete</strong> categories you no longer need. Categories containing prayers cannot be
              deleted.</span>
          </li>
        </ul>
      </div>
    </main>

    <!-- Category Modal Component -->
    <CategoryModal v-model="showAddModal" @save="addCategory" />

  </div>
</template>

<script setup>
// Imports
import { ref, onMounted, watch } from 'vue';
import { useCategoryStore } from '../../stores/categoryStore';
import { usePrayerStore } from '../../stores/prayerStore';
import NavBar from '../navbar/NavBar.vue';
import PageHeader from '../ui/PageHeader.vue';
import LoadingState from '../ui/LoadingState.vue';
import ErrorState from '../ui/ErrorState.vue';
import BaseButton from '../ui/BaseButton.vue';
import BaseActionButton from '../ui/BaseActionButton.vue';
import ActionPill from '../ui/ActionPill.vue';
import BaseCard from '../ui/BaseCard.vue';
import CategoryModal from './CategoryModal.vue';
import CategoryItem from './CategoryItem.vue';

// Store initialization
const categoryStore = useCategoryStore();
const prayerStore = usePrayerStore();

// State management
const editingId = ref(null);
const editingName = ref("");
const editInput = ref(null);
const showAddModal = ref(false);
const isInitialLoading = ref(false);
const isPrayersLoading = ref(false);
const isReorderMode = ref(false);
const showReorderButton = ref(true);

const draggedCategoryId = ref(null);
const deleteError = ref(null);

// Category modal functions
const openAddModal = () => {
  showAddModal.value = true;
};

const dashboardPillRef = ref(null);

// Stop shine if the last category is deleted
watch(
  () => categoryStore.categories.length,
  (newLen, oldLen) => {
    if (oldLen > 0 && newLen === 0 && dashboardPillRef.value?.stopShine) {
      dashboardPillRef.value.stopShine();
    }
  }
);


const addCategory = async (categoryName) => {
  try {
    const wasEmpty = categoryStore.categories.length === 0;
    await categoryStore.addCategory({
      name: categoryName.trim(),
      is_visible: true
    });
    // If there are no prayers, trigger shine on every category add
    if (prayerStore.prayers.length === 0 && dashboardPillRef.value?.shine) {
      setTimeout(() => {
        dashboardPillRef.value.shine();
      }, 300); // slight delay for smoothness
    }
    // Close the modal
    showAddModal.value = false;
  } catch (error) {
    console.error('Failed to add category', error);
  }
};

const startEdit = (category) => {
  editingId.value = category.id;
};

const updateCategory = async (id, newName) => {
  if (!newName || newName.trim() === '') return;
  await categoryStore.updateCategory(id, { name: newName.trim() });
  editingId.value = null;
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
  if (isReorderMode.value) {
    showReorderButton.value = false;
  }
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

const showDeleteError = (msg) => {
  deleteError.value = msg;
};

// Add dragend event to document to handle case when dragging ends outside of a valid drop target
onMounted(async () => {
  // Create a function to load all required data
  const loadData = async () => {
    const loadingTasks = [];

    // Load categories if needed
    if (!categoryStore.hasFetched) {
      isInitialLoading.value = true;
      loadingTasks.push(categoryStore.fetchCategories());
    }

    // Load prayers if needed
    if (!prayerStore.hasFetched) {
      isPrayersLoading.value = true;
      loadingTasks.push(prayerStore.fetchPrayers());
    }

    // Wait for all data to load
    await Promise.all(loadingTasks);

    isInitialLoading.value = false;
    isPrayersLoading.value = false;
  };

  await loadData();

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
// Show Reorder button after categories leave (fallback)
function onCategoriesLeave() {
  if (!isReorderMode.value) {
    setTimeout(() => {
      showReorderButton.value = true;
    }, 10);
  }
}

// Ensure Reorder button returns after exiting reorder mode
watch(isReorderMode, (newVal, oldVal) => {
  if (oldVal && !newVal) {
    setTimeout(() => {
      showReorderButton.value = true;
    }, 320); // Match transition duration
  }
});

</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
.fade-slide-enter-to, .fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>


<style scoped>
/* Add subtle grid pattern to background */
.bg-grid-pattern {
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
