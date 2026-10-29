export type Level = 'A2' | 'B1' | 'B2';

export type Exercise =
  | { kind: 'fill'; prompt: string; answers: string[]; hint?: string; explain?: string }
  | { kind: 'order'; words: string[]; es: string; alt?: string[]; explain?: string }
  | { kind: 'choice'; prompt: string; options: string[]; answer: number; explain?: string };

export interface Example {
  nl: string;
  es: string;
}

export interface Section {
  title: string;
  text: string;
  examples?: Example[];
  table?: string[][];
}

export type GrammarFocus = 'woordvolgorde' | 'werkwoorden' | 'zinsbouw' | 'spreektaal' | 'register';

export interface GrammarLesson {
  id: string;
  title: string;
  titleEs: string;
  level: Level;
  focus: GrammarFocus;
  summary: string;
  sections: Section[];
  exercises: Exercise[];
}

export interface VocabItem {
  id: string;
  nl: string;
  es: string;
  ex: string;
  theme: VocabTheme;
  level: Level;
  own?: boolean;
}

export type VocabTheme = 'werk' | 'administratie' | 'sociaal' | 'nieuws' | 'dagelijks' | 'verbinding' | 'eigen';

export interface ListeningText {
  id: string;
  title: string;
  level: Level;
  type: string;
  register: 'standaard' | 'tussentaal';
  text: string;
  glossary?: Example[];
  questions: { q: string; options: string[]; answer: number }[];
}

export interface Expression {
  nl: string;
  es: string;
  note?: string;
  ex?: string;
  vlaams?: boolean;
}

export interface Reduction {
  spoken: string;
  standard: string;
  note?: string;
}

export interface Dictation {
  text: string;
  level: Level;
}

export interface WeekPlan {
  week: number;
  phase: 1 | 2 | 3;
  title: string;
  goal: string;
  grammar: string[];
  themes: VocabTheme[];
  listening: string[];
  speed: number;
  media: string;
  writing: string;
  speaking: string;
  test?: boolean;
}
