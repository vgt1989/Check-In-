import { useMemo, useState } from 'react';
import type { TaggedExercise } from '../data/grammar';
import { lessonById } from '../data/grammar';
import { isCorrect, normalize } from '../lib/check';
import { shuffle, todayISO } from '../lib/dates';
import { useExStats } from '../lib/state';
import type { Exercise } from '../types';
import { SpeakButton } from './Speak';

interface Props {
  items: TaggedExercise[];
  onFinish?: (score: number, total: number) => void;
  showLesson?: boolean;
}

export function ExerciseRunner({ items: initial, onFinish, showLesson = true }: Props) {
  const [items, setItems] = useState(initial);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<null | boolean>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [mistakes, setMistakes] = useState<TaggedExercise[]>([]);
  const [, setStats] = useExStats();

  if (!items.length) return <p className="text-slate-500">No hay ejercicios.</p>;

  if (done) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="text-center space-y-3 py-4">
        <div className="text-5xl">{pct >= 80 ? '🎉' : pct >= 50 ? '💪' : '📚'}</div>
        <p className="text-xl font-semibold">
          {score} / {items.length} correctas ({pct}%)
        </p>
        <p className="text-slate-600">
          {pct >= 80 ? 'Goed bezig! Muy bien.' : pct >= 50 ? 'Bien, pero repasa los fallos.' : 'Vuelve a leer la explicación y repite.'}
        </p>
        {mistakes.length > 0 && (
          <button
            className="btn-ghost"
            onClick={() => {
              setIndex(0);
              setScore(0);
              setDone(false);
              setResult(null);
              setItems(mistakes);
              setMistakes([]);
            }}
          >
            Repetir los {mistakes.length} fallos
          </button>
        )}
      </div>
    );
  }

  const current = items[index];
  const lesson = lessonById(current.lessonId);

  const answer = (ok: boolean) => {
    setResult(ok);
    if (ok) setScore((s) => s + 1);
    else setMistakes((m) => [...m, current]);
    setStats((prev) => {
      const s = prev[current.key] || { ok: 0, ko: 0, last: '' };
      return { ...prev, [current.key]: { ok: s.ok + (ok ? 1 : 0), ko: s.ko + (ok ? 0 : 1), last: todayISO() } };
    });
  };

  const next = () => {
    if (index + 1 >= items.length) {
      setDone(true);
      onFinish?.(score, items.length);
    } else {
      setIndex(index + 1);
      setResult(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          {index + 1} / {items.length}
        </span>
        {showLesson && lesson && <span className="chip bg-slate-100 text-slate-600">{lesson.title}</span>}
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 transition-all" style={{ width: `${(index / items.length) * 100}%` }} />
      </div>
      <SingleExercise key={current.key + index} ex={current.ex} onAnswer={answer} answered={result !== null} />
      {result !== null && (
        <div className={`rounded-xl p-3 ${result ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
          <p className="font-semibold">{result ? '✓ Juist!' : '✗ Niet helemaal'}</p>
          <Solution ex={current.ex} />
          <button className="btn-primary mt-3 w-full sm:w-auto" onClick={next} autoFocus>
            {index + 1 >= items.length ? 'Ver resultado' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}

function solutionText(ex: Exercise): string {
  if (ex.kind === 'fill') return ex.prompt.replace('___', ex.answers[0]);
  if (ex.kind === 'order') return ex.words.join(' ');
  return ex.prompt.includes('___') ? ex.prompt.replace('___', ex.options[ex.answer]) : ex.options[ex.answer];
}

function Solution({ ex }: { ex: Exercise }) {
  const text = solutionText(ex);
  return (
    <div className="mt-1 space-y-1 text-sm">
      <p className="flex items-center gap-2">
        <span>
          <span className="opacity-70">Solución:</span> <strong>{text}</strong>
        </span>
        <SpeakButton text={text.replace(/\(.*?\)/g, '')} />
      </p>
      {ex.kind === 'fill' && ex.answers.length > 1 && <p className="opacity-80">También vale: {ex.answers.slice(1).join(' · ')}</p>}
      {ex.kind === 'order' && ex.alt && <p className="opacity-80">También vale: {ex.alt.join(' · ')}</p>}
      {ex.explain && <p className="opacity-90">💡 {ex.explain}</p>}
    </div>
  );
}

function SingleExercise({ ex, onAnswer, answered }: { ex: Exercise; onAnswer: (ok: boolean) => void; answered: boolean }) {
  if (ex.kind === 'fill') return <FillExercise ex={ex} onAnswer={onAnswer} answered={answered} />;
  if (ex.kind === 'choice') return <ChoiceExercise ex={ex} onAnswer={onAnswer} answered={answered} />;
  return <OrderExercise ex={ex} onAnswer={onAnswer} answered={answered} />;
}

function FillExercise({ ex, onAnswer, answered }: { ex: Extract<Exercise, { kind: 'fill' }>; onAnswer: (ok: boolean) => void; answered: boolean }) {
  const [value, setValue] = useState('');
  const [before, after] = ex.prompt.split('___');
  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!answered && value.trim()) onAnswer(isCorrect(value, ex.answers));
      }}
    >
      <p className="text-sm text-slate-500">Completa el hueco</p>
      <p className="text-lg leading-relaxed">
        {before}
        <span className="inline-block min-w-[5rem] border-b-2 border-amber-400 px-1 font-semibold text-amber-700">{value || '…'}</span>
        {after}
      </p>
      <div className="flex gap-2">
        <input
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={answered}
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Escribe la respuesta…"
        />
        <button className="btn-primary" disabled={answered || !value.trim()}>
          Comprobar
        </button>
      </div>
    </form>
  );
}

function ChoiceExercise({ ex, onAnswer, answered }: { ex: Extract<Exercise, { kind: 'choice' }>; onAnswer: (ok: boolean) => void; answered: boolean }) {
  const [picked, setPicked] = useState<number | null>(null);
  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">Elige la opción correcta</p>
      <p className="text-lg">{ex.prompt}</p>
      <div className="grid gap-2">
        {ex.options.map((o, i) => {
          const state = answered ? (i === ex.answer ? 'right' : i === picked ? 'wrong' : 'idle') : 'idle';
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => {
                setPicked(i);
                onAnswer(i === ex.answer);
              }}
              className={`text-left rounded-xl border px-4 py-3 transition ${
                state === 'right' ? 'border-emerald-500 bg-emerald-50' : state === 'wrong' ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white hover:border-amber-400'
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OrderExercise({ ex, onAnswer, answered }: { ex: Extract<Exercise, { kind: 'order' }>; onAnswer: (ok: boolean) => void; answered: boolean }) {
  const shuffled = useMemo(() => {
    let s = shuffle(ex.words.map((w, i) => ({ w, i })));
    // avoid presenting the solution already in order
    if (s.every((x, k) => x.i === k) && s.length > 1) s = [...s.slice(1), s[0]];
    return s;
  }, [ex]);
  const [chosen, setChosen] = useState<number[]>([]);
  const sentence = chosen.map((k) => shuffled[k].w).join(' ');
  const remaining = shuffled.map((x, k) => ({ ...x, k })).filter((x) => !chosen.includes(x.k));

  const check = () => {
    const targets = [ex.words.join(' '), ...(ex.alt || [])].map(normalize);
    onAnswer(targets.includes(normalize(sentence)));
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-500">Ordena las palabras · «{ex.es}»</p>
      <div className="min-h-[3.5rem] rounded-xl border-2 border-dashed border-slate-300 p-2 flex flex-wrap gap-2 bg-slate-50">
        {chosen.map((k, pos) => (
          <button
            key={k}
            disabled={answered}
            onClick={() => setChosen(chosen.filter((_, p) => p !== pos))}
            className="rounded-lg bg-slate-800 text-white px-3 py-1.5"
          >
            {shuffled[k].w}
          </button>
        ))}
        {!chosen.length && <span className="text-slate-400 self-center px-2">Toca las palabras en orden…</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {remaining.map((x) => (
          <button key={x.k} disabled={answered} onClick={() => setChosen([...chosen, x.k])} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:border-amber-400">
            {x.w}
          </button>
        ))}
      </div>
      {!answered && (
        <div className="flex gap-2">
          <button className="btn-primary" disabled={remaining.length > 0} onClick={check}>
            Comprobar
          </button>
          <button className="btn-ghost" onClick={() => setChosen([])}>
            Borrar
          </button>
        </div>
      )}
    </div>
  );
}
