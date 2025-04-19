<template>
  <BaseCard :title="title" :headerClass="headerClass" class="h-full">
    <!-- Subtitle slot with resolved toggle -->
    <template #subtitle>
      <button v-if="resolvedCount > 0" @click="toggleShowResolved"
        class="inline-flex items-center text-xs font-medium text-purple-600 hover:text-purple-800 focus:outline-none focus:underline transition-colors duration-150 mt-0.5">
        <span v-if="showResolved" class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          Hide Resolved ({{ resolvedCount }})
        </span>
        <span v-else class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
          Show Resolved ({{ resolvedCount }})
        </span>
      </button>
    </template>

    <!-- Action slot for add button -->
    <template #action>
      <BaseButton @click="openAddModal" variant="primary"
        class="shadow-md hover:shadow-lg transition-all duration-200 hover:translate-y-[-1px] self-start flex-shrink-0 px-3 py-1.5">
        <span class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Prayer
        </span>
      </BaseButton>
    </template>
    <TransitionGroup v-show="showPrayers" tag="ul" class="divide-y divide-purple-100 -mx-1"
      enter-active-class="transition-all duration-[${TRANSITION_DURATION}] ease-out" leave-active-class="transition-all duration-[${TRANSITION_DURATION}] ease-in"
      enter-from-class="opacity-0 -translate-x-8 scale-95" enter-to-class="opacity-100 translate-x-0 scale-100"
      leave-from-class="opacity-100 translate-x-0 scale-100" leave-to-class="opacity-0 -translate-x-8 scale-95"
      move-class="transition-transform duration-[${TRANSITION_DURATION}]">
      <li v-for="prayer in prayers" :key="prayer.id" class="py-2 sm:py-4 group hover:bg-purple-50/50 rounded-lg px-2">
        <div class="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2">
          <div class="flex-1 min-w-0 mb-1 sm:mb-0">
            <div class="flex items-center gap-2 flex-wrap">
              <p class="text-base font-semibold text-gray-900 tracking-wide mb-0"
                :class="{ 'line-through text-gray-500': prayer.resolved }">
                {{ prayer.person_name }}
              </p>
              <span v-if="prayer.resolved"
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Resolved
              </span>
            </div>
            <p v-if="prayer.note" class="mt-1 text-sm text-gray-600 leading-relaxed"
              :class="{ 'line-through text-gray-400': prayer.resolved }">
              {{ prayer.note }}
            </p>
          </div>
          <div class="flex space-x-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200 ml-1">
            <BaseActionButton @click="prayerActions.toggleResolved(prayer)" variant="success"
              :title="prayer.resolved ? 'Mark as unresolved' : 'Mark as resolved'">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </BaseActionButton>
            <BaseActionButton @click="openEditModal(prayer)" variant="primary" title="Edit prayer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </BaseActionButton>
            <BaseActionButton @click="prayerActions.deletePrayer(prayer)" variant="danger" title="Delete prayer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </BaseActionButton>
          </div>
        </div>
      </li>
    </TransitionGroup>

    <Transition
      enter-active-class="transition-all duration-[${TRANSITION_DURATION}] ease-out"
      leave-active-class="transition-all duration-[${TRANSITION_DURATION}] ease-in"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95">
      <div v-if="showEmptyState" class="text-center py-10 px-4">
        <div class="bg-white/90 backdrop-blur-sm rounded-xl p-5 max-w-md mx-auto shadow-lg border border-white/20">
          <div
            class="bg-gradient-to-br from-purple-500 to-purple-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800 mb-2">No prayers added yet</h3>
          <p class="text-gray-600 mb-4">Start praying and make a difference in someone's life.</p>
          <BaseButton @click="openAddModal" variant="primary" class="mx-auto">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </template>
            Add Your First Prayer
          </BaseButton>
        </div>
      </div>
    </Transition>

  </BaseCard>
</template>

<script setup>
import { computed, inject, ref, onUnmounted, watch } from 'vue';

// Animation timing constant for all transitions (ms)
const TRANSITION_DURATION = 500;
import { usePrayerStore } from '../../stores/prayerStore';
import BaseButton from '../ui/BaseButton.vue';
import BaseActionButton from '../ui/BaseActionButton.vue';
import BaseCard from '../ui/BaseCard.vue';

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

// Get resolved count from store
const resolvedCount = computed(() =>
  prayerStore.resolvedCountByCategory(props.categoryId)
);

// Toggle show resolved with proper handling
const toggleShowResolved = () => {
  showResolved.value = !showResolved.value;
  // If toggling off, and there are no more resolved prayers, ensure showResolved is false
  if (!showResolved.value && resolvedCount.value === 0) {
    showResolved.value = false;
  }
};

// Get filtered prayers from store
const prayers = computed(() =>
  prayerStore.prayersByCategory(props.categoryId, showResolved.value)
);

// Auto-hide resolved prayers if resolvedCount drops to 0
watch(
  () => resolvedCount.value,
  (newCount) => {
    if (showResolved.value && newCount === 0) {
      showResolved.value = false;
    }
  }
);

// Initialize state based on whether prayers exist
const showEmptyState = ref(prayers.value.length === 0);
const showPrayers = ref(prayers.value.length > 0);
let emptyStateTimeout = null;
let showPrayersTimeout = null;

onUnmounted(() => {
  if (emptyStateTimeout) {
    clearTimeout(emptyStateTimeout);
    emptyStateTimeout = null;
  }
  if (showPrayersTimeout) {
    clearTimeout(showPrayersTimeout);
    showPrayersTimeout = null;
  }
});

watch(
  () => prayers.value.length,
  (newLength) => {
    if (newLength === 0) {
      // Allow time for the last prayer to animate out (500ms) before hiding prayer list
      if (showPrayersTimeout) {
        clearTimeout(showPrayersTimeout);
        showPrayersTimeout = null;
      }
      showPrayersTimeout = setTimeout(() => {
        showPrayers.value = false;
        // Then wait before showing empty state
        emptyStateTimeout = setTimeout(() => {
          showEmptyState.value = true;
        }, TRANSITION_DURATION); // Uses animation constant
      }, TRANSITION_DURATION); // Wait for leave animation to complete (uses animation constant)
    } else {
      // First show the prayers (especially important for the first prayer)
      showPrayers.value = true;
      
      // When going from 0 to 1 prayer, let the empty state remain briefly
      // This prevents the empty gap while waiting for prayers to appear
      if (emptyStateTimeout) {
        clearTimeout(emptyStateTimeout);
        emptyStateTimeout = null;
      }
      
      // Delay hiding the empty state until the prayer is starting to appear
      emptyStateTimeout = setTimeout(() => {
        showEmptyState.value = false;
      }, 250);
    }
  },
  { immediate: true }
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