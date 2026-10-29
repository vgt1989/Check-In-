import { useMemo, useState } from 'react';
import { dictations, listeningTexts } from '../data/listening';
import { reductions } from '../data/vlaams';
import { shuffle } from '../lib/dates';
import { useListenScores } from '../lib/state';
import type { Level } from '../types';
import { DictationRunner, ListeningPlayer } from './Listening';
import { SpeakButton } from './Speak';

export function ListenView() {
  const [scores] = useListenScores();
  const [selected, setSelected] = useState<string | null>(null);
  const [mode, setMode] = useState<'texts' | 'dictee' | 'snel'>('texts');
  const [dictLevel, setDictLevel] = useState<Level>('A2');
  const [dictKey, setDictKey] = useState(0);
  const item = listeningTexts.find((t) => t.id === selected);
  const dictItems = useMemo(() => shuffle(dictations.filter((d) => d.level === dictLevel)).slice(0, 6), [dictLevel, dictKey]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold">Comprensión auditiva</h2>
        <p className="text-sm text-slate-600 mt-1">
          El audio usa la voz neerlandesa de tu dispositivo (elige una voz <strong>nl-BE</strong> en Progreso → Ajustes si la tienes). La voz sintética no imita acentos regionales;
          para eso están las misiones de «neerlandés real» y la guía de acentos en la pestaña Vlaams.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button className={mode === 'texts' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMode('texts')}>
            🎧 Textos
          </button>
          <button className={mode === 'dictee' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMode('dictee')}>
            ✍️ Dictado
          </button>
          <button className={mode === 'snel' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMode('snel')}>
            ⚡ Habla rápida
          </button>
        </div>
      </div>

      {mode === 'texts' &&
        (item ? (
          <div className="card space-y-3">
            <button className="btn-ghost" onClick={() => setSelected(null)}>
              ← Todos los textos
            </button>
            <ListeningPlayer item={item} />
          </div>
        ) : (
          listeningTexts.map((t) => (
            <button key={t.id} className="card w-full text-left flex items-center gap-3 hover:border-amber-400" onClick={() => setSelected(t.id)}>
              <span className="chip bg-sky-100 text-sky-800">{t.level}</span>
              <span className="flex-1">
                <span className="font-semibold block">{t.title}</span>
                <span className="text-sm text-slate-500">
                  {t.type}
                  {t.register === 'tussentaal' ? ' · tussentaal' : ''}
                </span>
              </span>
              {scores[t.id] !== undefined && <span className="text-sm">{Math.round(scores[t.id] * 100)}%</span>}
            </button>
          ))
        ))}

      {mode === 'dictee' && (
        <div className="card space-y-3">
          <div className="flex gap-2">
            {(['A2', 'B1', 'B2'] as Level[]).map((l) => (
              <button key={l} className={dictLevel === l ? 'btn-primary' : 'btn-ghost'} onClick={() => { setDictLevel(l); setDictKey((k) => k + 1); }}>
                {l}
              </button>
            ))}
          </div>
          <DictationRunner key={dictKey} items={dictItems} />
        </div>
      )}

      {mode === 'snel' && <FastSpeech />}
    </div>
  );
}

function FastSpeech() {
  const [quiz] = useState(() => shuffle(reductions).slice(0, 8));
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const current = quiz[i];
  const [options, setOptions] = useState(() => makeOptions(0));

  function makeOptions(idx: number) {
    const right = quiz[idx].standard;
    const wrong = shuffle(reductions.filter((r) => r.standard !== right)).slice(0, 2).map((r) => r.standard);
    return shuffle([right, ...wrong]);
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-2 text-sm text-slate-700">
        <h3 className="font-bold text-base">Cómo entender a la gente cuando habla rápido</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>No intentes entender cada palabra.</strong> Busca las palabras clave (sustantivos y verbos) y el verbo del final de la frase.
          </li>
          <li>
            <strong>Aprende las formas reducidas</strong> (’k, ’t, da, nie, hebde, zijde…): son siempre las mismas y aparecen continuamente.
          </li>
          <li>
            <strong>Escalera de velocidad:</strong> escucha a 0,85×, luego a 1×, luego a 1,15×. Cuando 1,15× te resulte fácil, la velocidad normal te parecerá lenta.
          </li>
          <li>
            <strong>Shadowing:</strong> repetir a la vez que el audio entrena el oído y la boca al mismo tiempo.
          </li>
          <li>
            <strong>Subtítulos en neerlandés</strong>, nunca en español. Mira la misma escena 3 veces: con subtítulos, sin ellos y otra vez con ellos.
          </li>
          <li>
            Si no entiendes, pide: <em>«Sorry, kunt u wat trager spreken?»</em> o <em>«Wablieft?»</em>. Los flamencos suelen pasarse al estándar sin problema.
          </li>
        </ul>
      </div>
      <div className="card space-y-3">
        <h3 className="font-bold">Quiz: ¿qué significa en estándar?</h3>
        {i < quiz.length ? (
          <>
            <p className="text-sm text-slate-500">
              {i + 1} / {quiz.length}
            </p>
            <p className="text-xl font-semibold flex items-center gap-2">
              🗣️ {current.spoken} <SpeakButton text={current.spoken} rate={1.15} />
            </p>
            <div className="grid gap-2">
              {options.map((o, k) => {
                const state = picked === null ? 'idle' : o === current.standard ? 'right' : k === picked ? 'wrong' : 'idle';
                return (
                  <button
                    key={o}
                    disabled={picked !== null}
                    onClick={() => {
                      setPicked(k);
                      if (o === current.standard) setScore((s) => s + 1);
                    }}
                    className={`text-left rounded-xl border px-4 py-2 ${state === 'right' ? 'border-emerald-500 bg-emerald-50' : state === 'wrong' ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
            {picked !== null && (
              <>
                {current.note && <p className="text-sm text-slate-600">💡 {current.note}</p>}
                <button
                  className="btn-primary"
                  onClick={() => {
                    setPicked(null);
                    if (i + 1 < quiz.length) setOptions(makeOptions(i + 1));
                    setI(i + 1);
                  }}
                >
                  Siguiente →
                </button>
              </>
            )}
          </>
        ) : (
          <p className="font-semibold">
            {score}/{quiz.length} correctas. Vuelve a abrir esta pestaña para hacer otro quiz.
          </p>
        )}
      </div>
    </div>
  );
}
