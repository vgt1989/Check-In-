import { useState } from 'react';
import { todayISO } from '../lib/dates';
import { dutchVoices, hasBelgianVoice, speak, ttsAvailable } from '../lib/speech';
import { useSettings } from '../lib/state';

export function Setup() {
  const [, setSettings] = useSettings();
  const [start, setStart] = useState(todayISO());
  const [tested, setTested] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-lg w-full space-y-4">
        <div className="text-5xl">🦁</div>
        <h1 className="text-2xl font-bold">Welkom! Bienvenida/o a Vlaams B2</h1>
        <p className="text-slate-700">
          Un plan de <strong>26 semanas</strong> para pasar de A2 a B2 en el neerlandés de Flandes, con sesiones diarias de unos 40 minutos:
        </p>
        <ul className="text-sm text-slate-700 space-y-1">
          <li>🗂️ Vocabulario con repetición espaciada (trabajo, trámites, vida social y noticias)</li>
          <li>🧩 Gramática explicada en español, centrada en el orden de palabras y los verbos</li>
          <li>🎧 Audición a distintas velocidades, dictados y habla rápida</li>
          <li>🦁 Expresiones flamencas, tussentaal y acentos (con prioridad para Amberes)</li>
          <li>📝🎙️ Escritura y expresión oral cada día</li>
        </ul>
        <label className="block text-sm">
          <span className="font-medium">¿Cuándo empiezas?</span>
          <input type="date" className="input mt-1" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <div className="rounded-xl bg-slate-50 p-3 text-sm space-y-2">
          <p className="font-medium">Prueba el audio</p>
          {ttsAvailable() ? (
            <>
              <button
                className="btn-ghost"
                onClick={() => {
                  speak('Goeiedag! Welkom in Antwerpen. Allez, we beginnen!', 1);
                  setTested(true);
                }}
              >
                🔊 Escuchar
              </button>
              {tested && !dutchVoices().length && <p className="text-rose-600">No hay ninguna voz neerlandesa instalada. Instálala en los ajustes de voz de tu sistema (busca «Nederlands»).</p>}
              {tested && dutchVoices().length > 0 && !hasBelgianVoice() && <p className="text-amber-700">Se usará una voz de los Países Bajos. Si puedes, instala una voz belga (nl-BE).</p>}
            </>
          ) : (
            <p>Tu navegador no tiene síntesis de voz. Usa Chrome, Edge o Safari.</p>
          )}
        </div>
        <button className="btn-primary w-full text-lg" onClick={() => setSettings((s) => ({ ...s, startDate: start }))}>
          Empezar el plan →
        </button>
      </div>
    </div>
  );
}
