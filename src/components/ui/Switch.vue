<script setup lang="ts">
defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [value: boolean] }>();
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    class="relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors"
    :class="modelValue ? 'bg-indigo-600' : 'bg-zinc-300 dark:bg-zinc-700'"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span
      class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
      :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
    />
  </button>
</template>
