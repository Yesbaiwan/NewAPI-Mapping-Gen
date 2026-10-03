<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps<{ modelValue: string[]; placeholder?: string }>();
const emit = defineEmits<{ 'update:modelValue': [value: string[]] }>();

const draft = ref('');
const input = ref<HTMLInputElement | null>(null);

function commit(): void {
  const words = draft.value
    .split(/[,，\s]+/)
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean);
  if (words.length)
    emit('update:modelValue', [...new Set([...props.modelValue, ...words])]);
  draft.value = '';
}

function removeAt(index: number): void {
  const next = [...props.modelValue];
  next.splice(index, 1);
  emit('update:modelValue', next);
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter') {
    e.preventDefault();
    commit();
  } else if (e.key === 'Backspace' && !draft.value && props.modelValue.length) {
    removeAt(props.modelValue.length - 1);
  }
}
</script>

<template>
  <div
    class="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-zinc-300 bg-surface px-2 py-1.5 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-950"
    @click="input?.focus()"
  >
    <span
      v-for="(word, i) in modelValue"
      :key="word"
      class="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
    >
      {{ word }}
      <button
        type="button"
        class="cursor-pointer text-zinc-400 transition-colors hover:text-red-500"
        :aria-label="`删除 ${word}`"
        @click.stop="removeAt(i)"
      >
        <X class="h-3 w-3" />
      </button>
    </span>
    <input
      ref="input"
      v-model="draft"
      type="text"
      class="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
      :placeholder="modelValue.length ? '' : placeholder"
      spellcheck="false"
      @keydown="onKeydown"
      @blur="commit"
    />
  </div>
</template>
