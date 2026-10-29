import { useEffect, useMemo, useState } from 'react';
import { exercisesOf, grammar, lessonById } from '../data/grammar';
import { plan } from '../data/plan';
import { shuffle, todayISO } from '../lib/dates';
import { useExStats, useLessonsRead } from '../lib/state';
import type { GrammarFocus } from '../types';
import { ExerciseRunner } from './ExerciseRunner';
import { SpeakButton } from './Speak';

const focusLabel: Record<GrammarFocus, string> = {
  woordvolgorde: 'Orden de palabras',
  werkwoorden: 'Verbos y tiempos',
  zinsbouw: 'Estructura de la frase',
  spreektaal: 'Lengua hablada',
  register: 'Registro',
};

function weekOf(id: string) {
  return plan.find((w) => w.grammar[0] === id)?.week ?? plan.find((w) => w.grammar.includes(id))?.week ?? 0;
}

export function GrammarView({ initial }: { initial?: string }) {
  const [selected, setSelected] = useState<string | null>(initial || null);
  const [stats] = useExStats();
  useEffect(() => {
    if (initial) setSelected(initial);
  }, [initial]);

  if (selected) return <LessonView id={selected} onBack={() => setSelected(null)} />;

  const accuracy = (id: string) => {
    const keys = exercisesOf(id).map((e) => e.key);
    const ok = keys.reduce((a, k) => a + (stats[k]?.ok || 0), 0);
    const ko = keys.reduce((a, k) => a + (stats[k]?.ko || 0), 0);
    return ok + ko ? Math.round((ok / (ok + ko)) * 100) : null;
  };

  const sorted = [...grammar].sort((a, b) => weekOf(a.id) - weekOf(b.id));

  return (
    <div className="space-y-3">
      <div className="card">
        <h2 className="text-xl font-bold">Gramática</h2>
        <p className="text-sm text-slate-600">21 lecciones con las explicaciones en español. Tus puntos débiles (orden de palabras y verbos) aparecen primero y se repasan durante todo el plan.</p>
      </div>
      {sorted.map((l) => {
        const acc = accuracy(l.id);
        return (
          <button key={l.id} className="card w-full text-left flex items-center gap-3 hover:border-amber-400" onClick={() => setSelected(l.id)}>
            <span className="w-10 text-center text-xs text-slate-400">S{weekOf(l.id)}</span>
            <span className="flex-1">
              <span className="font-semibold block">{l.title}</span>
              <span className="text-sm text-slate-500">{l.titleEs}</span>
              <span className="flex gap-1 mt-1">
                <span className="chip bg-sky-100 text-sky-800">{l.level}</span>
                <span className="chip bg-slate-100 text-slate-600">{focusLabel[l.focus]}</span>
              </span>
            </span>
            {acc !== null && (
              <span className={`text-sm font-semibold ${acc >= 80 ? 'text-emerald-600' : acc >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>{acc}%</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function LessonView({ id, onBack }: { id: string; onBack: () => void }) {
  const lesson = lessonById(id)!;
  const [, setRead] = useLessonsRead();
  const [practice, setPractice] = useState(false);
  const items = useMemo(() => shuffle(exercisesOf(id)), [id, practice]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setRead((r) => (r[id] ? r : { ...r, [id]: todayISO() }));
    window.scrollTo(0, 0);
  }, [id, setRead]);

  return (
    <div className="space-y-4">
      <button className="btn-ghost" onClick={onBack}>
        ← Todas las lecciones
      </button>
      <div className="card">
        <span className="chip bg-sky-100 text-sky-800">{lesson.level}</span>
        <h2 className="text-2xl font-bold mt-1">{lesson.title}</h2>
        <p className="text-slate-500">{lesson.titleEs}</p>
        <p className="mt-3 rounded-xl bg-amber-50 p-3 text-amber-900">📌 {lesson.summary}</p>
      </div>
      {!practice &&
        lesson.sections.map((s) => (
          <div key={s.title} className="card space-y-3">
            <h3 className="font-bold text-lg">{s.title}</h3>
            {s.text && <p className="text-slate-700 leading-relaxed">{s.text}</p>}
            {s.table && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      {s.table[0].map((h) => (
                        <th key={h} className="text-left bg-slate-100 px-2 py-1.5 font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {s.table.slice(1).map((row, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        {row.map((c, j) => (
                          <td key={j} className="px-2 py-1.5">
                            {c}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {s.examples && (
              <ul className="space-y-2">
                {s.examples.map((e) => (
                  <li key={e.nl} className="rounded-xl bg-slate-50 p-2.5">
                    <p className="font-medium flex items-center gap-2">
                      {e.nl} <SpeakButton text={e.nl} />
                    </p>
                    <p className="text-sm text-slate-500">{e.es}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      <div className="card">
        {practice ? (
          <>
            <ExerciseRunner key={id} items={items} showLesson={false} />
            <button className="btn-ghost mt-4" onClick={() => setPractice(false)}>
              ← Volver a la explicación
            </button>
          </>
        ) : (
          <button className="btn-primary w-full" onClick={() => setPractice(true)}>
            ✏️ Practicar ({lesson.exercises.length} ejercicios)
          </button>
        )}
      </div>
    </div>
  );
}
