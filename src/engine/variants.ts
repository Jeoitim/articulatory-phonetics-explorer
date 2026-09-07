import type { Consonant, Pose } from '../domain/phonetics';
import { preset, isPlausible } from './geometry';
export function articulatoryVariants(
  sound: Consonant,
): { label: string; pose: Pose }[] {
  if (sound.airstream !== 'pulmonic-egressive' || sound.variant === 'sje')
    return [];
  const p = preset(sound);
  const gap =
    sound.manner === 'fricative' ? 13 : sound.manner === 'approximant' ? 42 : 0;
  let label = '';
  if (
    sound.place === 'alveolar' &&
    !['trill', 'tap', 'approximant'].includes(sound.manner)
  ) {
    p.tongue.tip = { x: 185, y: 455 };
    p.tongue.blade = { x: 220, y: 385 + gap };
    label = '舌叶型';
  } else if (
    sound.place === 'postalveolar' &&
    ['fricative', 'affricate'].includes(sound.manner)
  ) {
    p.tongue.tip = { x: 270, y: 347 + gap };
    p.tongue.blade = { x: 300, y: 455 };
    p.tongue.front = { x: 385, y: 455 };
    label = '舌尖型';
  } else if (sound.place === 'retroflex') {
    p.tongue.tip = { x: 270, y: 342 + gap };
    p.retroflex = 0.7;
    label = '较弱反卷';
  }
  return label && isPlausible(p) ? [{ label, pose: p }] : [];
}
