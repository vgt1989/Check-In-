import { useCallback, useEffect, useState } from 'react';

const PREFIX = 'vlaams-b2:';

export function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // storage full or blocked: the app keeps working for this session
  }
}

/** useState that persists to localStorage and syncs between components via a custom event. */
export function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback));

  useEffect(() => {
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (detail.key === key) setValue(load(key, fallback));
    };
    window.addEventListener('vlaams-store', onChange);
    return () => window.removeEventListener('vlaams-store', onChange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      const prev = load(key, fallback);
      const resolved = typeof next === 'function' ? (next as (p: T) => T)(prev) : next;
      save(key, resolved);
      setValue(resolved);
      window.dispatchEvent(new CustomEvent('vlaams-store', { detail: { key } }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );

  return [value, update] as const;
}

export function exportAll(): string {
  const out: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) out[k] = JSON.parse(localStorage.getItem(k) || 'null');
  }
  return JSON.stringify(out, null, 2);
}

export function importAll(json: string) {
  const data = JSON.parse(json) as Record<string, unknown>;
  Object.entries(data).forEach(([k, v]) => {
    if (k.startsWith(PREFIX)) localStorage.setItem(k, JSON.stringify(v));
  });
}
