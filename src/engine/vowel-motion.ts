import { useEffect, useRef, useState } from 'react';
import type { Pose } from '../domain/phonetics';
import { interpolate } from './geometry';

export function vowelMotionProgress(elapsed: number) {
  const t = Math.max(0, Math.min(1, elapsed / 280));
  return 1 - (1 - t) ** 3;
}

/** Selection settles briefly; direct manipulation follows the pointer without a trailing tween. */
export function useVowelMotion(initial: () => Pose) {
  const [pose, setPose] = useState(initial);
  const current = useRef(pose);
  const destination = useRef(pose);
  const frame = useRef(0);
  const reduced = useRef(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const changed = () => {
      reduced.current = media.matches;
      if (media.matches) {
        cancelAnimationFrame(frame.current);
        current.current = destination.current;
        setPose(destination.current);
      }
    };
    changed();
    media.addEventListener('change', changed);
    return () => {
      cancelAnimationFrame(frame.current);
      media.removeEventListener('change', changed);
    };
  }, []);
  function move(target: Pose, direct = false, start?: Pose) {
    cancelAnimationFrame(frame.current);
    destination.current = target;
    if (direct || reduced.current) {
      current.current = target;
      setPose(target);
      return;
    }
    const from = start ?? current.current;
    const began = performance.now();
    const tick = (now: number) => {
      const progress = vowelMotionProgress(now - began);
      const next =
        progress === 1 ? target : interpolate(from, target, progress);
      current.current = next;
      setPose(next);
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  }
  return { pose, move };
}
