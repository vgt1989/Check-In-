import { useState } from 'react';
import { newCard, review, type Grade } from '../lib/srs';
import { useCards, useSettings } from '../lib/state';
import type { VocabItem } from '../types';
import { SpeakButton } from './Speak';
import { themeLabels } from '../data/vocab';

interface Props {
  queue: VocabItem[];
  newIds?: Set<string>;
  onFinish?: () => void;
}

const grades: { g: Grade; label: string; cls: string }[] = [
  { g: 0, label: 'Otra vez', cls: 'bg-rose-100 text-rose-800 hover:bg-rose-200' },
  { g: 1, label: 'Difícil', cls: 'bg-orange-100 text-orange-800 hover:bg-orange-200' },
  { g: 2, label: 'Bien', cls: 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' },
  { g: 3, label: 'Fácil', cls: 'bg-sky-100 text-sky-800 hover:bg-sky-200' },
];

export function VocabReview({ queue: initial, newIds, onFinish }: Props) {
  const [queue, setQueue] = useState(initial);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const [cards, setCards] = useCards();
  const [settings] = useSettings();

  if (!queue.length) {
    return (
      <div className="text-center py-6 space-y-2">
        <div className="text-4xl">✅</div>
        <p className="font-semibold">{reviewed ? `¡Hecho! Has repasado ${reviewed} tarjetas.` : 'No hay tarjetas pendientes.'}</p>
        <p className="text-sm text-slate-500">Consejo: añade 3–5 palabras nuevas de la serie o noticia de hoy en «Palabras → Añadir».</p>
      </div>
    );
  }

  const item = queue[0];
  const isNew = newIds?.has(item.id) || !cards[item.id];
  // Direction: new cards always NL→ES first; mix alternates by id hash
  const hash = [...item.id].reduce((a, c) => a + c.charCodeAt(0), 0) + reviewed;
  const dir = isNew ? 'nl-es' : settings.cardDirection === 'mix' ? (hash % 2 ? 'es-nl' : 'nl-es') : settings.cardDirection;

  const grade = (g: Grade) => {
    const prev = cards[item.id] || newCard();
    const next = review(prev, g);
    setCards((c) => ({ ...c, [item.id]: next }));
    setReviewed((r) => r + 1);
    setFlipped(false);
    const rest = queue.slice(1);
    // "again" puts the card back a few positions later
    const updated = g === 0 ? [...rest.slice(0, 3), item, ...rest.slice(3)] : rest;
    setQueue(updated);
    if (!updated.length) onFinish?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between text-sm text-slate-500">
        <span>Quedan {queue.length}</span>
        <span className="chip bg-slate-100">{isNew ? '🆕 nueva' : 'repaso'} · {themeLabels[item.theme]}</span>
      </div>
      <button
        type="button"
        onClick={() => setFlipped(true)}
        className="w-full min-h-[12rem] rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-amber-50 p-6 flex flex-col items-center justify-center gap-3 text-center"
      >
        {dir === 'nl-es' ? (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold">{item.nl}</span>
            <SpeakButton text={item.nl} />
          </div>
        ) : (
          <span className="text-2xl font-semibold">{item.es}</span>
        )}
        {!flipped && <span className="text-sm text-slate-400">Toca para ver la respuesta · {dir === 'es-nl' ? 'di la palabra en neerlandés en voz alta' : 'piensa en el significado'}</span>}
        {flipped && (
          <div className="space-y-2">
            {dir === 'nl-es' ? (
              <p className="text-lg text-amber-800">{item.es}</p>
            ) : (
              <p className="text-lg text-amber-800 flex items-center gap-2 justify-center">
                {item.nl} <SpeakButton text={item.nl} />
              </p>
            )}
            <p className="text-slate-600 italic flex items-center gap-2 justify-center">
              {item.ex} <SpeakButton text={item.ex} />
            </p>
          </div>
        )}
      </button>
      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          {grades.map(({ g, label, cls }) => (
            <button key={g} onClick={() => grade(g)} className={`rounded-xl py-3 font-medium ${cls}`}>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
