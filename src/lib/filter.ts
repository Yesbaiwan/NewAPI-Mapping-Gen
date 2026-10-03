import type { FilterState } from '../types';

/** 按 include/exclude 关键词（子串匹配）过滤模型 ID，关键词已在输入时归一化 */
export function filterModels(models: string[], filter: FilterState): string[] {
  if (!filter.enabled) return models;
  const words = filter.mode === 'exclude' ? filter.exclude : filter.include;
  if (!words.length) return models;
  const hit = (id: string) => words.some((w) => id.toLowerCase().includes(w));
  return models.filter((id) =>
    filter.mode === 'exclude' ? !hit(id) : hit(id),
  );
}
