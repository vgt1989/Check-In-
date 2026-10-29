import type { Exercise, GrammarLesson } from '../types';
import { grammarPhase1 } from './grammar1';
import { grammarPhase2 } from './grammar2';

export const grammar: GrammarLesson[] = [...grammarPhase1, ...grammarPhase2];

export const lessonById = (id: string) => grammar.find((l) => l.id === id);

export interface TaggedExercise {
  key: string; // lessonId:index — used to track results
  lessonId: string;
  ex: Exercise;
}

export function exercisesOf(lessonId: string): TaggedExercise[] {
  const lesson = lessonById(lessonId);
  if (!lesson) return [];
  return lesson.exercises.map((ex, i) => ({ key: `${lessonId}:${i}`, lessonId, ex }));
}
