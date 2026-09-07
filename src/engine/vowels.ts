import type { Vowel } from '../data/vowels';
import { vowels, apicalVowels } from '../data/vowels';
import { soundBySymbol } from '../data/consonants';
import { rest, preset, interpolate } from './geometry';
import type { Pose } from '../domain/phonetics';
const clamp = (v: number) =>
  Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));

/** Teaching tolerances in normalized chart space, not acoustic IPA boundaries. */
export const vowelTolerance = { height: 0.07, backness: 0.1, rounding: 0.22 };
export function describeVowel(
  value: Pick<Vowel, 'height' | 'backness' | 'rounding' | 'apical'>,
) {
  const h = clamp(value.height),
    b = clamp(value.backness),
    r = clamp(value.rounding);
  const candidates = value.apical
    ? apicalVowels.filter((v) => v.apical === value.apical)
    : vowels;
  const distance = (v: Vowel) =>
    (h - v.height) ** 2 + (b - v.backness) ** 2 + 0.25 * (r - v.rounding) ** 2;
  const base = candidates.reduce((best, v) =>
    distance(v) < distance(best) ? v : best,
  );
  const marks: string[] = [],
    descriptions: string[] = [];
  if (!value.apical) {
    if (Math.abs(h - base.height) > vowelTolerance.height) {
      marks.push(h < base.height ? '̝' : '̞');
      descriptions.push(h < base.height ? '偏高' : '偏低');
    }
    if (Math.abs(b - base.backness) > vowelTolerance.backness) {
      marks.push(b < base.backness ? '̟' : '̠');
      descriptions.push(b < base.backness ? '偏前' : '偏后');
    }
  }
  if (Math.abs(r - base.rounding) > vowelTolerance.rounding) {
    marks.push(r > base.rounding ? '̹' : '̜');
    descriptions.push(r > base.rounding ? '更圆' : '略展');
  }
  return {
    symbol: base.symbol + marks.join(''),
    base,
    description: [base.zh, ...descriptions].join(' · '),
  };
}
/** Qualitative shared tongue-body model. Vowel chart coordinates are not anatomy. */
export function vowelPose(
  v: Pick<Vowel, 'height' | 'backness' | 'rounding' | 'apical'>,
): Pose {
  const h = clamp(v.height),
    b = clamp(v.backness),
    r = clamp(v.rounding);
  if (v.apical) {
    const p = preset({
      ...soundBySymbol(v.apical === 'front' ? 's' : 'ɻ'),
      manner: 'approximant',
      voiced: true,
    });
    if (v.apical === 'retroflex') {
      // A moderately retracted raised apex; apical rhymes need not have a tightly curled tip.
      p.tongue.tip = { x: 260, y: 390 };
      p.tongue.blade = { x: 255, y: 450 };
      p.retroflex = 0.5;
    }
    p.rounding = r;
    return p;
  }
  const front = preset(soundBySymbol('j'));
  const back = preset(soundBySymbol('w'));
  const high = interpolate(front, back, b);
  const low = structuredClone(rest);
  low.tongue.tip = { x: 175, y: 560 };
  low.tongue.blade = { x: 255, y: 548 };
  low.tongue.front = { x: 365 + b * 30, y: 550 };
  low.tongue.dorsum = { x: 470 + b * 35, y: 570 };
  low.tongue.root = { x: 565 + b * 12, y: 746 };
  low.jaw = 0.7;
  const p = interpolate(high, low, h);
  p.rounding = r;
  p.lowerLip = 0.1 + r * 0.3;
  p.jaw = 0.18 + 0.52 * h;
  p.glottis = 0.16;
  return p;
}
export function mouthGeometry(rounding: number, openness: number) {
  const r = clamp(rounding),
    o = clamp(openness);
  return {
    width: 58 - 28 * r * (1 - 0.45 * o),
    height: 10 + 24 * o + 2 * r * (1 - o),
    thickness: 9 + 5 * r,
  };
}
