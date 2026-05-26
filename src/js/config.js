// 配置常量
const STORAGE_PREFIX = 'modelGet_';

const DEFAULT_CONFIG = {
  apiUrl: 'https://ollama.com',
  apiEndpoint: '/v1/models',
  apiKey: 'sk-123456',
  excludeKeywords: 'distill,bge,embedding,evil,flux,live,qvq,qwq,audio,tts,veo,gemma,gemini-1.5,gemini-2.0,writer,baichuan,phi',
  includeKeywords: 'gpt,gemini,claude,grok,deepseek,glm,minimax,kimi,doubao,qwen',
};

const CONFIG_FIELDS = {
  ApiUrl: { el: 'apiUrl', def: DEFAULT_CONFIG.apiUrl },
  ApiEndpoint: { el: 'apiEndpoint', def: DEFAULT_CONFIG.apiEndpoint },
  ApiKey: { el: 'apiKey', def: DEFAULT_CONFIG.apiKey },
  ExcludeKeywords: { el: 'excludeKeywords', def: DEFAULT_CONFIG.excludeKeywords },
  IncludeKeywords: { el: 'includeKeywords', def: DEFAULT_CONFIG.includeKeywords },
  EnableFilter: { el: 'enableFilter', type: 'checkbox', def: true },
  ShowApiEndpoint: { el: 'showApiEndpoint', type: 'checkbox', def: false },
  FilterMode: { type: 'radio', name: 'filterMode', def: 'exclude' },
};

const STATUS_COLORS = {
  success: 'bg-green-500/90 text-white',
  error: 'bg-red-500/90 text-white',
  info: 'bg-indigo-500/90 text-white',
  warning: 'bg-yellow-500/90 text-white',
};

const BTN_CONFIG = [
  {
    id: 'fetchBtn',
    icon: '🔄',
    text: '获取模型列表',
    cls: 'bg-indigo-600 hover:bg-indigo-700',
    fn: 'fetchModels',
  },
  {
    id: 'copyFinalBtn',
    icon: '📋',
    text: '复制最终模型',
    cls: 'bg-emerald-600 hover:bg-emerald-700',
    fn: 'copyFinalModels',
  },
  {
    id: 'copyMappingBtn',
    icon: '⚡',
    text: '复制模型映射',
    cls: 'bg-cyan-600 hover:bg-cyan-700',
    fn: 'copyMappingResult',
  },
  {
    id: 'clearBtn',
    icon: '🗑️',
    text: '清空模型列表',
    cls: 'bg-violet-600 hover:bg-violet-700',
    fn: 'clearEditor',
  },
  {
    id: 'clearConfigBtn',
    icon: '🧹',
    text: '清除API配置',
    cls: 'bg-red-600 hover:bg-red-700',
    fn: 'clearApiConfig',
  },
];
