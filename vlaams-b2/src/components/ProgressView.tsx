import { useEffect, useMemo, useState } from 'react';
import { exercisesOf, grammar } from '../data/grammar';
import { phases, plan } from '../data/plan';
import { vocabBank } from '../data/vocab';
import { addDays, shuffle, todayISO } from '../lib/dates';
import { isLearned } from '../lib/srs';
import { dutchVoices, hasBelgianVoice, preferredVoiceName, setPreferredVoice, speak } from '../lib/speech';
import { exportAll, importAll } from '../lib/storage';
import { dayInfo, streak, useCards, useExStats, useOwnWords, useSessions, useSettings, useTests, type Settings } from '../lib/state';
import { ExerciseRunner } from './ExerciseRunner';

export function ProgressView({ initial }: { initial?: string }) {
  const [settings] = useSettings();
  const [sessions] = useSessions();
  const [cards] = useCards();
  const [own] = useOwnWords();
  const [stats] = useExStats();
  const [tests] = useTests();
  const [testPhase, setTestPhase] = useState<number | null>(null);
  const { day, week } = dayInfo(settings.startDate);
  const currentPhase = plan[week - 1].phase;

  useEffect(() => {
    if (initial === 'test') setTestPhase(currentPhase);
  }, [initial, currentPhase]);

  const all = [...vocabBank, ...own];
  const learned = all.filter((v) => isLearned(cards[v.id])).length;
  const studied = all.filter((v) => cards[v.id]).length;
  const daysDone = Object.values(sessions).filter((s) => Object.values(s).filter(Boolean).length >= 3).length;

  // Last 8 weeks heatmap
  const today = todayISO();
  const cells = Array.from({ length: 56 }, (_, i) => {
    const d = addDays(today, i - 55);
    return { d, n: Object.values(sessions[d] || {}).filter(Boolean).length };
  });

  const weakest = grammar
    .map((l) => {
      const keys = exercisesOf(l.id).map((e) => e.key);
      const ok = keys.reduce((a, k) => a + (stats[k]?.ok || 0), 0);
      const ko = keys.reduce((a, k) => a + (stats[k]?.ko || 0), 0);
      return { l, ok, ko, pct: ok + ko ? ok / (ok + ko) : null };
    })
    .filter((x) => x.pct !== null);

  if (testPhase) return <PhaseTest phase={testPhase} onClose={() => setTestPhase(null)} />;

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold">Tu progreso</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-center">
          <Box n={`${streak(sessions)} 🔥`} label="días seguidos" />
          <Box n={`${daysDone}`} label="días completados" />
          <Box n={`${studied}`} label={`palabras (${learned} aprendidas)`} />
          <Box n={`${Math.min(100, Math.round((day / 182) * 100))}%`} label={`del plan (semana ${week}/26)`} />
        </div>
        <div className="mt-4">
          <p className="text-sm text-slate-500 mb-1">Últimas 8 semanas</p>
          <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit">
            {cells.map((c) => (
              <div
                key={c.d}
                title={`${c.d}: ${c.n}/7`}
                className={`w-4 h-4 rounded-sm ${c.n === 0 ? 'bg-slate-100' : c.n < 3 ? 'bg-amber-200' : c.n < 6 ? 'bg-amber-400' : 'bg-emerald-500'}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold">Pruebas de fase</h3>
        <p className="text-sm text-slate-600">20 preguntas sobre la gramática de cada fase. Hazlas en las semanas 9, 18 y 26 (o cuando quieras comprobar tu nivel). Con un 80% o más, estás lista/o para la siguiente fase.</p>
        <div className="grid gap-2 mt-3">
          {phases.map((p) => (
            <button key={p.phase} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:border-amber-400" onClick={() => setTestPhase(p.phase)}>
              <span className="text-left">
                <span className="font-medium block">{p.title}</span>
                <span className="text-sm text-slate-500">{p.level}</span>
              </span>
              <span className="font-semibold">{tests[p.phase] !== undefined ? `${tests[p.phase]}%` : 'Empezar →'}</span>
            </button>
          ))}
        </div>
      </div>

      {weakest.length > 0 && (
        <div className="card">
          <h3 className="font-bold">Aciertos por lección</h3>
          <ul className="mt-2 space-y-1.5">
            {weakest
              .sort((a, b) => a.pct! - b.pct!)
              .map(({ l, ok, ko, pct }) => (
                <li key={l.id} className="text-sm">
                  <div className="flex justify-between">
                    <span>{l.title}</span>
                    <span className="text-slate-500">
                      {Math.round(pct! * 100)}% · {ok + ko} respuestas
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${pct! >= 0.8 ? 'bg-emerald-500' : pct! >= 0.6 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${pct! * 100}%` }} />
                  </div>
                </li>
              ))}
          </ul>
        </div>
      )}

      <SettingsPanel />
    </div>
  );
}

