<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation Bar -->
    <NavBar />

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="prayerStore.loading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="prayerStore.error" class="bg-red-50 p-4 rounded-md mb-6">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{{ prayerStore.error }}</h3>
            <div class="mt-2">
              <button @click="prayerStore.resetError" class="text-sm text-red-600 hover:text-red-500">Dismiss</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Prayer Grid -->
      <div v-else class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <!-- Prayers for Unbelievers -->
        <PrayerList 
          title="Unbelievers"
          category="unbelievers"
          color="indigo"
        />

        <!-- Prayers for Brethren -->
        <PrayerList 
          title="Brethren in hardship"
          category="brethren"
          color="purple"
        />
      </div>
    </main>

    <!-- Prayer Modal Component -->
    <PrayerModal 
      v-model="isModalVisible"
      :prayer-data="currentPrayer"
      :is-edit-mode="isEditMode"
      @save="savePrayer"
    />
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue';
import { usePrayerStore } from '../stores/prayerStore';
import NavBar from './navbar/NavBar.vue';
import PrayerList from './prayer/PrayerList.vue';
import PrayerModal from './prayer/PrayerModal.vue';

// Initialize stores
const prayerStore = usePrayerStore();

// Modal state
const isModalVisible = ref(false);
const isEditMode = ref(false);
const currentPrayer = ref({
  id: null,
  person_name: '',
  note: '',
  category: 'unbelievers',
  resolved: false
});

// Open modal for adding a new prayer
const openAddModal = (category) => {
  isEditMode.value = false;
  currentPrayer.value = {
    person_name: '',
    note: '',
    category,
    resolved: false
  };
  isModalVisible.value = true;
};

// Open modal for editing an existing prayer
const openEditModal = (prayer) => {
  isEditMode.value = true;
  currentPrayer.value = { ...prayer };
  isModalVisible.value = true;
};

// Save the current prayer
const savePrayer = async (prayerData) => {
  if (isEditMode.value) {
    // Update existing prayer without showing loading state
    const { id, ...updates } = prayerData;
    prayerStore.updatePrayer(id, updates, false);
  } else {
    // Add new prayer, this will still show loading as it's a new item
    await prayerStore.addPrayer(prayerData);
  }

  isModalVisible.value = false;
};

// Toggle prayer resolved status
const toggleResolved = async (prayer) => {
  // Don't await the promise to avoid loading state
  prayerStore.resolvePrayer(prayer.id, !prayer.resolved);
};

// Delete a prayer
const deletePrayer = async (prayer) => {
  if (confirm('Are you sure you want to delete this prayer?')) {
    // Don't await to avoid loading state
    prayerStore.deletePrayer(prayer.id);
  }
};

// Provide modal functions to child components
provide('modalFunctions', {
  openAddModal,
  openEditModal
});

// Provide prayer action functions to child components
provide('prayerActions', {
  toggleResolved,
  deletePrayer
});

// Fetch prayers when component mounts
onMounted(async () => {
  await prayerStore.fetchPrayers();
});
</script>
