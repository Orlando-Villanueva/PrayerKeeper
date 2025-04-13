<template>
  <div class="overflow-hidden h-full flex flex-col">
    <div class="px-3 md:px-4 py-3 sm:px-8" :class="headerClass">
      <div class="flex justify-between items-center gap-2">
        <div class="flex flex-col">
          <h2 class="text-xl font-bold tracking-tight text-gray-900">{{ title }}</h2>
          <div class="h-6 flex items-end"> 
            <button 
              v-if="resolvedCount > 0"
              @click="toggleShowResolved"
              class="inline-flex items-center text-xs font-medium text-purple-600 hover:text-purple-800 focus:outline-none focus:underline transition-colors duration-150"
            >
              <span v-if="showResolved" class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
                Hide Resolved ({{ resolvedCount }})
              </span>
              <span v-else class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
                Show Resolved ({{ resolvedCount }})
              </span>
            </button>
          </div>
        </div>
        <BaseButton 
          @click="openAddModal" 
          variant="primary"
          class="shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-1px] self-center flex-shrink-0 px-3 py-1.5"
        >
          <span class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Prayer
          </span>
        </BaseButton>
      </div>
    </div>
    <div class="px-3 md:px-4 py-2 sm:px-8 flex-1 overflow-y-auto">
      <div v-if="prayers.length === 0" class="text-center py-10 px-4">
        <div class="bg-white/90 backdrop-blur-sm rounded-xl p-5 max-w-md mx-auto shadow-lg border border-white/20">
          <div class="bg-gradient-to-br from-purple-500 to-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">No prayers added yet</h3>
          <p class="text-gray-600 mb-4">Start praying and make a difference in someone's life.</p>
          <BaseButton 
            @click="openAddModal" 
            variant="primary"
            class="mx-auto"
          >
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </template>
            Add Your First Prayer
          </BaseButton>
        </div>
      </div>
      <ul v-else class="divide-y divide-purple-100 -mx-1">
        <li v-for="prayer in prayers" :key="prayer.id" class="py-1.5 group hover:bg-purple-50/50 rounded-lg px-1 mx-1 my-0.5">
          <div class="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2">
            <div class="flex-1 min-w-0 mb-1 sm:mb-0">
              <p class="text-base font-semibold text-gray-900 tracking-wide" :class="{ 'line-through text-gray-500': prayer.resolved }">
                {{ prayer.person_name }}
              </p>
              <p v-if="prayer.note" class="mt-1 text-sm text-gray-600 leading-relaxed" :class="{ 'line-through text-gray-400': prayer.resolved }">
                {{ prayer.note }}
              </p>
              <span v-if="prayer.resolved" class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1.5 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Resolved
              </span>
            </div>
            <div class="flex space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200 ml-1">
              <button 
                @click="prayerActions.toggleResolved(prayer)" 
                class="p-1 rounded-full text-gray-500 hover:text-green-600 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 transition-colors duration-200"
                :title="prayer.resolved ? 'Mark as unresolved' : 'Mark as resolved'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button 
                @click="openEditModal(prayer)" 
                class="p-1 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200"
                title="Edit prayer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click="prayerActions.deletePrayer(prayer)" 
                class="p-1 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-all duration-200"
                title="Delete prayer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from 'vue';
import { usePrayerStore } from '../../stores/prayerStore';
import BaseButton from '../ui/BaseButton.vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  categoryId: {
    type: String,
    required: true
  },
  headerClass: {
    type: String,
    default: 'bg-gradient-to-r from-purple-300 to-purple-200 border-b border-purple-300/70'
  }
});

const prayerStore = usePrayerStore();
const modalFunctions = inject('modalFunctions');
const prayerActions = inject('prayerActions');

const showResolved = ref(false);

// Toggle show resolved with proper handling
const toggleShowResolved = () => {
  // Use nextTick to ensure DOM updates properly
  showResolved.value = !showResolved.value;
};

// Get filtered prayers from store
const prayers = computed(() => 
  prayerStore.prayersByCategory(props.categoryId, showResolved.value)
);

// Get resolved count from store
const resolvedCount = computed(() => 
  prayerStore.resolvedCountByCategory(props.categoryId)
);

const headerClass = computed(() => {
  return props.headerClass;
});

// Functions that interact with the modal
const openAddModal = () => {
  modalFunctions.openAddModal(props.categoryId);
};

const openEditModal = (prayer) => {
  modalFunctions.openEditModal(prayer);
};
</script>