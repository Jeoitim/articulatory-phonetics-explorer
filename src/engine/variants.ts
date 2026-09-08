import type { Consonant, Pose, VariantMark } from '../domain/phonetics';
import { consonants } from '../data/consonants';
import { constrain, preset, isPlausible } from './geometry';
export interface ArticulatoryVariant {
  label: string;
  /** IPA secondary articulation mark for the displayed realization. */
  mark?: VariantMark;
  pose: Pose;
}
export function articulatoryVariants(sound: Consonant): ArticulatoryVariant[] {
  if (sound.airstream !== 'pulmonic-egressive' || sound.variant === 'sje')
    return [];
  const base = preset(sound);
  const gap =
    sound.manner === 'fricative' ? 13 : sound.manner === 'approximant' ? 42 : 0;
  const variants: ArticulatoryVariant[] = [];
  const pushVariant = (label: string, pose: Pose, mark?: VariantMark) => {
    pose.variantOf = sound.symbol;
    if (mark) pose.variantMark = mark;
    variants.push({ label, mark, pose });
  };
  if (
    sound.place === 'alveolar' &&
    !['trill', 'tap', 'approximant'].includes(sound.manner)
  ) {
    const laminal = structuredClone(base);
    // A relaxed anterior apex and a supported blade, not a folded flap.
    laminal.tongue.tip = { x: 175, y: 435 };
    laminal.tongue.blade = { x: 220, y: 385 + gap };
    laminal.tongue.front = { x: 335, y: 455 };
    if (isPlausible(laminal)) pushVariant('舌叶型', laminal, '̻');
    const apical = structuredClone(base);
    apical.tongue.tip = { x: 230, y: 385 + gap };
    apical.tongue.blade = { x: 260, y: 425 + gap };
    if (isPlausible(apical)) pushVariant('舌尖型', apical, '̺');
  } else if (
    sound.place === 'postalveolar' &&
    ['fricative', 'affricate'].includes(sound.manner)
  ) {
    const apical = structuredClone(base);
    apical.tongue.tip = { x: 270, y: 347 + gap };
    apical.tongue.blade = { x: 306, y: 395 + gap };
    apical.tongue.front = { x: 385, y: 425 };
    if (isPlausible(apical)) pushVariant('舌尖型', apical, '̺');
  } else if (sound.place === 'retroflex') {
    const weakerRetroflex = structuredClone(base);
    weakerRetroflex.tongue.tip = { x: 270, y: 342 + gap };
    weakerRetroflex.retroflex = 0.7;
    if (isPlausible(weakerRetroflex)) pushVariant('较弱反卷', weakerRetroflex);
  }

  // Dentalization is a useful secondary place for every alveolar gesture,
  // including the plosive t/d pair that is absent as a separate chart row.
  // Keep the rest of the alveolar pose intact so the mark means “move the
  // active constriction toward the upper teeth”, rather than replacing the
  // manner with a dental fricative.
  const hasDedicatedDentalCounterpart = consonants.some(
    (candidate) =>
      candidate.place === 'dental' &&
      candidate.airstream === sound.airstream &&
      candidate.manner === sound.manner &&
      candidate.voiced === sound.voiced &&
      candidate.velum === sound.velum &&
      candidate.airflow === sound.airflow,
  );
  if (
    sound.place === 'alveolar' &&
    !sound.variant &&
    !hasDedicatedDentalCounterpart
  ) {
    const dental = structuredClone(base);
    // The apex itself is draggable: move it to the upper-incisor target while
    // the geometry keeps the connecting tissue continuous.
    dental.tongue.tip = { x: 164, y: 418 + gap };
    if (isPlausible(dental)) pushVariant('齿化', dental, '̪');
  }
  if (sound.place === 'alveolar' && !sound.variant) {
    const linguolabial = structuredClone(base);
    // The apex remains the single draggable landmark. Moving it to the upper
    // lip lets users construct the gesture directly without a second point.
    linguolabial.tongue.tip = { x: 118, y: 422 + gap };
    if (isPlausible(linguolabial)) pushVariant('舌唇', linguolabial, '̼');
  }

  // The following gestures are exposed as constructible presets as well as
  // in the reference popovers. Preserve the primary tip/blade contact while
  // moving a secondary articulator, so a user can build [tʲ], [tˠ], [tˤ] or
  // [tʷ] without losing the alveolar closure.
  const preservePrimary = (pose: Pose) => {
    if (
      ['dental', 'alveolar', 'postalveolar', 'retroflex'].includes(sound.place)
    ) {
      pose.tongue.tip = { ...base.tongue.tip };
      pose.tongue.blade = { ...base.tongue.blade };
    }
    return pose;
  };
  const addSecondary = (
    label: string,
    mark: VariantMark,
    transform: (pose: Pose) => Pose,
  ) => {
    const pose = preservePrimary(transform(structuredClone(base)));
    if (isPlausible(pose)) pushVariant(label, pose, mark);
  };
  if (!sound.variant && !['bilabial', 'labiodental'].includes(sound.place))
    addSecondary('唇化', 'ʷ', (pose) => {
      pose.rounding = 0.8;
      return pose;
    });
  if (
    !sound.variant &&
    !['palatal', 'alveolo-palatal', 'glottal'].includes(sound.place)
  )
    addSecondary('腭化', 'ʲ', (pose) => {
      const moved = constrain(
        pose,
        'front',
        { x: pose.tongue.front.x - 4, y: pose.tongue.front.y - 78 },
        false,
      );
      return moved;
    });
  if (
    !sound.variant &&
    !['velar', 'uvular', 'pharyngeal', 'glottal'].includes(sound.place)
  )
    addSecondary('软腭化', 'ˠ', (pose) =>
      constrain(pose, 'dorsum', { x: 530, y: 405 }, false),
    );
  if (
    !sound.variant &&
    !['uvular', 'pharyngeal', 'glottal'].includes(sound.place)
  )
    addSecondary('咽化', 'ˤ', (pose) => {
      const moved = constrain(pose, 'root', { x: 638, y: 650 }, false);
      moved.epiglottis = Math.max(moved.epiglottis, 0.72);
      return moved;
    });
  if (!sound.variant) {
    const phonation = structuredClone(base);
    if (sound.voiced) {
      phonation.glottis = 1;
      if (isPlausible(phonation)) pushVariant('清化', phonation, '̥');
    } else {
      phonation.glottis = 0.16;
      if (isPlausible(phonation)) pushVariant('浊化', phonation, '̬');
    }
  }
  if (
    !sound.variant &&
    ['plosive', 'affricate'].includes(sound.manner) &&
    sound.place !== 'glottal'
  )
    addSecondary('送气', 'ʰ', (pose) => {
      pose.aspiration = 1;
      pose.glottis = 1;
      return pose;
    });
  return variants;
}
