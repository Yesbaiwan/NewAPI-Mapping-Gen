<script setup lang="ts">
import { ref } from 'vue';
import { Check, Palette } from 'lucide-vue-next';
import { THEMES } from '../lib/themes';
import { useTheme } from '../composables/useTheme';

const { themeId, setTheme } = useTheme();
const open = ref(false);

function pick(id: string): void {
  setTheme(id);
  open.value = false;
}
</script>

<template>
  <div class="fixed top-4 right-4 z-10">
    <div
      v-if="open"
      class="fixed inset-0 cursor-default"
      @click="open = false"
    ></div>
    <button
      type="button"
      class="icon-btn relative cursor-pointer"
      aria-label="选择主题"
      @click="open = !open"
    >
      <Palette class="h-4 w-4" />
    </button>
    <div v-if="open" class="card absolute top-11 right-0 w-32 p-1.5 shadow-xl">
      <button
        v-for="t in THEMES"
        :key="t.id"
        type="button"
        class="flex w-full cursor-pointer items-center justify-between rounded-md px-2.5 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
        @click="pick(t.id)"
      >
        {{ t.label }}
        <Check v-if="themeId === t.id" class="h-3.5 w-3.5 text-indigo-500" />
      </button>
    </div>
  </div>
</template>
