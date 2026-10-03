import { reactive, watch } from 'vue';
import { load, save } from '../lib/storage';
import type { FilterState } from '../types';

const filter = reactive<FilterState>(
  load('filter', {
    enabled: true,
    mode: 'exclude',
    exclude: [],
    include: [],
  }),
);
watch(filter, (v) => save('filter', { ...v }));

export function useFilter() {
  return { filter };
}
