import { useStored } from './storage';
import type { CardState } from './srs';
import type { VocabItem } from '../types';
import { daysBetween, todayISO } from './dates';
import { TOTAL_WEEKS } from '../data/plan';

export type TaskId = 'woorden' | 'grammatica' | 'luisteren' | 'dictee' | 'vlaams' | 'media' | 'output';

export interface Settings {
  startDate: string | null;
  rate: number;
  cardDirection: 'nl-es' | 'es-nl' | 'mix';
  newPerDay: number;
}

export const defaultSettings: Settings = { startDate: null, rate: 1, cardDirection: 'mix', newPerDay: 8 };

export type Sessions = Record<string, Partial<Record<TaskId, boolean>>>;
export type ExStats = Record<string, { ok: number; ko: number; last: string }>;

export const useSettings = () => useStored<Settings>('settings', defaultSettings);
export const useCards = () => useStored<Record<string, CardState>>('cards', {});
export const useOwnWords = () => useStored<VocabItem[]>('own-words', []);
export const useSessions = () => useStored<Sessions>('sessions', {});
export const useExStats = () => useStored<ExStats>('ex-stats', {});
export const useLessonsRead = () => useStored<Record<string, string>>('lessons-read', {});
export const useTests = () => useStored<Record<string, number>>('tests', {});
export const useWritings = () => useStored<Record<string, string>>('writings', {});
export const useListenScores = () => useStored<Record<string, number>>('listen-scores', {});

export function dayInfo(startDate: string | null, today = todayISO()) {
  const day = startDate ? Math.max(0, daysBetween(startDate, today)) : 0;
  const week = Math.min(TOTAL_WEEKS, Math.floor(day / 7) + 1);
  return { day, week, dayOfWeek: day % 7, finished: day >= TOTAL_WEEKS * 7 };
}

export function streak(sessions: Sessions, today = todayISO()): number {
  const doneOn = (d: string) => Object.values(sessions[d] || {}).filter(Boolean).length >= 3;
  let count = 0;
  const cursor = new Date();
  // today counts if done; otherwise start from yesterday so the streak isn't "lost" mid-day
  if (!doneOn(today)) cursor.setDate(cursor.getDate() - 1);
  for (;;) {
    const iso = todayISO(cursor);
    if (!doneOn(iso)) break;
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
