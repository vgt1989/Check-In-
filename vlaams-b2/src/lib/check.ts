export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/[.,!?;:"()«»¿¡]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isCorrect(input: string, answers: string[]): boolean {
  const n = normalize(input);
  return answers.some((a) => normalize(a) === n);
}

/** Word-level comparison for dictation. */
export function diffWords(input: string, target: string) {
  const a = normalize(input).split(' ').filter(Boolean);
  const b = normalize(target).split(' ').filter(Boolean);
  // LCS to align
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--)
    for (let j = b.length - 1; j >= 0; j--)
      dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const result: { word: string; ok: boolean }[] = [];
  let i = 0;
  let j = 0;
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) {
      result.push({ word: b[j], ok: true });
      i++;
      j++;
    } else if (i < a.length && dp[i + 1][j] >= dp[i][j + 1]) {
      i++;
    } else {
      result.push({ word: b[j], ok: false });
      j++;
    }
  }
  const score = b.length ? result.filter((r) => r.ok).length / b.length : 0;
  return { result, score };
}
