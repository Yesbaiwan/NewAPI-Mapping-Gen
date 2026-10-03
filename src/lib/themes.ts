export interface ThemeDef {
  id: string;
  label: string;
  dark: boolean;
  /** 覆盖到 html 根元素上的 CSS 变量（Tailwind v4 的 --color-* 调色板重映射 + --surface） */
  vars?: Record<string, string>;
}

/**
 * 组件统一用 zinc/indigo 色阶，主题靠覆盖 --color-* 变量整体换肤；
 * 表面色走 --surface。新增主题在这里加一条，index.html 深色名单要同步。
 */
export const THEMES: ThemeDef[] = [
  { id: 'light', label: '浅色', dark: false },
  {
    id: 'warm',
    label: '暖白',
    dark: false,
    vars: {
      '--surface': '#fdfaf5',
      '--color-zinc-50': '#f8f4ec',
      '--color-zinc-100': '#f1ebdf',
      '--color-zinc-200': '#e3dac9',
      '--color-zinc-300': '#cdc0aa',
      '--color-zinc-400': '#a99880',
      '--color-zinc-500': '#877458',
      '--color-zinc-600': '#6d5c44',
      '--color-zinc-700': '#544635',
      '--color-zinc-800': '#3d3327',
      '--color-zinc-900': '#2e2720',
      '--color-zinc-950': '#211c17',
    },
  },
  { id: 'dark', label: '纯黑', dark: true },
  {
    id: 'gray',
    label: '暗灰',
    dark: true,
    // 中性灰黑，比纯黑明显柔一档
    vars: {
      '--surface': '#2b2b31',
      '--color-zinc-50': '#f7f7fa',
      '--color-zinc-100': '#eff0f3',
      '--color-zinc-200': '#e0e0e6',
      '--color-zinc-300': '#c4c4cc',
      '--color-zinc-400': '#a2a2ac',
      '--color-zinc-500': '#7c7c88',
      '--color-zinc-600': '#585862',
      '--color-zinc-700': '#42424a',
      '--color-zinc-800': '#34343b',
      '--color-zinc-900': '#2b2b31',
      '--color-zinc-950': '#232327',
    },
  },
  {
    id: 'violet',
    label: '暮紫',
    dark: true,
    // 中性暗底 + 紫罗兰点缀 + 顶部微光晕
    vars: {
      '--surface': '#26252e',
      '--page-glow':
        'radial-gradient(900px 420px at 65% -120px, rgb(139 92 246 / 0.14), transparent 70%)',
      '--color-zinc-50': '#f6f5fa',
      '--color-zinc-100': '#eeeef4',
      '--color-zinc-200': '#e0dfe9',
      '--color-zinc-300': '#c5c3d3',
      '--color-zinc-400': '#9d9aad',
      '--color-zinc-500': '#767288',
      '--color-zinc-600': '#565264',
      '--color-zinc-700': '#3f3c4b',
      '--color-zinc-800': '#2e2c38',
      '--color-zinc-900': '#26252e',
      '--color-zinc-950': '#1b1a21',
      '--color-indigo-400': '#a78bfa',
      '--color-indigo-500': '#8b5cf6',
      '--color-indigo-600': '#7c3aed',
    },
  },
  {
    id: 'amber',
    label: '琥珀',
    dark: true,
    // 中性暗底 + 琥珀金点缀 + 顶部微光晕
    vars: {
      '--surface': '#282624',
      '--page-glow':
        'radial-gradient(900px 420px at 65% -120px, rgb(245 158 11 / 0.10), transparent 70%)',
      '--color-zinc-50': '#f8f7f5',
      '--color-zinc-100': '#f0eeeb',
      '--color-zinc-200': '#e2e0dc',
      '--color-zinc-300': '#c8c5bf',
      '--color-zinc-400': '#a09c94',
      '--color-zinc-500': '#78736a',
      '--color-zinc-600': '#585349',
      '--color-zinc-700': '#403c35',
      '--color-zinc-800': '#2f2c27',
      '--color-zinc-900': '#282624',
      '--color-zinc-950': '#1c1a17',
      '--color-indigo-400': '#fbbf24',
      '--color-indigo-500': '#f59e0b',
      '--color-indigo-600': '#d97706',
    },
  },
];

export function findTheme(id: string): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]!;
}

/** 当前主题设置过的变量，切换时先清掉，避免残留 */
let applied: string[] = [];

/** 把主题应用到 html 根元素（dark 类 + CSS 变量覆盖） */
export function applyTheme(id: string): void {
  const theme = findTheme(id);
  const root = document.documentElement;
  root.classList.toggle('dark', theme.dark);
  root.dataset.theme = theme.id;
  for (const name of applied) root.style.removeProperty(name);
  applied = [];
  const vars: Record<string, string> = {
    '--surface': theme.dark ? '#18181b' : '#ffffff',
    ...theme.vars,
  };
  for (const [name, value] of Object.entries(vars)) {
    root.style.setProperty(name, value);
    applied.push(name);
  }
}
