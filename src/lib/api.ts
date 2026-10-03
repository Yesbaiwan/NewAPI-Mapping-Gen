import type { ApiConfig } from '../types';

export async function fetchModelList(config: ApiConfig): Promise<string[]> {
  const res = await fetch('/fetch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  const data = (await res.json().catch(() => null)) as {
    models?: unknown;
    error?: string;
  } | null;
  if (!data) throw new Error(`请求失败（${res.status}）`);
  if (!res.ok) throw new Error(data.error || `请求失败（${res.status}）`);
  if (!Array.isArray(data.models)) throw new Error('响应格式异常');
  return data.models as string[];
}
