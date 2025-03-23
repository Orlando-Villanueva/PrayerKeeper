<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div class="px-4 py-5 sm:px-6" :class="headerClass">
      <div class="flex justify-between items-center">
        <h2 class="text-lg font-medium text-gray-900">{{ title }}</h2>
        <button 
          @click="openAddModal" 
          class="px-3 py-1 rounded-md text-sm font-medium text-white"
          :class="buttonClass"
        >
          Add Prayer
        </button>
      </div>
    </div>
    <div class="px-4 py-2">
      <div v-if="prayers.length === 0" class="text-center py-4 text-gray-500">
        No prayers added yet
      </div>
      <ul v-else class="divide-y divide-gray-200">
        <li v-for="prayer in prayers" :key="prayer.id" class="py-3">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0 ">
              <p class="text-sm font-medium text-gray-900" :class="{ 'line-through': prayer.resolved }">
                {{ prayer.person_name }}
              </p>
              <p v-if="prayer.note" class="mt-1 text-sm text-gray-500" :class="{ 'line-through': prayer.resolved }">
                {{ prayer.note }}
              </p>
              <span v-if="prayer.resolved" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                Resolved
              </span>
            </div>
            <div class="flex space-x-2">
              <button 
                @click="prayerActions.toggleResolved(prayer)" 
                class="p-1 rounded-full text-gray-400 hover:text-green-500 focus:outline-none"
                :title="prayer.resolved ? 'Mark as unresolved' : 'Mark as resolved'"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
              <button 
                @click="openEditModal(prayer)" 
                class="p-1 rounded-full text-gray-400 hover:text-blue-500 focus:outline-none"
                title="Edit prayer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button 
                @click="prayerActions.deletePrayer(prayer)" 
                class="p-1 rounded-full text-gray-400 hover:text-red-500 focus:outline-none"
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
import { computed, inject } from 'vue';
import { usePrayerStore } from '../../stores/prayerStore';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'indigo'
  }
});

const prayerStore = usePrayerStore();
const modalFunctions = inject('modalFunctions');
const prayerActions = inject('prayerActions');

// Get appropriate prayers based on category
const prayers = computed(() => 
  props.category === 'unbelievers' ? prayerStore.unbelievers : prayerStore.brethren
);

const headerClass = computed(() => {
  if (props.color === 'purple') return 'bg-purple-50';
  return 'bg-indigo-50'; // Default to indigo
});

const buttonClass = computed(() => {
  if (props.color === 'purple') return 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500';
  return 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'; // Default to indigo
});

// Functions that interact with the modal
const openAddModal = () => {
  modalFunctions.openAddModal(props.category);
};

const openEditModal = (prayer) => {
  modalFunctions.openEditModal(prayer);
};
</script> 