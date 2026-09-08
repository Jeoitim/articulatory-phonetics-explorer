import { vowels } from '../data/vowels';
import { consonants } from '../data/consonants';
import { vowelPose } from './vowels';
import { constrain, isPlausible, preset, rest } from './geometry';
import type { Consonant, Place, Pose } from '../domain/phonetics';
import { sampleAnimation } from './animation';
import { interpolate } from './geometry';
import { articulatoryVariants } from './variants';

export interface ReferencePreviewModel {
  from: Pose;
  to: Pose;
  place: Place;
  description: string;
  sound?: Consonant;
  flow?: string;
  /** Show a separate side channel in the tract instead of the lip inset. */
  lateral?: boolean;
  /** Optional release gesture for secondary release diacritics. */
  release?: Pose;
  releaseFlow?: string;
}
export function referenceFrame(model: ReferencePreviewModel, progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  if (model.release) {
    const approach = Math.min(1, t / 0.28);
    const release = Math.max(0, Math.min(1, (t - 0.54) / 0.2));
    const recover = Math.max(0, Math.min(1, (t - 0.8) / 0.2));
    if (t < 0.54) {
      return {
        pose: interpolate(model.from, model.to, 1 - (1 - approach) ** 3),
        flow: 'off',
        pressure: t < 0.28 ? 0 : Math.min(1, (t - 0.28) / 0.26),
        phase: t < 0.28 ? '形成主要闭塞' : '保持闭塞 · 准备除阻',
      };
    }
    if (t < 0.8) {
      return {
        pose: interpolate(model.to, model.release, 1 - (1 - release) ** 3),
        flow: model.releaseFlow ?? model.flow ?? 'smooth',
        pressure: Math.max(0, 1 - release),
        phase:
          model.releaseFlow === 'lateral'
            ? '舌侧除阻'
            : model.releaseFlow === 'nasal'
              ? '鼻腔除阻'
              : '口腔爆破',
      };
    }
    return {
      pose: interpolate(model.release, rest, recover),
      flow: 'off',
      pressure: 0,
      phase: '恢复',
    };
  }
  if (model.sound) return sampleAnimation(model.sound, progress);
  return {
    pose: interpolate(model.from, model.to, 1 - (1 - Math.min(1, t * 2)) ** 3),
    flow: model.flow ?? 'smooth',
    pressure: 0,
    phase: t < 0.5 ? '改变调音构形' : '保持目标构形',
  };
}
/** Deliberately bounded: display a supported articulatory contrast, not a reconstruction of the recording. */
export function referencePreview(
  example: string,
): ReferencePreviewModel | null {
  const chars = Array.from(example.normalize('NFD'));
  const first = chars.shift();
  const vowel = vowels.find((v) => v.symbol === first);
  if (
    vowel &&
    chars.length &&
    chars.every((c) => ['̟', '̠', '̈', '̽', '̝', '̞', '̹', '̜', '̃'].includes(c))
  ) {
    const target = { ...vowel };
    for (const mark of chars) {
      if (mark === '̟') target.backness -= 0.15;
      if (mark === '̠') target.backness += 0.15;
      if (mark === '̈') target.backness += (0.5 - target.backness) * 0.6;
      if (mark === '̽') {
        target.backness += (0.5 - target.backness) * 0.6;
        target.height += (0.5 - target.height) * 0.6;
      }
      if (mark === '̝') target.height -= 0.12;
      if (mark === '̞') target.height += 0.12;
      if (mark === '̹') target.rounding += 0.3;
      if (mark === '̜') target.rounding -= 0.3;
    }
    const to = vowelPose(target);
    if (chars.includes('̃')) to.velum = 1;
    const from = vowelPose(vowel);
    if (chars.includes('̹') && vowel.rounding === 1) from.rounding = 0.65;
    if (chars.includes('̜') && vowel.rounding === 0) from.rounding = 0.3;
    return {
      from,
      to,
      place: target.backness < 0.5 ? 'palatal' : 'velar',
      description: `[${vowel.symbol}] → [${example}]：展示舌位、圆唇或软腭的相对变化，位移幅度为教学示意。`,
    };
  }
  const sound = consonants.find((s) => s.symbol === first);
  const baseSound =
    first === 'ɫ'
      ? consonants.find((s) => s.symbol === 'l' && s.variant !== 'dark-l')
      : sound;
  // The precomposed dark-l is a full entry in the consonant inventory. Keep
  // its own animation so the ordinary l-to-dark-l gesture is visible in the
  // same way as the build view.
  if (
    sound &&
    !chars.length &&
    (sound.variant === 'dark-l' || sound.airflow === 'lateral')
  ) {
    return {
      from: preset(sound.variant === 'dark-l' ? (baseSound ?? sound) : sound),
      to: preset(sound),
      place: sound.place,
      sound,
      lateral: sound.airflow === 'lateral',
      flow: sound.airflow === 'lateral' ? 'smooth' : undefined,
      description: `[${example}]：展示齿龈中央接触、舌背抬高与舌侧通道；二维剖面中的侧向气流为教学示意。`,
    };
  }
  if (!baseSound || !chars.length) return null;

  const secondaryMarks = [
    '̥',
    '̊',
    '̬',
    '̪',
    '̼',
    'ʷ',
    '̺',
    '̻',
    'ʲ',
    'ˠ',
    'ˤ',
    'ʰ',
    '̴',
  ];
  const releaseMark = chars.includes('ⁿ')
    ? 'ⁿ'
    : chars.includes('ˡ')
      ? 'ˡ'
      : '';
  if (!chars.every((c) => secondaryMarks.includes(c) || c === releaseMark))
    return null;

  const modified = { ...baseSound };
  if (chars.includes('̥') || chars.includes('̊')) modified.voiced = false;
  if (chars.includes('̬')) modified.voiced = true;
  if (chars.includes('̪')) modified.place = 'dental';
  let to = preset(modified);
  const from = preset(baseSound);
  const laminalPose = articulatoryVariants(modified).find(
    (v) => v.mark === '̻',
  )?.pose;
  const apicalPose = articulatoryVariants(modified).find(
    (v) => v.mark === '̺',
  )?.pose;
  const linguolabialPose = articulatoryVariants(modified).find(
    (v) => v.mark === '̼',
  )?.pose;
  const custom = chars.some((c) =>
    ['̺', '̻', '̼', 'ʲ', 'ˠ', 'ˤ', 'ʰ', '̴'].includes(c),
  );

  for (const mark of chars) {
    if (mark === 'ʷ') to.rounding = 0.8;
    if (mark === '̻') {
      if (laminalPose) to = laminalPose;
    }
    if (mark === '̺') {
      // Alveolar canonical presets are apical; postalveolar presets expose
      // an explicit apical variant. In both cases the target frame must show
      // the tongue tip, never the lamina used by the default [ʃ] template.
      if (apicalPose) to = apicalPose;
    }
    if (mark === '̼') {
      if (linguolabialPose) to = linguolabialPose;
    }
    if (mark === 'ʰ') {
      to.aspiration = 1;
      to.glottis = 1;
    }
    if (mark === 'ʲ') {
      const candidate = constrain(
        to,
        'front',
        { x: to.tongue.front.x - 4, y: to.tongue.front.y - 78 },
        false,
      );
      if (isPlausible(candidate)) to = candidate;
    }
    if (mark === 'ˠ') {
      const candidate = constrain(to, 'dorsum', { x: 530, y: 405 }, false);
      if (isPlausible(candidate)) to = candidate;
    }
    if (mark === 'ˤ') {
      const candidate = constrain(to, 'root', { x: 638, y: 650 }, false);
      if (isPlausible(candidate)) to = candidate;
      to.epiglottis = Math.max(to.epiglottis, 0.72);
    }
    if (mark === '̴') {
      const dark = consonants.find((s) => s.symbol === 'ɫ');
      if (dark) {
        to = preset(dark);
        to.rounding = Math.min(to.rounding, 0.25);
      }
    }
  }

  // Secondary gestures should not pull the primary alveolar/dental closure
  // away while the body of the tongue moves. Re-attach the two front
  // landmarks after the distributed tissue relaxation used by `constrain`.
  // A laminal mark deliberately chooses the blade-led contact pose.
  const primaryContact = chars.includes('̻')
    ? (laminalPose ?? preset(modified))
    : chars.includes('̺')
      ? (apicalPose ?? preset(modified))
      : preset(modified);
  if (
    ['dental', 'alveolar', 'postalveolar'].includes(modified.place) &&
    (custom || chars.includes('ʷ')) &&
    !chars.includes('̼')
  ) {
    to.tongue.tip = { ...primaryContact.tongue.tip };
    to.tongue.blade = { ...primaryContact.tongue.blade };
  }

  const commonDescription = `[${baseSound.symbol}] → [${example}]：保留主要调音部位，并展示附加调音对舌体、软腭或喉入口的相对影响；位移幅度为教学示意。`;
  if (releaseMark) {
    const release = structuredClone(to);
    if (releaseMark === 'ⁿ') {
      release.velum = 1;
      release.tongue.tip.y += 34;
      release.tongue.blade.y += 24;
    } else {
      release.tongue.tip.y += 28;
      release.tongue.blade.y += 22;
    }
    return {
      from,
      to,
      release,
      releaseFlow: releaseMark === 'ⁿ' ? 'nasal' : 'lateral',
      flow: releaseMark === 'ⁿ' ? 'nasal' : 'lateral',
      lateral: releaseMark === 'ˡ',
      place: modified.place,
      sound: baseSound,
      description:
        releaseMark === 'ⁿ'
          ? `${commonDescription}除阻阶段降低软腭，让气流转入鼻腔。`
          : `${commonDescription}除阻阶段保持中央接触，并让气流从舌侧通道通过。`,
    };
  }

  // Secondary marks on a stop keep the stop timing: closure, pressure and a
  // visible oral burst. The target pose still contains the added articulation
  // while the short release pose opens the primary alveolar constriction.
  if ((custom || chars.includes('ʷ')) && modified.manner === 'plosive') {
    const release = structuredClone(to);
    release.tongue.tip.y += 42;
    release.tongue.blade.y += 30;
    return {
      from,
      to,
      release,
      releaseFlow: 'burst',
      flow: 'burst',
      place: modified.place,
      // Keep the custom target pose for the whole closure/release sequence.
      // Passing baseSound here would make referenceFrame delegate to the
      // canonical t/d animation and move a marked target back to the alveolar
      // ridge (most visibly for the linguolabial [t̼ d̼] examples).
      description: `${commonDescription}动画补充闭塞、积压与口腔爆破阶段。`,
    };
  }

  // Existing voice/dental/labialized examples use the canonical consonant
  // animation, while the secondary place marks above use the generic gesture
  // so their added movement remains visible instead of being overwritten by
  // a plain t/d animation.
  if (!custom) {
    return {
      from,
      to,
      place: modified.place,
      sound: chars.includes('ʷ') ? undefined : modified,
      flow:
        modified.manner === 'plosive'
          ? 'off'
          : modified.manner.includes('fricative')
            ? 'turbulent'
            : 'smooth',
      lateral: modified.airflow === 'lateral',
      description: `[${baseSound.symbol}] → [${example}]：展示口腔接触、唇形或声门开度的相对变化；不计算声带振动。`,
    };
  }
  if (!isPlausible(to)) {
    return null;
  }
  return {
    from,
    to,
    place: modified.place,
    sound: undefined,
    flow:
      modified.manner === 'plosive'
        ? 'off'
        : modified.manner.includes('fricative')
          ? 'turbulent'
          : 'smooth',
    lateral: modified.airflow === 'lateral',
    description: commonDescription,
  };
}
