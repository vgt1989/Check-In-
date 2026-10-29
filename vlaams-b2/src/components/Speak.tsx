import { useEffect, useState } from 'react';
import { speak, stopSpeaking, ttsAvailable } from '../lib/speech';

export function SpeakButton({ text, rate = 1, label }: { text: string; rate?: number; label?: string }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  if (!ttsAvailable()) return null;
  return (
    <button
      type="button"
      className="btn-ghost !px-2 !py-1 text-sm"
      title="Escuchar"
      onClick={(e) => {
        e.stopPropagation();
        if (playing) {
          stopSpeaking();
          setPlaying(false);
          return;
        }
        setPlaying(true);
        speak(text, rate, () => setPlaying(false));
      }}
    >
      {playing ? '⏹' : '🔊'}
      {label && <span>{label}</span>}
    </button>
  );
}

export const RATES = [0.7, 0.85, 1, 1.15, 1.3];

export function RatePicker({ rate, onChange }: { rate: number; onChange: (r: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-1 text-sm">
      <span className="text-slate-500 mr-1">Velocidad:</span>
      {RATES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          className={`rounded-lg px-2 py-1 border ${r === rate ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-slate-300'}`}
        >
          {r === 1 ? '1×' : `${r}×`}
        </button>
      ))}
    </div>
  );
}
