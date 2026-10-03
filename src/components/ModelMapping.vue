<script setup lang="ts">
import { computed } from 'vue';
import {
  ArrowRight,
  Copy,
  ListPlus,
  Trash2,
  TriangleAlert,
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { useModels } from '../composables/useModels';

const { sourceText, finalText, sourceLines, finalLines, loading, clearLists } =
  useModels();

async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

const mismatch = computed(
  () => sourceLines.value.length !== finalLines.value.length,
);

/** 按行号一一对应生成映射（final → source），行数不一致时返回 null */
const mapping = computed<Record<string, string> | null>(() => {
  const sources = sourceLines.value;
  const finals = finalLines.value;
  if (sources.length !== finals.length) return null;
  const result: Record<string, string> = {};
  sources.forEach((source, i) => {
    const final = finals[i]!;
    if (final && source && final !== source) result[final] = source;
  });
  return result;
});

const hasMapping = computed(
  () => mapping.value !== null && Object.keys(mapping.value).length > 0,
);

function copyToLower(): void {
  finalText.value = sourceText.value.toLowerCase();
  toast.success('源模型已转小写填入最终列表');
}

function onClear(): void {
  clearLists();
  toast.success('列表已清空');
}

async function copyModelList(): Promise<void> {
  try {
    await copyText(finalLines.value.join(', '));
    toast.success(`已复制 ${finalLines.value.length} 个模型名`);
  } catch (e) {
    toast.error(e instanceof Error ? e.message : '复制失败');
  }
}

async function copyMapping(): Promise<void> {
  if (!mapping.value) return;
  if (!hasMapping.value) {
    toast.warning('映射前后无变化');
    return;
  }
  try {
    await copyText(JSON.stringify(mapping.value, null, 2));
    toast.success(`已复制 ${Object.keys(mapping.value).length} 条映射到剪贴板`);
  } catch (e) {
    toast.error(e instanceof Error ? e.message : '复制失败');
  }
}
</script>

<template>
  <div class="card flex flex-col p-5">
    <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-base font-semibold">模型映射</h2>
      <div class="flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          class="btn-ghost cursor-pointer"
          :disabled="loading || !sourceLines.length"
          @click="copyToLower"
        >
          <ArrowRight class="h-3.5 w-3.5" />
          源 → 最终（转小写）
        </button>
        <button
          type="button"
          class="btn-ghost cursor-pointer"
          :disabled="loading || (!sourceLines.length && !finalLines.length)"
          @click="onClear"
        >
          <Trash2 class="h-3.5 w-3.5" />
          清空列表
        </button>
      </div>
    </div>

    <div
      class="grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2"
      :class="loading ? 'opacity-60' : ''"
    >
      <div class="flex min-h-0 flex-col">
        <p
          class="mb-1.5 flex items-center justify-between text-xs text-zinc-500"
        >
          <span class="font-medium">
            源模型列表
            <span class="text-zinc-400">（每行一个，来自 API）</span>
          </span>
          <span class="font-mono">{{ sourceLines.length }} 个</span>
        </p>
        <textarea
          v-model="sourceText"
          class="list-area"
          spellcheck="false"
          placeholder="获取模型后显示在这里"
        ></textarea>
      </div>
      <div class="flex min-h-0 flex-col">
        <p
          class="mb-1.5 flex items-center justify-between text-xs text-zinc-500"
        >
          <span class="font-medium">
            最终模型列表
            <span class="text-zinc-400">（每行对应左侧一行，可改名）</span>
          </span>
          <span class="font-mono">{{ finalLines.length }} 个</span>
        </p>
        <textarea
          v-model="finalText"
          class="list-area"
          spellcheck="false"
          placeholder="与左侧逐行对应，直接修改映射名称"
        ></textarea>
      </div>
    </div>

    <p
      v-if="mismatch && (sourceLines.length || finalLines.length)"
      class="mt-3 flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-xs text-amber-600 dark:text-amber-400"
    >
      <TriangleAlert class="h-3.5 w-3.5 shrink-0" />
      源 {{ sourceLines.length }} 行 / 最终
      {{ finalLines.length }} 行，行数不一致，无法生成映射
    </p>

    <div class="mt-3 flex gap-3">
      <button
        type="button"
        class="btn-primary flex-1 cursor-pointer"
        :disabled="!hasMapping"
        @click="copyMapping"
      >
        <Copy class="h-4 w-4" />
        复制映射 JSON
      </button>
      <button
        type="button"
        class="btn-secondary flex-1 cursor-pointer"
        :disabled="!finalLines.length"
        @click="copyModelList"
      >
        <ListPlus class="h-4 w-4" />
        复制模型列表
      </button>
    </div>
  </div>
</template>
