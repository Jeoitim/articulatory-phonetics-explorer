'use client';

import { useSyncExternalStore } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

const storageKey = 'articulatory-theme';
type Theme = 'light' | 'dark' | 'system';
const options = [
  { value: 'light', label: '浅色模式', Icon: Sun },
  { value: 'dark', label: '暗色模式', Icon: Moon },
  { value: 'system', label: '跟随系统', Icon: Monitor },
] as const;

function normalize(value: string | null | undefined): Theme {
  return value === 'light' || value === 'dark' ? value : 'system';
}

function subscribe(notify: () => void) {
  function sync(event: StorageEvent) {
    if (event.key !== storageKey && event.key !== null) return;
    document.documentElement.dataset.theme = normalize(event.newValue);
    notify();
  }
  window.addEventListener('storage', sync);
  window.addEventListener('theme-change', notify);
  return () => {
    window.removeEventListener('storage', sync);
    window.removeEventListener('theme-change', notify);
  };
}

function select(value: Theme) {
  document.documentElement.dataset.theme = value;
  try {
    localStorage.setItem(storageKey, value);
  } catch {
    // 浏览器存储不可用时，主题切换仍应正常工作。
  }
  window.dispatchEvent(new Event('theme-change'));
}

export function ThemeSwitch() {
  const theme = useSyncExternalStore(
    subscribe,
    () => normalize(document.documentElement.dataset.theme),
    () => 'system' as Theme,
  );

  return (
    <fieldset className="theme-switch" aria-label="外观主题">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={theme === value}
          title={label}
          onClick={() => select(value)}
        >
          <Icon size={16} aria-hidden="true" />
        </button>
      ))}
    </fieldset>
  );
}
