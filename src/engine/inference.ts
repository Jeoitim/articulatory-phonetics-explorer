import type { Features, Match, Pose, Place } from '../domain/phonetics';
import { consonants } from '../data/consonants';
import { placeLabels } from '../data/labels';
import { articulationContact } from './contact';
import { zones, preset, tongueKeys, roofY } from './geometry';

/** Geometry proposes a constriction; independent phonetic features determine its class.
 * Distances are drawing units, never probabilities or measured acoustic evidence. */
export function infer(p: Pose, f: Features): Match {
  const scores = zones
    .filter((z) => z.place !== 'retroflex' || p.retroflex > 0.5)
    .map((z) => ({
      place: z.place,
      distance: Math.min(
        ...z.keys.map((k) =>
          Math.hypot(
            p.tongue[k].x - z.point.x,
            p.tongue[k].y -
              z.point.y -
              (z.place === 'uvular' && p.velum > 0.5 ? 60 : 0),
          ),
        ),
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
  let place: Place = scores[0]!.place,
    gap = scores[0]!.distance;
  if (
    p.tongue.blade.x > 282 &&
    p.tongue.blade.x < 310 &&
    p.tongue.blade.y < 390 &&
    p.tongue.front.y < 405
  ) {
    place = 'postalveolar';
    gap = Math.max(0, p.tongue.blade.y - 354);
  }
  if (p.retroflex > 0.6 && p.tongue.tip.y < 430) {
    place = 'retroflex';
    gap = Math.max(0, p.tongue.tip.y - roofY(p.tongue.tip.x));
  }
  if (p.dentalContact > 0.5 && p.lowerLip > 0.5) {
    place = 'labiodental';
    gap = Math.max(0, (0.91 - p.lowerLip) * 230);
  } else if (p.lowerLip > 0.7 && p.rounding < 0.5) {
    place = 'bilabial';
    gap = (1 - p.lowerLip) * 60;
  }
  if (p.epiglottis > 0.5) {
    place = 'pharyngeal';
    gap = (1 - p.epiglottis) * 40;
  }
  if (p.glottis < 0.05 && f.manner === 'plosive') {
    place = 'glottal';
    gap = 0;
  } else if (gap > 85 && f.manner === 'fricative' && p.lowerLip < 0.5) {
    place = 'glottal';
    gap = 13;
  }
  const candidates = consonants
    .map((sound) => {
      const differences: string[] = [];
      if (sound.place !== place)
        differences.push(`调音部位需接近${placeLabels[sound.place]}`);
      if (sound.manner !== f.manner) differences.push('调音方法不同');
      if (sound.voiced !== f.voiced)
        differences.push(sound.voiced ? '需要声带振动' : '需要停止声带振动');
      if (sound.velum !== f.velum)
        differences.push(
          sound.velum === 'lowered' ? '需要开放鼻咽通道' : '需要关闭鼻咽通道',
        );
      if (sound.airflow !== f.airflow) differences.push('中央／侧向气流不同');
      const target = preset(sound);
      if (target.rounding > 0.5 !== p.rounding > 0.5)
        differences.push('唇部圆拢条件不同');
      if (target.epiglottis > 0.5 !== p.epiglottis > 0.5)
        differences.push('会厌区狭窄条件不同');
      // Within a category, whole-tongue similarity ranks secondary gestures. It does
      // not turn an arbitrary nearest point into an IPA phoneme identification.
      const shape =
        tongueKeys.reduce(
          (sum, k) =>
            sum +
            Math.hypot(
              target.tongue[k].x - p.tongue[k].x,
              target.tongue[k].y - p.tongue[k].y,
            ),
          0,
        ) / 500;
      return { sound, differences, distance: differences.length * 3 + shape };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 3);
  let status: Match['status'] = 'closest',
    explanation = 'Closest matching IPA consonant · 当前构形最接近';
  const closure = [
    'plosive',
    'nasal',
    'lateral-approximant',
    'lateral-fricative',
    'trill',
    'tap',
    'affricate',
  ].includes(f.manner);
  if (f.airstream !== 'pulmonic-egressive') {
    status = 'unsupported';
    explanation = '此机制需要额外闭塞或喉部运动，尚未实现。';
  } else if (f.manner === 'nasal' && (f.velum !== 'lowered' || p.velum < 0.5)) {
    status = 'none';
    explanation = '鼻咽通道尚未开放：降低软腭以形成鼻音。';
  } else if (closure && gap > 22) {
    status = 'none';
    explanation = '尚未形成目标接触：继续接近调音区域。';
  } else if (
    f.manner === 'fricative' &&
    place !== 'glottal' &&
    (gap < 3 || gap > 38)
  ) {
    status = 'none';
    explanation =
      gap < 3
        ? '接触过紧：稍微打开通道以形成摩擦。'
        : '通道较宽：当前构形不足以示意持续摩擦。';
  } else if (f.manner === 'approximant' && (gap < 23 || gap > 85)) {
    status = 'none';
    explanation = '近音需要接近目标，同时保留较开放的通道。';
  } else if (candidates[0]!.differences.length) {
    status = 'none';
    explanation = 'No exact IPA match · 当前条件没有对应的标准辅音。';
  } else if (
    candidates[0]!.distance < 0.12 &&
    place !== 'glottal' &&
    candidates[0]!.sound.variant !== 'sje'
  ) {
    status = 'canonical';
    explanation = '接近教学预设 · 不代表唯一的真实语音实现';
  }
  return {
    status,
    contact: articulationContact(p, place, f.manner),
    place,
    candidates,
    explanation,
    proximity: Math.max(0, Math.round(100 - gap)),
    gap,
  };
}
