<template>
  <li 
    :class="{
      'border-purple-300 bg-purple-50/30 shadow-md': isEditing,
      'border-purple-100/60 hover:border-purple-200 hover:shadow-md': !isEditing,
      'opacity-60': !category.is_visible
    }" 
    class="relative flex rounded-xl border bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-150 group"
    @dragover.prevent="onDragEnter" 
    @drop="onDrop"
  >
    <div class="p-3 sm:p-4 flex items-center justify-between flex-1" :class="{ 'bg-purple-50/30': isEditing }">
      <!-- Drag Handle (Desktop, only when not editing) -->
      <div
        v-if="!isEditing"
        class="hidden sm:flex text-gray-400 hover:text-gray-600 active:text-purple-600 mr-4 p-1.5 rounded-md hover:bg-gray-100 active:bg-purple-50 transition-all duration-150 cursor-grab"
        draggable="true" 
        @dragstart="onDragStart" 
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
        <div class="flex flex-col space-y-1.5">
          <!-- Up Arrow Button -->
          <button 
            @click="$emit('move', category.id, 'up')"
            class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-purple-600 active:text-purple-700 transition-all duration-200 bg-gray-100 hover:bg-purple-50 active:bg-purple-100 active:scale-95 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
            :disabled="categoryIndex === 0"
            :class="{ 'opacity-40 pointer-events-none': categoryIndex === 0 }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
          </button>

          <!-- Down Arrow Button -->
          <button 
            @click="$emit('move', category.id, 'down')"
            class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-purple-600 active:text-purple-700 transition-all duration-200 bg-gray-100 hover:bg-purple-50 active:bg-purple-100 active:scale-95 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1"
            :disabled="categoryIndex === totalCategories - 1"
            :class="{ 'opacity-40 pointer-events-none': categoryIndex === totalCategories - 1 }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Category Name (View/Edit Mode) -->
      <div class="flex-1 flex items-center min-h-[48px]">
        <!-- Category Name with Prayer Count -->
        <div class="flex-grow ml-3 md:ml-4 flex items-center gap-3" :class="{ 'pr-3 md:pr-4': isEditing }">
          <!-- View Mode -->
          <template v-if="!isEditing">
            <span class="text-gray-900 font-medium">{{ category.name }}</span>
            <span class="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full font-medium flex items-center">
              {{ prayerCount }}
              <span class="hidden sm:inline ml-1">
                {{ prayerCount === 1 ? 'prayer' : 'prayers' }}
              </span>
            </span>
          </template>

          <!-- Edit Mode -->
          <div v-else class="w-full">
            <input 
              v-model="editNameModel" 
              class="w-full px-2 py-1.5 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1" 
              @keyup.enter="$emit('update', category.id, editNameModel)" 
              @keyup.esc="$emit('cancel-edit')" 
              ref="editInput" 
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div
        v-if="!isReorderMode"
        class="flex items-center space-x-3 mr-3 md:mr-4 opacity-80 group-hover:opacity-100 transition-opacity duration-200" 
        :class="{ 'ml-2': isEditing }"
      >
        <!-- Toggle Visibility Button (hidden in edit mode) -->
        <BaseActionButton 
          v-if="!isEditing" 
          @click="$emit('toggle-visibility', category.id)" 
          variant="default"
          :title="category.is_visible ? 'Hide category' : 'Show category'"
        >
          <svg 
            v-if="category.is_visible" 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            fill="none"
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <svg 
            v-else 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
          </svg>
        </BaseActionButton>

        <!-- Edit/Save Button -->
        <BaseActionButton 
          v-if="!isEditing" 
          @click="startEdit" 
          variant="default" 
          title="Edit category"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </BaseActionButton>

        <BaseActionButton 
          v-else 
          @click="$emit('update', category.id, editNameModel)" 
          variant="primary" 
          title="Save changes"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </BaseActionButton>

        <!-- Cancel Button (only in edit mode) -->
        <BaseActionButton 
          v-if="isEditing" 
          @click="$emit('cancel-edit')" 
          variant="default" 
          title="Cancel editing"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </BaseActionButton>

        <!-- Delete Button (only when not editing) -->
        <BaseActionButton 
          v-if="!isEditing" 
          @click="handleDelete"
          variant="danger" 
          :disabled="prayerCount > 0"
          :title="prayerCount > 0 ? 'Cannot delete: contains prayers' : 'Delete category'"
          :class="{ 'opacity-40 cursor-not-allowed': prayerCount > 0 }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </BaseActionButton>
      </div>
    </div>
  </li>
</template>

<script setup>
// Imports
import { ref, computed, onMounted, nextTick } from 'vue';
import { usePrayerStore } from '../../stores/prayerStore';
import BaseActionButton from '../ui/BaseActionButton.vue';

// Props and Emits
const props = defineProps({
  category: {
    type: Object,
    required: true
  },
  editingId: {
    type: String,
    default: null
  },
  isReorderMode: {
    type: Boolean,
    default: false
  },
  categoryIndex: {
    type: Number,
    required: true
  },
  totalCategories: {
    type: Number,
    required: true
  }
});

const emit = defineEmits([
  'update', 
  'toggle-visibility', 
  'delete', 
  'drag-start',
  'drag-enter',
  'drop',
  'edit',
  'cancel-edit',
  'move'
]);

// Store
const prayerStore = usePrayerStore();

// Computed
const isEditing = computed(() => props.editingId === props.category.id);
const prayerCount = computed(() => prayerStore.prayersByCategory(props.category.id, true).length);

// Refs
const editNameModel = ref('');
const editInput = ref(null);

// Methods
const startEdit = () => {
  editNameModel.value = props.category.name;
  emit('edit', props.category);
  
  // Focus the input after DOM update
  nextTick(() => {
    if (editInput.value) {
      editInput.value.focus();
    }
  });
};

const handleDelete = () => {
  if (prayerCount.value > 0) {
    emit('delete-error', 'This category cannot be deleted because it contains prayers. Please move or delete the prayers first.');
  } else {
    emit('delete', props.category);
  }
};

const onDragStart = (event) => {
  emit('drag-start', event, props.category.id);
};

const onDragEnter = (event) => {
  emit('drag-enter', event, props.category.id);
};

const onDrop = (event) => {
  emit('drop', event, props.category.id);
};
</script>
