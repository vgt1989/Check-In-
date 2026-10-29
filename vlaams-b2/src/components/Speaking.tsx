import { useState } from 'react';
import { diffWords } from '../lib/check';
import { listen, recognitionAvailable } from '../lib/speech';
import type { ListeningText } from '../types';
import { SpeakButton } from './Speak';

export function SpeakingPractice({ task, text, onDone }: { task: string; text: ListeningText; onDone: () => void }) {
  const sentences = text.text
    .replace(/\(Texto de práctica.*?\)/, '')
    .split(/(?<=[.!?…])\s+|\s+—\s+/)
    .map((s) => s.replace(/^—\s*/, '').trim())
    .filter((s) => s.split(' ').length >= 4)
    .slice(0, 6);
  const [i, setI] = useState(0);
  const [heard, setHeard] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const target = sentences[i] || '';
  const diff = heard ? diffWords(heard, target) : null;

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
        <p className="text-sm font-medium text-amber-900">Tarea de la semana</p>
        <p>{task}</p>
      </div>
      <div>
        <p className="font-medium mb-1">Shadowing ({i + 1}/{sentences.length})</p>
        <p className="text-sm text-slate-600 mb-2">Escucha la frase y repítela imitando el ritmo y la entonación. {recognitionAvailable() ? 'Pulsa 🎙️ para que el navegador compruebe tu pronunciación.' : ''}</p>
        <div className="rounded-xl border border-slate-200 p-3 space-y-2">
          <p className="text-lg">{target}</p>
          <div className="flex gap-2 flex-wrap">
            <SpeakButton text={target} rate={0.85} label="Lento" />
            <SpeakButton text={target} rate={1.1} label="Rápido" />
            {recognitionAvailable() && (
              <button
                className={`btn ${listening ? 'bg-rose-500 text-white' : 'btn-ghost'}`}
                onClick={() => {
                  setError(null);
                  setHeard(null);
                  setListening(true);
                  listen(
                    (t) => setHeard(t),
                    () => setListening(false),
                    (e) => setError(e === 'not-allowed' ? 'Permite el acceso al micrófono.' : `Error: ${e}`),
                  );
                }}
              >
                🎙️ {listening ? 'Escuchando…' : 'Decirlo'}
              </button>
            )}
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          {diff && (
            <div className="text-sm">
              <p className="text-slate-500">El navegador ha entendido: «{heard}»</p>
              <p className="flex flex-wrap gap-1 mt-1">
                {diff.result.map((w, k) => (
                  <span key={k} className={`rounded px-1 ${w.ok ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                    {w.word}
                  </span>
                ))}
              </p>
              <p className="mt-1">{diff.score > 0.8 ? '¡Muy bien pronunciado!' : 'Repítelo más despacio, palabra a palabra.'}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-2">
          <button className="btn-ghost" disabled={i === 0} onClick={() => { setI(i - 1); setHeard(null); }}>
            ← Anterior
          </button>
          <button className="btn-ghost" disabled={i >= sentences.length - 1} onClick={() => { setI(i + 1); setHeard(null); }}>
            Siguiente →
          </button>
          <button className="btn-primary ml-auto" onClick={onDone}>
            Hecho ✓
          </button>
        </div>
      </div>
    </div>
  );
}
