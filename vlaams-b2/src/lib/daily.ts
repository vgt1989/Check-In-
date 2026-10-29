import { exercisesOf, type TaggedExercise } from '../data/grammar';
import { dictations, listeningTexts } from '../data/listening';
import { plan, weekPlan } from '../data/plan';
import { vocabBank } from '../data/vocab';
import { expressions, reductions } from '../data/vlaams';
import type { Dictation, Level, VocabItem } from '../types';
import { seeded, seedFromISO, shuffle, todayISO } from './dates';
import type { CardState } from './srs';
import type { ExStats } from './state';

const levelRank: Record<Level, number> = { A2: 0, B1: 1, B2: 2 };

/** Weakest exercises first: more errors and less recently seen. */
function weakness(stats: ExStats, key: string) {
  const s = stats[key];
  if (!s) return 1.5; // never seen
  return (s.ko + 1) / (s.ok + 1);
}

export function dailyGrammar(week: number, stats: ExStats, date = todayISO(), size = 10): TaggedExercise[] {
  const rand = seeded(seedFromISO(date) + 7);
  const current = weekPlan(week).grammar;
  const previous = Array.from(new Set(plan.slice(0, week - 1).flatMap((w) => w.grammar))).filter((id) => !current.includes(id));

  const currentPool = shuffle(current.flatMap(exercisesOf), rand);
  const reviewPool = previous
    .flatMap(exercisesOf)
    .sort((a, b) => weakness(stats, b.key) - weakness(stats, a.key) || rand() - 0.5);

  const reviewCount = previous.length ? Math.min(4, reviewPool.length) : 0;
  const picked = [...currentPool.slice(0, size - reviewCount), ...reviewPool.slice(0, reviewCount)];
  return shuffle(picked, rand);
}

export function dueCards(cards: Record<string, CardState>, all: VocabItem[], date = todayISO()) {
  return all.filter((v) => cards[v.id] && cards[v.id].due <= date);
}

export function newWords(week: number, cards: Record<string, CardState>, own: VocabItem[], n: number): VocabItem[] {
  const themes = weekPlan(week).themes;
  const unseenOwn = own.filter((v) => !cards[v.id]);
  const unseen = vocabBank.filter((v) => !cards[v.id]);
  const inTheme = unseen.filter((v) => themes.includes(v.theme));
  const rest = unseen.filter((v) => !themes.includes(v.theme)).sort((a, b) => levelRank[a.level] - levelRank[b.level]);
  return [...unseenOwn, ...inTheme, ...rest].slice(0, n);
}

export function dailyListening(week: number, dayOfWeek: number) {
  const ids = weekPlan(week).listening;
  const id = ids[dayOfWeek % ids.length];
  return listeningTexts.find((t) => t.id === id)!;
}

export function dailyDictations(phase: number, date = todayISO(), n = 5): Dictation[] {
  const max: Level = phase === 1 ? 'B1' : 'B2';
  const min: Level = phase === 3 ? 'B1' : 'A2';
  const pool = dictations.filter((d) => levelRank[d.level] <= levelRank[max] && levelRank[d.level] >= levelRank[min]);
  // phase 1 starts with A2 only during the first weeks
  const easy = phase === 1 ? pool.filter((d) => d.level === 'A2') : pool;
  return shuffle(easy.length >= n ? easy : pool, seeded(seedFromISO(date) + 3)).slice(0, n);
}

export function dailyVlaams(day: number) {
  const ex = [0, 1, 2].map((i) => expressions[(day * 3 + i) % expressions.length]);
  const red = [0, 1, 2].map((i) => reductions[(day * 3 + i) % reductions.length]);
  return { ex, red };
}