function Box({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="text-2xl font-bold">{n}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function PhaseTest({ phase, onClose }: { phase: number; onClose: () => void }) {
  const [, setTests] = useTests();
  const items = useMemo(() => {
    const ids = Array.from(new Set(plan.filter((w) => w.phase === phase).flatMap((w) => w.grammar)));
    return shuffle(ids.flatMap(exercisesOf)).slice(0, 20);
  }, [phase]);
  return (
    <div className="space-y-4">
      <button className="btn-ghost" onClick={onClose}>
        ← Volver
      </button>
      <div className="card">
        <h2 className="text-xl font-bold">Prueba: {phases[phase - 1].title}</h2>
        <p className="text-sm text-slate-500 mb-4">Sin mirar las lecciones. Al terminar, verás tu resultado y podrás repetir los fallos.</p>
        <ExerciseRunner items={items} onFinish={(s, t) => setTests((x) => ({ ...x, [phase]: Math.round((s / t) * 100) }))} />
      </div>
    </div>
  );
}

function SettingsPanel() {
  const [settings, setSettings] = useSettings();
  const [voices, setVoices] = useState(dutchVoices());
  const [voice, setVoice] = useState(preferredVoiceName() || voices[0]?.name || '');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setVoices(dutchVoices()), 500);
    return () => clearTimeout(t);
  }, []);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setSettings((s) => ({ ...s, [k]: v }));

  return (
    <div className="card space-y-4">
      <h3 className="font-bold">Ajustes</h3>
      <label className="block text-sm">
        <span className="font-medium">Fecha de inicio del plan</span>
        <input type="date" className="input mt-1" value={settings.startDate || ''} onChange={(e) => set('startDate', e.target.value || null)} />
        <span className="text-slate-500">Cámbiala para saltar o repetir semanas.</span>
      </label>
      <label className="block text-sm">
        <span className="font-medium">Palabras nuevas al día</span>
        <input type="number" min={0} max={30} className="input mt-1" value={settings.newPerDay} onChange={(e) => set('newPerDay', Number(e.target.value))} />
      </label>
      <label className="block text-sm">
        <span className="font-medium">Dirección de las tarjetas</span>
        <select className="input mt-1" value={settings.cardDirection} onChange={(e) => set('cardDirection', e.target.value as Settings['cardDirection'])}>
          <option value="mix">Mixta (recomendada)</option>
          <option value="nl-es">Neerlandés → español</option>
          <option value="es-nl">Español → neerlandés</option>
        </select>
      </label>
      <div className="text-sm space-y-1">
        <span className="font-medium">Voz neerlandesa</span>
        {voices.length ? (
          <div className="flex gap-2">
            <select
              className="input"
              value={voice}
              onChange={(e) => {
                setVoice(e.target.value);
                setPreferredVoice(e.target.value);
              }}
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
            <button className="btn-ghost" onClick={() => speak('Goeiedag! Hoe is het ermee? Ik woon in Antwerpen.', 1)}>
              Probar
            </button>
          </div>
        ) : (
          <p className="text-rose-600">No se ha encontrado ninguna voz neerlandesa. Instala la voz «Nederlands (België)» en los ajustes de voz de tu sistema (en el iPhone: Ajustes → Accesibilidad → Contenido leído → Voces; en Android: Ajustes → Texto a voz).</p>
        )}
        {voices.length > 0 && !hasBelgianVoice() && <p className="text-amber-700">Solo hay voces de los Países Bajos (nl-NL). Funcionan bien, pero si puedes, instala una voz belga (nl-BE).</p>}
      </div>
      <div className="text-sm space-y-2">
        <span className="font-medium block">Copia de seguridad</span>
        <p className="text-slate-500">Tu progreso se guarda en este navegador. Exporta una copia para no perderlo o para pasarlo a otro dispositivo.</p>
        <div className="flex gap-2 flex-wrap">
          <button
            className="btn-ghost"
            onClick={() => {
              const blob = new Blob([exportAll()], { type: 'application/json' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `vlaams-b2-${todayISO()}.json`;
              a.click();
            }}
          >
            ⬇️ Exportar
          </button>
          <label className="btn-ghost cursor-pointer">
            ⬆️ Importar
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  importAll(await f.text());
                  setMsg('Copia importada. Recargando…');
                  setTimeout(() => location.reload(), 800);
                } catch {
                  setMsg('El archivo no es válido.');
                }
              }}
            />
          </label>
        </div>
        {msg && <p>{msg}</p>}
      </div>
    </div>
  );
}
