<script setup lang="ts">
import { ref } from 'vue';
import { CircleAlert, Eye, EyeOff, RefreshCw } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { DEFAULT_CONFIG, useConfig } from '../composables/useConfig';
import { useFilter } from '../composables/useFilter';
import { useModels } from '../composables/useModels';
import KeywordInput from './KeywordInput.vue';
import Switch from './ui/Switch.vue';

const { config } = useConfig();
const { filter } = useFilter();
const { fetchModels, loading, error } = useModels();

const showKey = ref(false);

const modeOptions = [
  { value: 'exclude', label: '排除' },
  { value: 'include', label: '保留' },
] as const;

async function onFetch(): Promise<void> {
  const result = await fetchModels();
  if (result) {
    toast.success(
      result.total === result.kept
        ? `已获取 ${result.total} 个模型`
        : `已获取 ${result.total} 个模型，过滤后剩余 ${result.kept} 个`,
    );
  }
}

function onReset(): void {
  Object.assign(config, { ...DEFAULT_CONFIG });
}
</script>

<template>
  <div class="card p-5">
    <div class="mb-4">
      <h2 class="text-base font-semibold">API 配置</h2>
    </div>

    <form class="space-y-3" @submit.prevent="onFetch">
      <div>
        <label class="mb-1.5 block text-xs font-medium text-zinc-500">
          API 地址
        </label>
        <input
          v-model="config.apiUrl"
          type="text"
          class="input"
          placeholder="https://api.openai.com"
          spellcheck="false"
          autocomplete="off"
        />
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-zinc-500">
          API 密钥
        </label>
        <div class="relative">
          <input
            v-model="config.apiKey"
            :type="showKey ? 'text' : 'password'"
            class="input pr-10"
            placeholder="sk-…（可留空）"
            spellcheck="false"
            autocomplete="off"
          />
          <button
            type="button"
            class="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
            :aria-label="showKey ? '隐藏密钥' : '显示密钥'"
            @click="showKey = !showKey"
          >
            <EyeOff v-if="showKey" class="h-4 w-4" />
            <Eye v-else class="h-4 w-4" />
          </button>
        </div>
      </div>
      <div>
        <label class="mb-1.5 block text-xs font-medium text-zinc-500">
          端点路径
        </label>
        <input
          v-model="config.apiEndpoint"
          type="text"
          class="input font-mono text-sm"
          placeholder="/v1/models"
          spellcheck="false"
          autocomplete="off"
        />
      </div>
      <button
        type="submit"
        class="btn-primary w-full cursor-pointer"
        :disabled="loading"
      >
        <RefreshCw class="h-4 w-4" :class="loading ? 'animate-spin' : ''" />
        {{ loading ? '获取中…' : '获取模型列表' }}
      </button>
    </form>

    <p
      v-if="error"
      class="mt-3 flex items-start gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-600 dark:text-red-400"
    >
      <CircleAlert class="mt-0.5 h-4 w-4 shrink-0" />
      {{ error }}
    </p>

    <div
      class="mt-5 space-y-3 border-t border-zinc-100 pt-4 dark:border-zinc-800"
    >
      <div class="flex items-center justify-between">
        <span class="text-xs font-medium text-zinc-500">关键词过滤</span>
        <Switch v-model="filter.enabled" />
      </div>
      <div class="flex items-center gap-2">
        <div
          class="inline-flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700"
        >
          <button
            v-for="opt in modeOptions"
            :key="opt.value"
            type="button"
            class="cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors"
            :class="
              filter.mode === opt.value
                ? 'bg-indigo-600 text-white'
                : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            "
            @click="filter.mode = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
        <span class="text-xs text-zinc-400">匹配模型 ID 子串</span>
      </div>
      <KeywordInput
        v-if="filter.mode === 'exclude'"
        key="exclude"
        v-model="filter.exclude"
        placeholder="排除，如 distill, embedding, tts"
      />
      <KeywordInput
        v-else
        key="include"
        v-model="filter.include"
        placeholder="保留，如 gpt, claude, qwen"
      />
    </div>

    <div class="mt-5 border-t border-zinc-100 pt-4 dark:border-zinc-800">
      <button
        type="button"
        class="btn-secondary w-full cursor-pointer"
        @click="onReset"
      >
        还原配置
      </button>
    </div>
  </div>
</template>
