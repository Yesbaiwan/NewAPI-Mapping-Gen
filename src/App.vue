<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import { Toaster } from 'vue-sonner';
import ConnectCard from './components/ConnectCard.vue';
import ModelMapping from './components/ModelMapping.vue';
import ThemeMenu from './components/ThemeMenu.vue';
import { useModels } from './composables/useModels';
import { useTheme } from './composables/useTheme';

const { isDark } = useTheme();
const { fetchModels, loading } = useModels();

function onKeydown(e: KeyboardEvent): void {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !loading.value) {
    e.preventDefault();
    fetchModels();
  }
}
onMounted(() => window.addEventListener('keydown', onKeydown));
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown));
</script>

<template>
  <ThemeMenu />

  <div class="mx-auto max-w-[1400px] px-4 py-5 sm:px-6 lg:px-8">
    <div class="grid gap-5 lg:grid-cols-[380px_1fr]">
      <ConnectCard />
      <ModelMapping />
    </div>
  </div>
  <Toaster
    :theme="isDark ? 'dark' : 'light'"
    position="bottom-right"
    rich-colors
    close-button
  />
</template>
