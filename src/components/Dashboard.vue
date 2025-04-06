<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-900 via-purple-600 to-white relative overflow-hidden">
    <!-- Background overlay gradient with subtle pattern -->
    <div class="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-600/50 to-white/30 opacity-90"></div>
    <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
    
    <!-- Navigation Bar -->
    <NavBar class="relative z-10" />

    <!-- Main Content -->
    <main class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Dashboard Header -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">Prayer Dashboard</h1>
        <p class="mt-3 text-lg tracking-wide text-white/90 drop-shadow font-medium">Keep track of your prayer requests and celebrations</p>
        <div class="mt-6 flex justify-center space-x-4">
          <span class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ currentDate }}
          </span>
        </div>
      </div>
      
      <!-- Loading State -->
      <div v-if="prayerStore.loading" class="flex flex-col justify-center items-center py-16">
        <div class="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-white mb-4"></div>
        <p class="text-white/80 text-lg animate-pulse">Loading prayers...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="prayerStore.error" class="bg-red-50/90 p-6 rounded-xl shadow-lg mb-8 backdrop-blur-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-4">
            <h3 class="text-base font-medium text-red-800">{{ prayerStore.error }}</h3>
            <div class="mt-3">
              <button @click="prayerStore.resetError" class="text-sm font-medium text-red-600 hover:text-red-500 transition-colors duration-200">Dismiss</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Prayer Grid -->
      <div v-else class="grid grid-cols-1 gap-10 md:grid-cols-2">
        <!-- Prayers for Unbelievers -->
        <PrayerList 
          title="Unbelievers"
          category="unbelievers"
          header-class="bg-gradient-to-r from-purple-300 to-purple-200 border-b border-purple-300/70"
          class="bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-sm rounded-xl shadow-xl border border-purple-100/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] hover:border-purple-200"
        />

        <!-- Prayers for Brethren -->
        <PrayerList 
          title="Brethren"
          category="brethren"
          header-class="bg-gradient-to-r from-purple-300 to-purple-200 border-b border-purple-300/70"
          class="bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-sm rounded-xl shadow-xl border border-purple-100/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] hover:border-purple-200"
        />
      </div>
      
      <!-- Bible Verse -->
      <BibleVerse
        text="Brethren, pray for us."
        reference="1 Thessalonians 5:25"
        class="mt-12 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-purple-100/50 transition-all duration-300 hover:shadow-xl hover:bg-white/70 hover:border-purple-200"
      />
    </main>

    <!-- Prayer Modal Component -->
    <PrayerModal 
      v-model="isModalVisible"
      :prayer-data="currentPrayer"
      :is-edit-mode="isEditMode"
      @save="savePrayer"
      class="z-50"
    />
  </div>
</template>

<script setup>
import { ref, provide, onMounted, computed } from 'vue';
import { usePrayerStore } from '../stores/prayerStore';
import NavBar from './navbar/NavBar.vue';
import PrayerList from './prayer/PrayerList.vue';
import PrayerModal from './prayer/PrayerModal.vue';
import BibleVerse from './ui/BibleVerse.vue';

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

// Format current date
const currentDate = computed(() => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-US', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).format(now);
});

// Fetch prayers when component mounts
onMounted(async () => {
  await prayerStore.fetchPrayers();
});
</script>

<style>
/* Add subtle grid pattern to background */
.bg-grid-pattern {
  background-image: linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>


