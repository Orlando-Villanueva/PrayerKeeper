<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-900 via-purple-600 to-white relative overflow-hidden">
    <!-- Background overlay gradient with subtle pattern -->
    <div class="absolute inset-0 bg-gradient-to-b from-purple-900/70 via-purple-600/50 to-white/30 opacity-90"></div>
    <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>

    <!-- Navigation Bar -->
    <NavBar class="relative z-10" />

    <!-- Main Content -->
    <main class="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Dashboard Header -->
      <PageHeader title="Prayer Dashboard" subtitle="Keep track of your prayer requests and celebrations">
        <template #actions>
          <ActionPill to="/manage-categories">
            <template #icon>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </template>
            Manage Categories
          </ActionPill>
        </template>
      </PageHeader>

      <!-- Loading State -->
      <LoadingState v-if="isInitialLoading" message="Loading prayers..." />

      <!-- Error State -->
      <ErrorState v-else-if="prayerStore.error" :message="prayerStore.error" @dismiss="prayerStore.resetError" />

      <!-- Prayer Grid -->
      <div v-else class="grid grid-cols-1 gap-6 sm:gap-10 md:grid-cols-2">
        <template v-for="category in categoryStore.sortedVisibleCategories" :key="category.id">
          <PrayerList :title="category.name" :category-id="category.id"
            header-class="bg-gradient-to-r from-purple-300 to-purple-200 border-b border-purple-300/70"
            class="bg-gradient-to-b from-white/90 to-white/70 backdrop-blur-sm rounded-xl shadow-xl border border-purple-100/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] hover:border-purple-200" />
        </template>
      </div>

      <!-- Bible Verse -->
      <BibleVerse text="Brethren, pray for us." reference="1 Thessalonians 5:25"
        class="mt-8 sm:mt-12 bg-white/60 backdrop-blur-sm rounded-xl shadow-lg p-6 sm:p-8 border border-purple-100/50 transition-all duration-300 hover:shadow-xl hover:bg-white/70 hover:border-purple-200" />
    </main>

    <!-- Prayer Modal Component -->
    <PrayerModal v-model="isModalVisible" :prayer-data="currentPrayer" :is-edit-mode="isEditMode" @save="savePrayer"
      class="z-50" />
  </div>
</template>

<script setup>
// Imports
import { ref, provide, onMounted } from 'vue';
import { usePrayerStore } from '../stores/prayerStore';
import { useCategoryStore } from '../stores/categoryStore';
import NavBar from './navbar/NavBar.vue';
import PrayerList from './prayer/PrayerList.vue';
import PrayerModal from './prayer/PrayerModal.vue';
import BibleVerse from './ui/BibleVerse.vue';
import PageHeader from './ui/PageHeader.vue';
import LoadingState from './ui/LoadingState.vue';
import ErrorState from './ui/ErrorState.vue';
import ActionPill from './ui/ActionPill.vue';

// Store initialization
const prayerStore = usePrayerStore();
const categoryStore = useCategoryStore();

// State management
const isInitialLoading = ref(true);
const isModalVisible = ref(false);
const isEditMode = ref(false);
const currentPrayer = ref({
  id: null,
  person_name: '',
  note: '',
  category_id: null,
  resolved: false
});

// Prayer modal functions
const openAddModal = (categoryId) => {
  isEditMode.value = false;
  currentPrayer.value = {
    person_name: '',
    note: '',
    category_id: categoryId,
    resolved: false
  };
  isModalVisible.value = true;
};

const openEditModal = (prayer) => {
  isEditMode.value = true;
  currentPrayer.value = { ...prayer };
  isModalVisible.value = true;
};

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

// Prayer action functions
const toggleResolved = async (prayer) => {
  // Don't await the promise to avoid loading state
  prayerStore.resolvePrayer(prayer.id, !prayer.resolved);
};

const deletePrayer = async (prayer) => {
  if (confirm('Are you sure you want to delete this prayer?')) {
    // Don't await to avoid loading state
    prayerStore.deletePrayer(prayer.id);
  }
};

// Provide functions to child components
provide('modalFunctions', {
  openAddModal,
  openEditModal
});

provide('prayerActions', {
  toggleResolved,
  deletePrayer
});

// Lifecycle hooks
onMounted(async () => {
  await Promise.all([
    prayerStore.fetchPrayers(),
    categoryStore.fetchCategories()
  ]);
  isInitialLoading.value = false;
});
</script>

<style>
/* Add subtle grid pattern to background */
.bg-grid-pattern {
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>
