export interface Vowel {
  symbol: string;
  height: number; // 0 close, 1 open; conventional chart coordinates, not millimetres.
  backness: number; // 0 front, 1 back.
  rounding: number;
  zh: string;
  apical?: 'front' | 'retroflex';
  example?: string;
}
const rows: [string, number, number, number, string][] = [
  ['i', 0, 0, 0, '闭前不圆唇'],
  ['y', 0, 0, 1, '闭前圆唇'],
  ['ɨ', 0, 0.5, 0, '闭央不圆唇'],
  ['ʉ', 0, 0.5, 1, '闭央圆唇'],
  ['ɯ', 0, 1, 0, '闭后不圆唇'],
  ['u', 0, 1, 1, '闭后圆唇'],
  ['ɪ', 1 / 6, 0.18, 0, '次闭次前不圆唇'],
  ['ʏ', 1 / 6, 0.18, 1, '次闭次前圆唇'],
  ['ʊ', 1 / 6, 0.82, 1, '次闭次后圆唇'],
  ['e', 1 / 3, 0, 0, '半闭前不圆唇'],
  ['ø', 1 / 3, 0, 1, '半闭前圆唇'],
  ['ɘ', 1 / 3, 0.5, 0, '半闭央不圆唇'],
  ['ɵ', 1 / 3, 0.5, 1, '半闭央圆唇'],
  ['ɤ', 1 / 3, 1, 0, '半闭后不圆唇'],
  ['o', 1 / 3, 1, 1, '半闭后圆唇'],
  ['ə', 0.5, 0.5, 0, '央中'],
  ['ɛ', 2 / 3, 0, 0, '半开前不圆唇'],
  ['œ', 2 / 3, 0, 1, '半开前圆唇'],
  ['ɜ', 2 / 3, 0.5, 0, '半开央不圆唇'],
  ['ɞ', 2 / 3, 0.5, 1, '半开央圆唇'],
  ['ʌ', 2 / 3, 1, 0, '半开后不圆唇'],
  ['ɔ', 2 / 3, 1, 1, '半开后圆唇'],
  ['æ', 5 / 6, 0, 0, '次开前不圆唇'],
  ['ɐ', 5 / 6, 0.5, 0, '次开央'],
  ['a', 1, 0, 0, '开前不圆唇'],
  ['ɶ', 1, 0, 1, '开前圆唇'],
  ['ɑ', 1, 1, 0, '开后不圆唇'],
  ['ɒ', 1, 1, 1, '开后圆唇'],
];
export const vowels: Vowel[] = rows.map(
  ([symbol, height, backness, rounding, zh]) => ({
    symbol,
    height,
    backness,
    rounding,
    zh: zh + '元音',
  }),
);
export const apicalVowels: Vowel[] = [
  {
    symbol: 'ɿ',
    height: 0,
    backness: 0,
    rounding: 0,
    zh: '舌尖前元音',
    apical: 'front',
    example: '资 zī · 次 cì · 思 sī',
  },
  {
    symbol: 'ʅ',
    height: 0,
    backness: 0.3,
    rounding: 0,
    zh: '舌尖后元音',
    apical: 'retroflex',
    example: '知 zhī · 吃 chī · 诗 shī · 日 rì',
  },
];
export function vowelChartPoint(height: number, backness: number) {
  const left = 80 + 150 * height;
  return { x: left + (440 - left) * backness, y: 45 + 300 * height };
}
