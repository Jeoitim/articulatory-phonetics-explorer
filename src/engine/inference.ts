import type {
  Features,
  Match,
  Pose,
  Place,
  VariantHint,
  VariantMark,
} from '../domain/phonetics';
import { consonants } from '../data/consonants';
import { placeLabels } from '../data/labels';
import { articulationContact } from './contact';
import { zones, preset, tongueKeys, roofY } from './geometry';

/** Geometry proposes a constriction; independent phonetic features determine its class.
 * Distances are drawing units, never probabilities or measured acoustic evidence. */
export function infer(p: Pose, f: Features, hint?: VariantHint): Match {
  const poseHint: VariantHint | undefined = p.variantOf
    ? { symbol: p.variantOf, mark: p.variantMark }
    : undefined;
  const requested = hint ?? poseHint;
  // A voiceless bilabial fricative can be built from the open-jaw [h]
  // posture: the lower-lip control is limited by the jaw-linked tissue, so a
  // 0.70 threshold would leave a wide, unreachable no-match band. Keep this
  // threshold local to fricatives; stops and nasals still need firmer closure.
  const bilabialFricativeGesture =
    f.manner === 'fricative' &&
    p.dentalContact <= 0.5 &&
    p.lowerLip >= 0.48 &&
    p.rounding < 0.7;
  const linguolabialGesture =
    p.variantMark === '̼' ||
    (p.tongue.tip.x <= 135 &&
      p.tongue.tip.y >= 390 &&
      p.tongue.tip.y <= 475);
  const scores = zones
    .filter((z) => z.place !== 'alveolo-palatal')
    .filter(
      (z) =>
        f.airstream !== 'click' ||
        ['dental', 'alveolar', 'postalveolar'].includes(z.place),
    )
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
    p.tongue.blade.x > 278 &&
    p.tongue.blade.x < 335 &&
    p.tongue.blade.y - roofY(p.tongue.blade.x) < 45 &&
    p.tongue.front.x > 365 &&
    p.tongue.front.y - roofY(p.tongue.front.x) < 42 &&
    p.tongue.tip.y > p.tongue.blade.y + 35
  ) {
    place = 'alveolo-palatal';
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
  if (bilabialFricativeGesture) {
    place = 'bilabial';
    // Keep the lip aperture tied to the existing closure control. The smaller
    // teaching gap is intentionally accepted for [ɸ] near closure; an exact
    // closed-lip pose still has gap === 0 and remains unmatched below.
    gap = (1 - p.lowerLip) * 60;
  }
  if (linguolabialGesture) {
    // The tongue-to-upper-lip constriction is a secondary realization of the
    // oral category. Keep alveolar as its matching chart family while the
    // contact helper reports the actual passive articulator (上唇).
    place = 'alveolar';
    gap =
      f.manner === 'fricative'
        ? 13
        : f.manner === 'approximant' || f.manner === 'lateral-approximant'
          ? 42
          : 0;
  }
  const oralConstriction = scores.some(
    ({ place: scorePlace, distance }) =>
      scorePlace !== 'pharyngeal' &&
      distance < (f.manner === 'fricative' ? 45 : 30),
  );
  if (
    p.epiglottis > 0.5 &&
    !oralConstriction &&
    p.lowerLip <= 0.7 &&
    !linguolabialGesture
  ) {
    place = 'pharyngeal';
    gap = (1 - p.epiglottis) * 40;
  }
  if (
    p.glottis < 0.05 &&
    f.manner === 'plosive' &&
    f.airstream === 'pulmonic-egressive'
  ) {
    place = 'glottal';
    gap = 0;
  } else if (
    gap > 85 &&
    f.manner === 'fricative' &&
    p.lowerLip < (bilabialFricativeGesture ? 0.48 : 0.5)
  ) {
    place = 'glottal';
    gap = 13;
  }
  const rankedCandidates = consonants
    .map((sound) => {
      const differences: string[] = [];
      if (sound.airstream !== f.airstream) differences.push('气流机制不同');
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
    .sort((a, b) => a.distance - b.distance);
  const exactDentalCandidate = rankedCandidates.find(
    ({ sound, differences }) => sound.place === 'dental' && !differences.length,
  );
  const dentalizedCandidate =
    place === 'dental' &&
    gap < 85 &&
    !exactDentalCandidate &&
    !linguolabialGesture
      ? rankedCandidates.find(
          ({ sound }) =>
            sound.place === 'alveolar' &&
            !sound.variant &&
            sound.airstream === f.airstream &&
            sound.manner === f.manner &&
            sound.voiced === f.voiced &&
            sound.velum === f.velum &&
            sound.airflow === f.airflow,
        )
      : undefined;
  const hintedCandidate = requested?.symbol
    ? rankedCandidates.find(({ sound }) => sound.symbol === requested.symbol)
    : undefined;
  const preferredCandidate = hintedCandidate ?? dentalizedCandidate;
  const candidates = preferredCandidate
    ? [
        preferredCandidate,
        ...rankedCandidates
          .filter((candidate) => candidate !== preferredCandidate)
          .slice(0, 2),
      ]
    : rankedCandidates.slice(0, 3);
  const dentalized =
    !linguolabialGesture &&
    (dentalizedCandidate === candidates[0] ||
      (requested?.mark === '̪' && place === 'dental'));
  const nearest = candidates[0]!.sound;
  const target = preset(nearest);
  const hintedMark =
    requested?.symbol === nearest.symbol ? requested.mark : undefined;
  const primaryMarks: VariantMark[] = ['̪', '̺', '̻', '̼'];
  const primaryMark = primaryMarks.includes(hintedMark as VariantMark)
    ? hintedMark
    : dentalized
      ? '̪'
      : linguolabialGesture
        ? '̼'
        : undefined;
  const phonationMark: VariantMark | undefined =
    !nearest.variant &&
    ((nearest.voiced && p.glottis > target.glottis + 0.35) ||
      (!nearest.voiced && p.glottis < target.glottis - 0.35))
      ? nearest.voiced
        ? '̥'
        : '̬'
      : undefined;
  const geometricSecondaryMark: VariantMark | undefined = !nearest.variant
    ? p.epiglottis > target.epiglottis + 0.35
      ? 'ˤ'
      : p.rounding > target.rounding + 0.35
        ? 'ʷ'
        : target.tongue.dorsum.y - p.tongue.dorsum.y > 80
          ? 'ˠ'
          : target.tongue.front.y - p.tongue.front.y > 42
            ? 'ʲ'
            : undefined
    : undefined;
  const secondaryMark: VariantMark | undefined =
    hintedMark && !primaryMarks.includes(hintedMark)
      ? hintedMark
      : p.aspiration && p.aspiration > 0.5
        ? 'ʰ'
        : (phonationMark ?? geometricSecondaryMark);
  const hasVariantMark = Boolean(primaryMark || secondaryMark);
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
  if (
    (f.airstream === 'ejective' && (p.glottis > 0.05 || p.larynx > -0.3)) ||
    (f.airstream === 'implosive' && (p.larynx < 0.3 || p.glottis > 0.4)) ||
    (f.airstream === 'click' &&
      Math.hypot(p.tongue.dorsum.x - 552, p.tongue.dorsum.y - 374) > 12)
  ) {
    status = 'none';
    explanation = '需要相应的喉部运动、声门条件或搭嘴音后部闭塞。';
  } else if (f.manner === 'nasal' && (f.velum !== 'lowered' || p.velum < 0.5)) {
    status = 'none';
    explanation = '鼻咽通道尚未开放：降低软腭以形成鼻音。';
  } else if (closure && gap > 22 && !hasVariantMark) {
    status = 'none';
    explanation = '尚未形成目标接触：继续接近调音区域。';
  } else if (
    f.manner === 'fricative' &&
    place !== 'glottal' &&
    (gap < (place === 'bilabial' ? 0.5 : 3) || gap > 38) &&
    !hasVariantMark
  ) {
    status = 'none';
    explanation =
      gap < 3
        ? '接触过紧：稍微打开通道以形成摩擦。'
        : '通道较宽：当前构形不足以示意持续摩擦。';
  } else if (
    f.manner === 'approximant' &&
    (gap < 23 || gap > 85) &&
    !hasVariantMark
  ) {
    status = 'none';
    explanation = '近音需要接近目标，同时保留较开放的通道。';
  } else if (
    candidates[0]!.differences.length &&
    !dentalized &&
    !hasVariantMark
  ) {
    status = 'none';
    explanation = 'No exact IPA match · 当前条件没有对应的标准辅音。';
  } else if (
    candidates[0]!.distance < 0.12 &&
    place !== 'glottal' &&
    candidates[0]!.sound.variant !== 'sje' &&
    !hasVariantMark
  ) {
    status = 'canonical';
    explanation = '接近教学预设 · 不代表唯一的真实语音实现';
  }
  const contact = articulationContact(
    p,
    place,
    f.manner,
    nearest.place === place && candidates[0]!.differences.length === 0
      ? nearest
      : undefined,
  );
  const typical = articulationContact(
    preset(nearest),
    nearest.place,
    nearest.manner,
    nearest,
  );
  const nonTypical =
    status !== 'none' &&
    (hasVariantMark ||
      (nearest.place === place &&
        (((place === 'alveolar' || place === 'postalveolar') &&
          contact.key !== typical.key) ||
          (place === 'retroflex' && p.retroflex < 0.85))));
  const variantMark = primaryMark
    ? primaryMark
    : secondaryMark
      ? secondaryMark
      : nonTypical && place !== 'retroflex'
        ? contact.key === 'tip'
          ? '̺'
          : contact.key === 'blade'
            ? '̻'
            : undefined
        : undefined;
  if (nonTypical) {
    status = 'closest';
    const secondaryLabels: Partial<Record<VariantMark, string>> = {
      ʷ: '唇化',
      ʲ: '腭化',
      ˠ: '软腭化',
      ˤ: '咽化',
      ʰ: '送气',
      '̥': '清化',
      '̊': '清化',
      '̬': '浊化',
    } as const;
    if (primaryMark === '̪')
      explanation = `[${nearest.symbol}̪] 齿化 · 舌尖前端接近上齿；附加符号直接标出调音部位。`;
    else if (primaryMark === '̼')
      explanation = `[${nearest.symbol}̼] 舌唇 · ${contact.active}接近上唇；附加符号直接标出主动器官。`;
    else if (primaryMark === '̺')
      explanation = `[${nearest.symbol}̺] 舌尖性 · 舌尖前端承担主要接触；附加符号直接标出主动舌部。`;
    else if (primaryMark === '̻')
      explanation = `[${nearest.symbol}̻] 舌叶性 · 舌叶承担主要接触；附加符号直接标出主动舌部。`;
    else if (secondaryMark)
      explanation = `[${nearest.symbol}${secondaryMark}] ${secondaryLabels[secondaryMark] ?? '附加调音'} · 非典型教学构形；附加符号直接标出次要调音。`;
    else if (place === 'retroflex')
      explanation = `[${nearest.symbol}] 较弱反卷 · 非典型教学构形。`;
    else
      explanation = `[${nearest.symbol}${variantMark ?? ''}] ${
        contact.key === 'tip' ? '舌尖型' : '舌叶型'
      } · 非典型教学构形；附加符号直接标出主动舌部。`;
  }
  return {
    nonTypical,
    variantMark,
    status,
    contact,
    place,
    candidates,
    explanation,
    proximity: Math.max(0, Math.round(100 - gap)),
    gap,
  };
}
