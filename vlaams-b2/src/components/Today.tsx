import { useMemo, useState, type ReactNode } from 'react';
import { lessonById } from '../data/grammar';
import { phases, weekPlan } from '../data/plan';
import { vocabBank } from '../data/vocab';
import { dailyDictations, dailyGrammar, dailyListening, dailyVlaams, dueCards, newWords } from '../lib/daily';
import { todayISO } from '../lib/dates';
import { dayInfo, useCards, useExStats, useLessonsRead, useOwnWords, useSessions, useSettings, useWritings, type TaskId } from '../lib/state';
import { ExerciseRunner } from './ExerciseRunner';
import { DictationRunner, ListeningPlayer } from './Listening';
import { SpeakButton } from './Speak';
import { VocabReview } from './VocabReview';
import { SpeakingPractice } from './Speaking';

type Go = (tab: string, arg?: string) => void;

export function Today({ go }: { go: Go }) {
  const [settings] = useSettings();
  const [cards] = useCards();
  const [own] = useOwnWords();
  const [stats] = useExStats();
  const [sessions, setSessions] = useSessions();
  const [read] = useLessonsRead();
  const [writings, setWritings] = useWritings();
  const [open, setOpen] = useState<TaskId | null>(null);
  const today = todayISO();
  const { day, week, dayOfWeek } = dayInfo(settings.startDate);
  const wp = weekPlan(week);
  const phase = phases[wp.phase - 1];
  const done = sessions[today] || {};

  // Freeze today's selections so they don't reshuffle after every answer
  const session = useMemo(() => {
    const all = [...vocabBank, ...own];
    const due = dueCards(cards, all, today);
    const fresh = newWords(week, cards, own, settings.newPerDay);
    return {
      due,
      fresh,
      grammar: dailyGrammar(week, stats, today),
      listening: dailyListening(week, dayOfWeek),
      dictations: dailyDictations(wp.phase, today),
      vlaams: dailyVlaams(day),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [today, week]);

  const mark = (id: TaskId, value = true) => setSessions((s) => ({ ...s, [today]: { ...s[today], [id]: value } }));

  const mainLesson = lessonById(wp.grammar[0]);
  const lessonUnread = mainLesson && !read[mainLesson.id];
  const outputIsWriting = dayOfWeek % 2 === 0;

  const tasks: { id: TaskId; icon: string; title: string; minutes: number; subtitle: string; body: ReactNode }[] = [
    {
      id: 'woorden',
      icon: '🗂️',
      title: 'Vocabulario',
      minutes: 8,
      subtitle: `${session.due.length} repasos + ${session.fresh.length} nuevas`,
      body: <VocabReview queue={[...session.due, ...session.fresh]} newIds={new Set(session.fresh.map((f) => f.id))} onFinish={() => mark('woorden')} />,
    },
    {
      id: 'grammatica',
      icon: '🧩',
      title: 'Gramática',
      minutes: 10,
      subtitle: mainLesson ? `${mainLesson.title}${wp.grammar.length > 1 ? ' + repaso' : ''}` : '',
      body: (
        <div className="space-y-4">
          {lessonUnread && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-sm">
              <p className="font-medium">Lección nueva esta semana: {mainLesson!.title}</p>
              <p>Lee la explicación antes de hacer los ejercicios (5 min).</p>
              <button className="btn-primary mt-2" onClick={() => go('grammatica', mainLesson!.id)}>
                Abrir la lección
              </button>
            </div>
          )}
          <ExerciseRunner items={session.grammar} onFinish={() => mark('grammatica')} />
        </div>
      ),
    },
    {
      id: 'luisteren',
      icon: '🎧',
      title: 'Comprensión auditiva',
      minutes: 7,
      subtitle: `${session.listening.title} · velocidad ${wp.speed}×`,
      body: <ListeningPlayer item={session.listening} defaultRate={wp.speed} onFinish={() => mark('luisteren')} />,
    },
    {
      id: 'dictee',
      icon: '✍️',
      title: 'Dictado',
      minutes: 5,
      subtitle: '5 frases para entrenar el oído',
      body: <DictationRunner items={session.dictations} defaultRate={wp.speed} onFinish={() => mark('dictee')} />,
    },
    {
      id: 'vlaams',
      icon: '🦁',
      title: 'Flamenco de la calle',
      minutes: 4,
      subtitle: '3 expresiones + 3 formas del habla rápida',
      body: (
        <div className="space-y-4">
          <div className="space-y-2">
            {session.vlaams.ex.map((e) => (
              <div key={e.nl} className="rounded-xl border border-slate-200 p-3">
                <p className="font-semibold flex items-center gap-2">
                  {e.nl} <SpeakButton text={e.nl} />
                  {e.vlaams && <span className="chip bg-amber-100 text-amber-800">🇧🇪 Vlaams</span>}
                </p>
                <p className="text-slate-700">{e.es}</p>
                {e.note && <p className="text-sm text-slate-500">{e.note}</p>}
                {e.ex && <p className="text-sm italic text-slate-600">«{e.ex}»</p>}
              </div>
            ))}
          </div>
          <div>
            <p className="font-medium mb-2">Así suena cuando hablan rápido:</p>
            <div className="space-y-2">
              {session.vlaams.red.map((r) => (
                <div key={r.spoken} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p>
                    🗣️ <strong>{r.spoken}</strong> → {r.standard}
                  </p>
                  {r.note && <p className="text-slate-500">{r.note}</p>}
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm text-slate-600">Reto: usa hoy una de estas expresiones en una conversación o en un mensaje.</p>
          <button className="btn-primary" onClick={() => mark('vlaams')}>
            Hecho ✓
          </button>
        </div>
      ),
    },
    {
      id: 'media',
      icon: '📺',
      title: 'Neerlandés real (fuera de la app)',
      minutes: 10,
      subtitle: 'Misión de la semana',
      body: (
        <div className="space-y-3">
          <p>{wp.media}</p>
          <p className="text-sm text-slate-600">Apunta 3–5 palabras nuevas que oigas y añádelas en «Palabras». Así el vocabulario crece con lo que tú escuchas de verdad.</p>
          <div className="flex gap-2 flex-wrap">
            <button className="btn-ghost" onClick={() => go('woorden', 'add')}>
              ➕ Añadir palabras
            </button>
            <button className="btn-ghost" onClick={() => go('vlaams', 'media')}>
              Ver fuentes recomendadas
            </button>
            <button className="btn-primary" onClick={() => mark('media')}>
              Hecho ✓
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'output',
      icon: outputIsWriting ? '📝' : '🎙️',
      title: outputIsWriting ? 'Expresión escrita' : 'Expresión oral',
      minutes: 6,
      subtitle: 'Producción: escribir y hablar alternan cada día',
      body: outputIsWriting ? (
        <div className="space-y-3">
          <p className="font-medium">{wp.writing}</p>
          <textarea
            className="input min-h-[10rem]"
            value={writings[today] || ''}
            onChange={(e) => setWritings((w) => ({ ...w, [today]: e.target.value }))}
            placeholder="Schrijf hier…"
            spellCheck={false}
          />
          <details className="text-sm text-slate-600">
            <summary className="cursor-pointer font-medium">Comprueba tu texto antes de terminar</summary>
            <ul className="list-disc pl-5 mt-1 space-y-0.5">
              <li>¿Está el verbo conjugado en 2ª posición en cada oración principal?</li>
              <li>¿Va el verbo al final tras omdat / dat / als / hoewel…?</li>
              <li>¿hebben o zijn en el perfecto? ¿El participio al final?</li>
              <li>¿Has usado al menos 2 conectores y 2 palabras nuevas de esta semana?</li>
              <li>Lee el texto en voz alta (🔊 abajo) y escucha si suena natural.</li>
            </ul>
          </details>
          <div className="flex gap-2 flex-wrap items-center">
            {writings[today] && <SpeakButton text={writings[today]} label="Escuchar mi texto" />}
            <span className="text-sm text-slate-500">{(writings[today] || '').trim().split(/\s+/).filter(Boolean).length} palabras</span>
            <button className="btn-primary ml-auto" onClick={() => mark('output')} disabled={!(writings[today] || '').trim()}>
              Guardar y terminar ✓
            </button>
          </div>
        </div>
      ) : (
        <SpeakingPractice task={wp.speaking} text={session.listening} onDone={() => mark('output')} />
      ),
    },
  ];

  const completed = tasks.filter((t) => done[t.id]).length;
  const minutesLeft = tasks.filter((t) => !done[t.id]).reduce((a, t) => a + t.minutes, 0);

  return (
    <div className="space-y-4">
      <div className="card bg-slate-800 text-white border-slate-800">
        <p className="text-amber-300 text-sm font-medium">
          {phase.title} · {phase.level}
        </p>
        <h2 className="text-xl font-bold">
          Semana {week} · Día {dayOfWeek + 1}: {wp.title}
        </h2>
        <p className="text-slate-300 text-sm mt-1">🎯 {wp.goal}</p>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-600 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400" style={{ width: `${(completed / tasks.length) * 100}%` }} />
          </div>
          <span className="text-sm">
            {completed}/{tasks.length} · {minutesLeft ? `~${minutesLeft} min restantes` : '¡Sesión completa! 🎉'}
          </span>
        </div>
        {wp.test && (
          <button className="mt-3 btn bg-amber-400 text-slate-900" onClick={() => go('voortgang', 'test')}>
            📋 Esta semana toca la prueba de fase
          </button>
        )}
      </div>

      {tasks.map((t) => (
        <div key={t.id} className={`card !p-0 overflow-hidden ${done[t.id] ? 'opacity-80' : ''}`}>
          <button className="w-full flex items-center gap-3 p-4 text-left" onClick={() => setOpen(open === t.id ? null : t.id)}>
            <span className="text-2xl">{t.icon}</span>
            <span className="flex-1">
              <span className="font-semibold block">
                {t.title} <span className="text-slate-400 font-normal text-sm">· {t.minutes} min</span>
              </span>
              <span className="text-sm text-slate-500">{t.subtitle}</span>
            </span>
            <span
              role="checkbox"
              aria-checked={!!done[t.id]}
              onClick={(e) => {
                e.stopPropagation();
                mark(t.id, !done[t.id]);
              }}
              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${done[t.id] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}
            >
              {done[t.id] ? '✓' : ''}
            </span>
          </button>
          {open === t.id && <div className="px-4 pb-4 border-t border-slate-100 pt-4">{t.body}</div>}
        </div>
      ))}
    </div>
  );
}
