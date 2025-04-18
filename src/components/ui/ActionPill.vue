<template>
  <router-link 
    :to="to" 
    ref="pillRef"
    :class="[
      'inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white shadow-inner hover:bg-white/30 transition-all duration-300',
      { 'shine-animate': shineActive }
    ]"
    @click="stopShine"
  >
    <slot name="icon"></slot>
    <slot></slot>
  </router-link>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

const props = defineProps({
  to: {
    type: String,
    required: true
  }
});

const shineActive = ref(false);
const pillRef = ref(null);

function shine() {
  // Restart the animation if called again
  shineActive.value = false;
  void pillRef.value?.offsetWidth; // Force reflow
  shineActive.value = true;
}

function stopShine() {
  shineActive.value = false;
}

defineExpose({ shine, stopShine });
</script>

<style scoped>
@keyframes shine {
  0%, 100% {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.1);
  }
  50% {
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 0 25px 8px rgba(168, 85, 247, 0.25);
  }
}

.shine-animate {
  animation: shine 1.5s linear infinite;
  backdrop-filter: blur(8px);
}
</style>
