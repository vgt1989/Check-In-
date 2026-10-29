import { useMemo, useState } from 'react';
import { themeLabels, vocabBank } from '../data/vocab';
import { dueCards } from '../lib/daily';
import { isLearned } from '../lib/srs';
import { useCards, useOwnWords } from '../lib/state';
import type { VocabItem, VocabTheme } from '../types';
import { SpeakButton } from './Speak';
import { VocabReview } from './VocabReview';

export function WordsView({ initial }: { initial?: string }) {
  const [cards] = useCards();
  const [own, setOwn] = useOwnWords();
  const [mode, setMode] = useState<'list' | 'review' | 'add'>(initial === 'add' ? 'add' : 'list');
  const [theme, setTheme] = useState<VocabTheme | 'all'>('all');
  const [q, setQ] = useState('');
  const all = useMemo(() => [...vocabBank, ...own], [own]);
  const due = dueCards(cards, all);
  const learned = all.filter((v) => isLearned(cards[v.id])).length;
  const started = all.filter((v) => cards[v.id]).length;

  const filtered = all.filter(
    (v) => (theme === 'all' || v.theme === theme) && (!q || (v.nl + ' ' + v.es).toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold">Vocabulario</h2>
        <div className="grid grid-cols-3 gap-2 mt-3 text-center">
          <Stat n={started} label="en estudio" />
          <Stat n={learned} label="aprendidas (≥21 días)" />
          <Stat n={due.length} label="para repasar hoy" />
        </div>
        <p className="text-sm text-slate-600 mt-3">
          Para un B2 necesitas unas 3.000–4.000 palabras. La app trae una base de {vocabBank.length} palabras muy útiles para Flandes. El resto lo construyes tú:
          añade cada día las palabras que oigas en series, en la radio o en el trabajo, y la app te las repasará con repetición espaciada.
        </p>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button className={mode === 'list' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMode('list')}>
            📚 Lista
          </button>
          <button className={mode === 'review' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMode('review')} disabled={!due.length}>
            🔁 Repasar ({due.length})
          </button>
          <button className={mode === 'add' ? 'btn-primary' : 'btn-ghost'} onClick={() => setMode('add')}>
            ➕ Añadir palabra
          </button>
        </div>
      </div>

      {mode === 'review' && (
        <div className="card">
          <VocabReview queue={due} onFinish={() => setMode('list')} />
        </div>
      )}

      {mode === 'add' && <AddWord onAdd={(w) => setOwn((o) => [w, ...o])} />}

      {mode === 'list' && (
        <div className="card space-y-3">
          <input className="input" placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="flex gap-1 flex-wrap">
            {(['all', ...Object.keys(themeLabels)] as (VocabTheme | 'all')[]).map((t) => (
              <button key={t} onClick={() => setTheme(t)} className={`chip !text-sm !px-3 !py-1 ${theme === t ? 'bg-slate-800 text-white' : 'bg-slate-100'}`}>
                {t === 'all' ? 'Todas' : themeLabels[t]}
              </button>
            ))}
          </div>
          <ul className="divide-y divide-slate-100">
            {filtered.map((v) => (
              <li key={v.id} className="py-2 flex items-start gap-2">
                <span className="flex-1">
                  <span className="font-medium">{v.nl}</span> <span className="text-slate-500">— {v.es}</span>
                  <span className="block text-sm italic text-slate-500">{v.ex}</span>
                </span>
                <SpeakButton text={v.nl} />
                <span className="text-xs w-16 text-right pt-1.5">
                  {isLearned(cards[v.id]) ? '✅' : cards[v.id] ? `⏳ ${cards[v.id].interval}d` : ''}
                </span>
                {v.own && (
                  <button className="text-slate-400 hover:text-rose-500 pt-1" title="Borrar" onClick={() => setOwn((o) => o.filter((x) => x.id !== v.id))}>
                    ✕
                  </button>
                )}
              </li>
            ))}
            {!filtered.length && <li className="py-4 text-slate-500 text-center">Ninguna palabra.</li>}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-2">
      <div className="text-2xl font-bold">{n}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function AddWord({ onAdd }: { onAdd: (w: VocabItem) => void }) {
  const [nl, setNl] = useState('');
  const [es, setEs] = useState('');
  const [ex, setEx] = useState('');
  const [added, setAdded] = useState<string[]>([]);
  return (
    <form
      className="card space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!nl.trim() || !es.trim()) return;
        onAdd({ id: `eigen:${Date.now()}`, nl: nl.trim(), es: es.trim(), ex: ex.trim() || nl.trim(), theme: 'eigen', level: 'B1', own: true });
        setAdded((a) => [nl.trim(), ...a]);
        setNl('');
        setEs('');
        setEx('');
      }}
    >
      <h3 className="font-semibold">Añadir una palabra o expresión</h3>
      <p className="text-sm text-slate-500">Consejo: escribe los sustantivos con su artículo (de/het) y apunta siempre la frase en la que la oíste.</p>
      <input className="input" placeholder="Neerlandés (p. ej. «de afspraak»)" value={nl} onChange={(e) => setNl(e.target.value)} autoCapitalize="off" />
      <input className="input" placeholder="Español" value={es} onChange={(e) => setEs(e.target.value)} />
      <input className="input" placeholder="Frase de ejemplo (opcional)" value={ex} onChange={(e) => setEx(e.target.value)} />
      <button className="btn-primary" disabled={!nl.trim() || !es.trim()}>
        Añadir
      </button>
      {added.length > 0 && <p className="text-sm text-emerald-700">Añadidas: {added.join(', ')}. Aparecerán como nuevas en tu sesión de hoy o de mañana.</p>}
    </form>
  );
}
