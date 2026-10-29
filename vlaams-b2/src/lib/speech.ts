let cachedVoices: SpeechSynthesisVoice[] = [];

function refreshVoices() {
  if (typeof speechSynthesis === 'undefined') return;
  cachedVoices = speechSynthesis.getVoices();
}

if (typeof speechSynthesis !== 'undefined') {
  refreshVoices();
  speechSynthesis.onvoiceschanged = refreshVoices;
}

export function ttsAvailable() {
  return typeof speechSynthesis !== 'undefined';
}

export function dutchVoices(): SpeechSynthesisVoice[] {
  refreshVoices();
  const nl = cachedVoices.filter((v) => v.lang.toLowerCase().startsWith('nl'));
  // Belgian voices first
  return nl.sort((a, b) => Number(b.lang.toLowerCase() === 'nl-be') - Number(a.lang.toLowerCase() === 'nl-be'));
}

export function hasBelgianVoice() {
  return dutchVoices().some((v) => v.lang.toLowerCase() === 'nl-be');
}

const VOICE_KEY = 'vlaams-b2:voice';

export function preferredVoiceName(): string | null {
  try {
    return localStorage.getItem(VOICE_KEY);
  } catch {
    return null;
  }
}

export function setPreferredVoice(name: string) {
  try {
    localStorage.setItem(VOICE_KEY, name);
  } catch {
    /* ignore */
  }
}

export function speak(text: string, rate = 1, onEnd?: () => void) {
  if (!ttsAvailable()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  const voices = dutchVoices();
  const pref = preferredVoiceName();
  const voice = voices.find((v) => v.name === pref) || voices[0];
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = 'nl-BE';
  }
  u.rate = rate;
  if (onEnd) u.onend = onEnd;
  speechSynthesis.speak(u);
}

export function stopSpeaking() {
  if (ttsAvailable()) speechSynthesis.cancel();
}

// ---- Speech recognition (Chrome / Edge / Safari) ----
type Recognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onerror: (e: { error: string }) => void;
  onend: () => void;
};

export function recognitionAvailable() {
  const w = window as unknown as Record<string, unknown>;
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function listen(onText: (t: string) => void, onDone: () => void, onError?: (e: string) => void) {
  const w = window as unknown as Record<string, new () => Recognition>;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return null;
  const rec = new Ctor();
  rec.lang = 'nl-BE';
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => onText(e.results[0][0].transcript);
  rec.onerror = (e) => onError?.(e.error);
  rec.onend = onDone;
  rec.start();
  return rec;
}
