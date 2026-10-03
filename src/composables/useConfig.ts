import { reactive, watch } from 'vue';
import { load, save } from '../lib/storage';
import type { ApiConfig } from '../types';

export const DEFAULT_CONFIG: ApiConfig = {
  apiUrl: 'https://ollama.com',
  apiEndpoint: '/v1/models',
  apiKey: '',
};

const config = reactive<ApiConfig>(load('config', { ...DEFAULT_CONFIG }));
watch(config, (v) => save('config', { ...v }));

export function useConfig() {
  return { config };
}
