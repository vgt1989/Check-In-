import { addDays, todayISO } from './dates';

export interface CardState {
  interval: number; // days
  ease: number;
  reps: number;
  due: string; // ISO date
  lapses: number;
}

export type Grade = 0 | 1 | 2 | 3; // opnieuw, moeilijk, goed, makkelijk

export function newCard(): CardState {
  return { interval: 0, ease: 2.5, reps: 0, due: todayISO(), lapses: 0 };
}

/** Simplified SM-2. */
export function review(card: CardState, grade: Grade, today = todayISO()): CardState {
  let { interval, ease, reps, lapses } = card;
  if (grade === 0) {
    reps = 0;
    lapses += 1;
    interval = 0; // see again today
    ease = Math.max(1.3, ease - 0.2);
  } else {
    if (reps === 0) interval = grade === 3 ? 3 : 1;
    else if (reps === 1) interval = grade === 1 ? 2 : grade === 2 ? 3 : 5;
    else interval = Math.round(interval * (grade === 1 ? 1.2 : grade === 2 ? ease : ease * 1.3));
    reps += 1;
    ease = Math.max(1.3, ease + (grade === 1 ? -0.15 : grade === 3 ? 0.15 : 0));
  }
  return { interval, ease, reps, lapses, due: addDays(today, interval) };
}

export function isLearned(card?: CardState) {
  return !!card && card.interval >= 21;
}
