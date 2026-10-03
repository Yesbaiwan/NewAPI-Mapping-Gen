import { computed, ref, watch } from 'vue';
import { load, save } from '../lib/storage';
import { applyTheme, findTheme } from '../lib/themes';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
// 没选过主题时跟随系统：系统深色默认用「暗灰」（比纯黑柔和）
const stored = load<string | null>('theme', null);
let userChosen = stored !== null;
const themeId = ref(stored ?? (prefersDark.matches ? 'gray' : 'light'));

watch(
  themeId,
  (id) => {
    applyTheme(id);
    if (userChosen) save('theme', id);
  },
  { immediate: true },
);

// 未手动选择时，系统深浅切换实时跟随
prefersDark.addEventListener('change', (e) => {
  if (!userChosen) themeId.value = e.matches ? 'gray' : 'light';
});

export function useTheme() {
  const setTheme = (id: string): void => {
    userChosen = true;
    save('theme', id);
    themeId.value = id;
  };
  const isDark = computed(() => findTheme(themeId.value).dark);
  return { themeId, setTheme, isDark };
}
