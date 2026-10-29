import { useState } from 'react';
import { accents, expressions, mediaSources, reductions } from '../data/vlaams';
import { SpeakButton } from './Speak';

export function VlaamsView({ initial }: { initial?: string }) {
  const [tab, setTab] = useState<'accenten' | 'uitdrukkingen' | 'media'>(initial === 'media' ? 'media' : 'accenten');
  const [onlyVlaams, setOnlyVlaams] = useState(false);
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold">El flamenco de verdad</h2>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button className={tab === 'accenten' ? 'btn-primary' : 'btn-ghost'} onClick={() => setTab('accenten')}>
            🗺️ Acentos
          </button>
          <button className={tab === 'uitdrukkingen' ? 'btn-primary' : 'btn-ghost'} onClick={() => setTab('uitdrukkingen')}>
            💬 Expresiones
          </button>
          <button className={tab === 'media' ? 'btn-primary' : 'btn-ghost'} onClick={() => setTab('media')}>
            📺 Fuentes reales
          </button>
        </div>
      </div>

      {tab === 'accenten' && (
        <>
          {accents.map((a) => (
            <details key={a.id} className={`card ${a.priority ? 'ring-2 ring-amber-400' : ''}`} open={a.priority}>
              <summary className="cursor-pointer font-bold text-lg">
                {a.name} {a.priority && <span className="chip bg-amber-100 text-amber-800 ml-1">tu prioridad</span>}
              </summary>
              <p className="mt-2 text-slate-700">{a.intro}</p>
              <div className="mt-3 space-y-3">
                {a.features.map((f) => (
                  <div key={f.title}>
                    <p className="font-semibold">{f.title}</p>
                    <p className="text-sm text-slate-700">{f.text}</p>
                    {f.examples && <p className="text-sm text-slate-500 italic">{f.examples.join(' · ')}</p>}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-sm font-medium">Dónde escucharlo:</p>
              <ul className="text-sm list-disc pl-5 text-slate-700">
                {a.listen.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </details>
          ))}
          <div className="card">
            <h3 className="font-bold">Formas del habla rápida ({reductions.length})</h3>
            <ul className="mt-2 divide-y divide-slate-100 text-sm">
              {reductions.map((r) => (
                <li key={r.spoken} className="py-1.5">
                  🗣️ <strong>{r.spoken}</strong> → {r.standard} {r.note && <span className="text-slate-500">· {r.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {tab === 'uitdrukkingen' && (
        <div className="card space-y-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={onlyVlaams} onChange={(e) => setOnlyVlaams(e.target.checked)} /> Solo las típicamente flamencas 🇧🇪
          </label>
          <ul className="divide-y divide-slate-100">
            {expressions
              .filter((e) => !onlyVlaams || e.vlaams)
              .map((e) => (
                <li key={e.nl} className="py-2.5">
                  <p className="font-semibold flex items-center gap-2">
                    {e.nl} <SpeakButton text={e.nl} />
                    {e.vlaams && <span className="chip bg-amber-100 text-amber-800">🇧🇪</span>}
                  </p>
                  <p>{e.es}</p>
                  {e.note && <p className="text-sm text-slate-500">{e.note}</p>}
                  {e.ex && <p className="text-sm italic text-slate-600">«{e.ex}»</p>}
                </li>
              ))}
          </ul>
        </div>
      )}

      {tab === 'media' && (
        <div className="space-y-3">
          {mediaSources.map((m) => (
            <div key={m.name} className="card">
              <div className="flex items-center gap-2">
                <h3 className="font-bold flex-1">{m.name}</h3>
                <span className="chip bg-sky-100 text-sky-800">{m.level}</span>
              </div>
              <p className="text-sm text-slate-700 mt-1">{m.what}</p>
              <p className="text-sm text-amber-800 mt-1">👉 {m.how}</p>
            </div>
          ))}
          <p className="text-xs text-slate-500 px-1">Algunas plataformas (VRT MAX, VTM GO) requieren una cuenta gratuita y pueden estar limitadas fuera de Bélgica.</p>
        </div>
      )}
    </div>
  );
}
