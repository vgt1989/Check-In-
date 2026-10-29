import { useEffect, useMemo, useState } from 'react';
import { diffWords } from '../lib/check';
import { speak, stopSpeaking } from '../lib/speech';
import { useListenScores } from '../lib/state';
import type { Dictation, ListeningText } from '../types';
import { RatePicker, SpeakButton } from './Speak';

function splitSentences(text: string) {
  return text
    .split(/(?<=[.!?…])\s+|\s+—\s+/)
    .map((s) => s.replace(/^—\s*/, '').trim())
    .filter(Boolean);
}

export function ListeningPlayer({ item, defaultRate = 1, onFinish }: { item: ListeningText; defaultRate?: number; onFinish?: () => void }) {
  const [rate, setRate] = useState(defaultRate);
  const [playing, setPlaying] = useState<number | null>(null);
  const [showText, setShowText] = useState(false);
  const [showGloss, setShowGloss] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [, setScores] = useListenScores();
  const sentences = useMemo(() => splitSentences(item.text.replace(/\(Texto de práctica.*?\)/, '')), [item]);

  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    setAnswers({});
    setShowText(false);
    setShowGloss(false);
  }, [item.id]);

  const playFrom = (i: number) => {
    if (i >= sentences.length) {
      setPlaying(null);
      return;
    }
    setPlaying(i);
    speak(sentences[i], rate, () => playFrom(i + 1));
  };

  const allAnswered = Object.keys(answers).length === item.questions.length;
  const correct = item.questions.filter((q, i) => answers[i] === q.answer).length;

  useEffect(() => {
    if (allAnswered) {
      setScores((s) => ({ ...s, [item.id]: Math.max(s[item.id] || 0, correct / item.questions.length) }));
      onFinish?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAnswered]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="chip bg-sky-100 text-sky-800">{item.level}</span>
        <span className="chip bg-slate-100 text-slate-700">{item.type}</span>
        {item.register === 'tussentaal' && <span className="chip bg-amber-100 text-amber-800">tussentaal</span>}
      </div>
      <h3 className="text-lg font-semibold">{item.title}</h3>
      <ol className="text-sm text-slate-600 list-decimal pl-5 space-y-0.5">
        <li>Escucha 1 vez sin texto: ¿de qué trata?</li>
        <li>Responde a las preguntas. Puedes volver a escuchar.</li>
        <li>Abre la transcripción y escucha frase a frase lo que no hayas entendido.</li>
        <li>Sube la velocidad y repite en voz alta a la vez (shadowing).</li>
      </ol>
      <RatePicker rate={rate} onChange={setRate} />
      <div className="flex gap-2">
        {playing === null ? (
          <button className="btn-primary" onClick={() => playFrom(0)}>
            ▶ Escuchar todo
          </button>
        ) : (
          <button
            className="btn-ghost"
            onClick={() => {
              stopSpeaking();
              setPlaying(null);
            }}
          >
            ⏹ Parar
          </button>
        )}
        <button className="btn-ghost" onClick={() => setShowText(!showText)}>
          {showText ? 'Ocultar texto' : '📄 Transcripción'}
        </button>
        {item.glossary && (
          <button className="btn-ghost" onClick={() => setShowGloss(!showGloss)}>
            📖 Glosario
          </button>
        )}
      </div>
      {showGloss && item.glossary && (
        <ul className="text-sm grid sm:grid-cols-2 gap-1 bg-slate-50 rounded-xl p-3">
          {item.glossary.map((g) => (
            <li key={g.nl}>
              <strong>{g.nl}</strong> — {g.es}
            </li>
          ))}
        </ul>
      )}
      {showText && (
        <div className="space-y-1 bg-slate-50 rounded-xl p-3">
          {sentences.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                stopSpeaking();
                setPlaying(i);
                speak(s, rate, () => setPlaying(null));
              }}
              className={`block text-left w-full rounded-lg px-2 py-1 ${playing === i ? 'bg-amber-200' : 'hover:bg-white'}`}
            >
              {s}
            </button>
          ))}
          <p className="text-xs text-slate-400 pt-1">Toca una frase para escucharla sola.</p>
        </div>
      )}
      <div className="space-y-3">
        {item.questions.map((q, qi) => (
          <div key={qi}>
            <p className="font-medium mb-1">{q.q}</p>
            <div className="grid gap-1.5">
              {q.options.map((o, oi) => {
                const picked = answers[qi];
                const state = picked === undefined ? 'idle' : oi === q.answer ? 'right' : oi === picked ? 'wrong' : 'idle';
                return (
                  <button
                    key={oi}
                    disabled={picked !== undefined}
                    onClick={() => setAnswers({ ...answers, [qi]: oi })}
                    className={`text-left rounded-lg border px-3 py-2 text-sm ${
                      state === 'right' ? 'border-emerald-500 bg-emerald-50' : state === 'wrong' ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {allAnswered && (
          <p className="font-semibold">
            {correct}/{item.questions.length} correctas. {correct === item.questions.length ? 'Perfecto: ahora sube la velocidad y haz shadowing.' : 'Abre la transcripción y busca las respuestas.'}
          </p>
        )}
      </div>
    </div>
  );
}

export function DictationRunner({ items, defaultRate = 1, onFinish }: { items: Dictation[]; defaultRate?: number; onFinish?: () => void }) {
  const [i, setI] = useState(0);
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [rate, setRate] = useState(defaultRate);
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => () => stopSpeaking(), []);

  if (done) {
    return (
      <div className="text-center py-4">
        <div className="text-4xl">🎧</div>
        <p className="font-semibold">Dictado terminado: {Math.round((total / items.length) * 100)}% de palabras correctas.</p>
      </div>
    );
  }
  const item = items[i];
  const diff = checked ? diffWords(value, item.text) : null;

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-slate-500">
        <span>
          Frase {i + 1} / {items.length}
        </span>
        <span className="chip bg-sky-100 text-sky-800">{item.level}</span>
      </div>
      <RatePicker rate={rate} onChange={setRate} />
      <div className="flex gap-2">
        <button className="btn-primary" onClick={() => speak(item.text, rate)}>
          ▶ Escuchar
        </button>
        <button className="btn-ghost" onClick={() => speak(item.text, Math.max(0.6, rate - 0.25))}>
          🐢 Más despacio
        </button>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!checked && value.trim()) {
            setChecked(true);
            setTotal((t) => t + diffWords(value, item.text).score);
          }
        }}
        className="space-y-2"
      >
        <textarea
          className="input min-h-[4rem]"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={checked}
          placeholder="Escribe lo que oyes…"
          autoCapitalize="off"
          spellCheck={false}
        />
        {!checked && (
          <button className="btn-primary" disabled={!value.trim()}>
            Comprobar
          </button>
        )}
      </form>
      {diff && (
        <div className="rounded-xl bg-slate-50 p-3 space-y-2">
          <p className="flex flex-wrap gap-1">
            {diff.result.map((w, k) => (
              <span key={k} className={`rounded px-1 ${w.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800 underline'}`}>
                {w.word}
              </span>
            ))}
          </p>
          <p className="text-sm flex items-center gap-2">
            <span className="text-slate-500">Texto:</span> {item.text} <SpeakButton text={item.text} rate={rate} />
          </p>
          <button
            className="btn-primary"
            onClick={() => {
              if (i + 1 >= items.length) {
                setDone(true);
                onFinish?.();
              } else {
                setI(i + 1);
                setValue('');
                setChecked(false);
              }
            }}
          >
            {i + 1 >= items.length ? 'Terminar' : 'Siguiente →'}
          </button>
        </div>
      )}
    </div>
  );
}
