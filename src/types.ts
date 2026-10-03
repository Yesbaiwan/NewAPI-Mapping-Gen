export interface ApiConfig {
  apiUrl: string;
  apiEndpoint: string;
  apiKey: string;
}

export type FilterMode = 'exclude' | 'include';

export interface FilterState {
  enabled: boolean;
  mode: FilterMode;
  exclude: string[];
  include: string[];
}
