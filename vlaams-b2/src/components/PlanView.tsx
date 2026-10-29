import { useState } from 'react';
import { lessonById } from '../data/grammar';
import { listeningTexts } from '../data/listening';
import { phases, plan } from '../data/plan';
import { themeLabels } from '../data/vocab';
import { dayInfo, useSettings } from '../lib/state';

export function PlanView({ go }: { go: (tab: string, arg?: string) => void }) {
  const [settings] = useSettings();
  const { week: current } = dayInfo(settings.startDate);
  const [openWeek, setOpenWeek] = useState<number | null>(current);

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold">Tu plan: de A2 a B2 en 26 semanas</h2>
        <p className="text-slate-600 mt-1 text-sm">
          Unos 40 minutos al día, 7 días a la semana: alrededor de 120 horas en la app, más el tiempo con series, radio y conversación. Es un ritmo
          intenso: para llegar al B2 en 6 meses, el contacto con el neerlandés real fuera de la app (series, radio, hablar con gente) es tan importante como
          los ejercicios.
        </p>
      </div>
      {phases.map((ph) => (
        <div key={ph.phase} className="space-y-2">
          <div className="px-1">
            <h3 className="font-bold text-lg">{ph.title}</h3>
            <p className="text-sm text-slate-500">
              {ph.range} · {ph.level} — {ph.goal}
            </p>
          </div>
          {plan
            .filter((w) => w.phase === ph.phase)
            .map((w) => (
              <div key={w.week} className={`card !p-0 ${w.week === current ? 'ring-2 ring-amber-400' : ''}`}>
                <button className="w-full text-left p-4 flex items-center gap-3" onClick={() => setOpenWeek(openWeek === w.week ? null : w.week)}>
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${w.week < current ? 'bg-emerald-100 text-emerald-700' : w.week === current ? 'bg-amber-400' : 'bg-slate-100'}`}>
                    {w.week}
                  </span>
                  <span className="flex-1">
                    <span className="font-semibold">{w.title}</span>
                    {w.test && <span className="chip bg-sky-100 text-sky-800 ml-2">prueba</span>}
                    <span className="block text-sm text-slate-500">{w.goal}</span>
                  </span>
                </button>
                {openWeek === w.week && (
                  <div className="px-4 pb-4 text-sm space-y-2 border-t border-slate-100 pt-3">
                    <p>
                      <strong>Gramática:</strong>{' '}
                      {w.grammar.map((g, i) => (
                        <button key={g} className="underline text-amber-700 mr-1" onClick={() => go('grammatica', g)}>
                          {lessonById(g)?.title}
                          {i < w.grammar.length - 1 ? ',' : ''}
                        </button>
                      ))}
                    </p>
                    <p>
                      <strong>Vocabulario:</strong> {w.themes.map((t) => themeLabels[t]).join(', ')}
                    </p>
                    <p>
                      <strong>Audición:</strong> {w.listening.map((id) => listeningTexts.find((t) => t.id === id)?.title).join(' · ')} (velocidad {w.speed}×)
                    </p>
                    <p>
                      <strong>Neerlandés real:</strong> {w.media}
                    </p>
                    <p>
                      <strong>Escritura:</strong> {w.writing}
                    </p>
                    <p>
                      <strong>Expresión oral:</strong> {w.speaking}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
