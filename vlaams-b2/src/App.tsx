import { useState } from 'react';
import { GrammarView } from './components/GrammarView';
import { ListenView } from './components/ListenView';
import { PlanView } from './components/PlanView';
import { ProgressView } from './components/ProgressView';
import { Setup } from './components/Setup';
import { Today } from './components/Today';
import { VlaamsView } from './components/VlaamsView';
import { WordsView } from './components/WordsView';
import { dayInfo, streak, useSessions, useSettings } from './lib/state';

const tabs = [
  { id: 'vandaag', icon: '☀️', label: 'Hoy' },
  { id: 'plan', icon: '🗓️', label: 'Plan' },
  { id: 'grammatica', icon: '🧩', label: 'Gramática' },
  { id: 'woorden', icon: '🗂️', label: 'Palabras' },
  { id: 'luisteren', icon: '🎧', label: 'Audición' },
  { id: 'vlaams', icon: '🦁', label: 'Vlaams' },
  { id: 'voortgang', icon: '📈', label: 'Progreso' },
];

export default function App() {
  const [settings] = useSettings();
  const [sessions] = useSessions();
  const [tab, setTab] = useState('vandaag');
  const [arg, setArg] = useState<string | undefined>();
  const [nonce, setNonce] = useState(0);

  if (!settings.startDate) return <Setup />;

  const { week } = dayInfo(settings.startDate);
  const go = (t: string, a?: string) => {
    setTab(t);
    setArg(a);
    setNonce((n) => n + 1);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen pb-24 sm:pb-8">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-2xl">🦁</span>
          <div className="flex-1">
            <h1 className="font-bold leading-tight">Vlaams B2</h1>
            <p className="text-xs text-slate-500">
              Semana {week}/26 · {streak(sessions)} 🔥
            </p>
          </div>
          <nav className="hidden sm:flex gap-1">
            {tabs.map((t) => (
              <button key={t.id} onClick={() => go(t.id)} className={`rounded-lg px-2.5 py-1.5 text-sm ${tab === t.id ? 'bg-slate-800 text-white' : 'hover:bg-slate-100'}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-4" key={`${tab}-${nonce}`}>
        {tab === 'vandaag' && <Today go={go} />}
        {tab === 'plan' && <PlanView go={go} />}
        {tab === 'grammatica' && <GrammarView initial={arg} />}
        {tab === 'woorden' && <WordsView initial={arg} />}
        {tab === 'luisteren' && <ListenView />}
        {tab === 'vlaams' && <VlaamsView initial={arg} />}
        {tab === 'voortgang' && <ProgressView initial={arg} />}
      </main>

      <nav className="sm:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 grid grid-cols-7 z-10 pb-[env(safe-area-inset-bottom)]">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => go(t.id)} className={`py-2 flex flex-col items-center text-[10px] ${tab === t.id ? 'text-amber-600 font-semibold' : 'text-slate-500'}`}>
            <span className="text-lg">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
