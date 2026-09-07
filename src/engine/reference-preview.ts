import { vowels } from '../data/vowels';
import { consonants } from '../data/consonants';
import { vowelPose } from './vowels';
import { preset } from './geometry';
import type { Consonant, Place, Pose } from '../domain/phonetics';
import { sampleAnimation } from './animation';
import { interpolate } from './geometry';

export interface ReferencePreviewModel {
  from: Pose;
  to: Pose;
  place: Place;
  description: string;
  sound?: Consonant;
  flow?: string;
}
export function referenceFrame(model: ReferencePreviewModel, progress: number) {
  if (model.sound) return sampleAnimation(model.sound, progress);
  return {
    pose: interpolate(
      model.from,
      model.to,
      1 - (1 - Math.min(1, progress * 2)) ** 3,
    ),
    flow: model.flow ?? 'smooth',
    pressure: 0,
    phase: progress < 0.5 ? '改变调音构形' : '保持目标构形',
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
  if (
    sound &&
    chars.length &&
    chars.every((c) => ['̥', '̊', '̬', '̪', 'ʷ'].includes(c))
  ) {
    const modified = { ...sound };
    if (chars.includes('̥') || chars.includes('̊')) modified.voiced = false;
    if (chars.includes('̬')) modified.voiced = true;
    if (chars.includes('̪')) modified.place = 'dental';
    const to = preset(modified);
    if (chars.includes('ʷ')) to.rounding = 0.8;
    return {
      from: preset(sound),
      to,
      place: modified.place,
      sound: chars.includes('ʷ') ? undefined : modified,
      flow:
        modified.manner === 'plosive'
          ? 'off'
          : modified.manner.includes('fricative')
            ? 'turbulent'
            : 'smooth',
      description: `[${sound.symbol}] → [${example}]：展示口腔接触、唇形或声门开度的相对变化；不计算声带振动。`,
    };
  }
  return null;
}
