import { computed, ref, watch } from 'vue';
import { fetchModelList } from '../lib/api';
import { filterModels } from '../lib/filter';
import { load, save } from '../lib/storage';
import { useConfig } from './useConfig';
import { useFilter } from './useFilter';

const splitLines = (text: string): string[] =>
  text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);

const sourceText = ref(load('source', ''));
const finalText = ref(load('final', ''));
const loading = ref(false);
const error = ref('');

const { config } = useConfig();
const { filter } = useFilter();

const sourceLines = computed(() => splitLines(sourceText.value));
const finalLines = computed(() => splitLines(finalText.value));

watch(sourceText, (v) => save('source', v));
watch(finalText, (v) => save('final', v));

/** 抓取并按关键词过滤；成功后源列表填入模型，最终列表填入对应的小写名称 */
async function fetchModels(): Promise<{ total: number; kept: number } | null> {
  if (loading.value) return null;
  loading.value = true;
  error.value = '';
  try {
    const list = await fetchModelList({ ...config });
    const filtered = filterModels([...new Set(list)].sort(), filter);
    if (!filtered.length) {
      error.value = list.length
        ? '模型全部被关键词过滤，请调整过滤设置'
        : '上游未返回任何模型';
      return null;
    }
    sourceText.value = filtered.join('\n');
    finalText.value = filtered.map((m) => m.toLowerCase()).join('\n');
    return { total: list.length, kept: filtered.length };
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
    return null;
  } finally {
    loading.value = false;
  }
}

function clearLists(): void {
  sourceText.value = '';
  finalText.value = '';
}

export function useModels() {
  return {
    sourceText,
    finalText,
    sourceLines,
    finalLines,
    loading,
    error,
    fetchModels,
    clearLists,
  };
}
