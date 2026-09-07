import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { Consonant, Pose } from '../domain/phonetics';
import { animationPresets } from '../data/animation-presets';
import { interpolate, preset, rest } from './geometry';
export function sampleAnimation(sound: Consonant, t: number) {
  if (sound.airstream !== 'pulmonic-egressive') {
    const target = preset(sound);
    const closing = Math.min(1, t / 0.25);
    const release = Math.max(0, Math.min(1, (t - 0.58) / 0.18));
    const compressed = structuredClone(target);
    if (sound.airstream === 'click') compressed.tongue.front.y -= 8;
    let pose = interpolate(rest, compressed, closing);
    pose.larynx = target.larynx * Math.max(0, Math.min(1, (t - 0.25) / 0.3));
    if (sound.airstream === 'click')
      pose.tongue.front.y += 8 * Math.max(0, Math.min(1, (t - 0.25) / 0.33));
    if (t > 0.58 && sound.manner !== 'fricative') {
      const opened = structuredClone(target);
      if (sound.place === 'bilabial') opened.lowerLip = 0.55;
      else if (sound.place === 'velar' || sound.place === 'uvular')
        opened.tongue.dorsum.y += 45;
      else if (sound.place === 'palatal') opened.tongue.front.y += 40;
      else {
        opened.tongue.tip.y += 42;
        opened.tongue.blade.y += 30;
      }
      pose = interpolate(pose, opened, release);
    }
    if (t > 0.82) pose = interpolate(pose, rest, (t - 0.82) / 0.18);
    if (t >= 1) pose = structuredClone(rest);
    const active = t > 0.585 && t < 0.82;
    return {
      pose,
      phase:
        t < 0.25
          ? '形成闭塞'
          : t < 0.58
            ? sound.airstream === 'click'
              ? '扩大封闭口腔'
              : sound.airstream === 'ejective'
                ? '喉部上升 · 压缩空气'
                : '喉部下降 · 扩大空间'
            : t < 0.82
              ? sound.airstream === 'ejective'
                ? '向外释放'
                : '前部释放 · 局部内入'
              : '恢复',
      flow: active
        ? sound.airstream === 'ejective'
          ? sound.manner === 'fricative'
            ? 'turbulent'
            : 'burst'
          : 'ingressive'
        : 'off',
      pressure:
        t < 0.25 || t > 0.82 ? 0 : t < 0.58 ? (t - 0.25) / 0.33 : 1 - release,
    };
  }
  const phases = animationPresets[sound.manner];
  const right = phases.findIndex((p) => p.at > t);
  const a = phases[right < 0 ? phases.length - 1 : Math.max(0, right - 1)]!;
  const b = phases[right < 0 ? phases.length - 1 : right]!;
  const u = b.at === a.at ? 0 : (t - a.at) / (b.at - a.at);
  const shape = a.shape + (b.shape - a.shape) * u;
  const target = preset(sound),
    base = { ...rest, glottis: target.glottis };
  let pose = interpolate(base, target, shape);
  if (sound.manner === 'affricate' && t > 0.43) {
    const frication = preset({ ...sound, manner: 'fricative' });
    pose = interpolate(
      pose,
      interpolate(base, frication, shape),
      Math.min(1, (t - 0.43) / 0.1),
    );
  }
  if (sound.manner === 'trill' && t > 0.2 && t < 0.8) {
    const amount = 0.5 + 0.5 * Math.sin(t * 140);
    if (sound.place === 'bilabial') pose.lowerLip = 1 - 0.16 * amount;
    else if (sound.place === 'uvular') pose.uvula = amount;
    else {
      pose.tongue.tip.y += 10 * amount;
      pose.tongue.blade.y += 3 * amount;
    }
  }
  return {
    pose,
    phase: a.name,
    flow: a.flow,
    pressure: a.pressure + (b.pressure - a.pressure) * u,
  };
}
const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(callback: () => void) {
  const q = matchMedia(motionQuery);
  q.addEventListener('change', callback);
  return () => q.removeEventListener('change', callback);
}
export function useArticulation(initial: Consonant) {
  const [pose, setPose] = useState(() => preset(initial));
  const [sound, setSound] = useState(initial);
  const [progress, setProgress] = useState(0.4);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const reduced = useSyncExternalStore(
    subscribeMotion,
    () => matchMedia(motionQuery).matches,
    () => false,
  );
  const clock = useRef(0.4);
  const [presentation, setPresentation] = useState(false);
  const frame = useRef(0);
  const last = useRef<number | null>(null);
  useEffect(() => {
    if (!playing || reduced) return;
    last.current = null;
    const tick = (now: number) => {
      if (last.current !== null) {
        clock.current = Math.min(
          1,
          clock.current + ((now - last.current) / 1600) * speed,
        );
        setProgress(clock.current);
      }
      last.current = now;
      if (clock.current >= 1) setPlaying(false);
      else frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [playing, speed, reduced]);
  function select(next: Consonant, autoplay = false) {
    setSound(next);
    setPose(preset(next));
    clock.current = autoplay && !reduced ? 0 : 0.4;
    setProgress(clock.current);
    setPlaying(autoplay && !reduced);
    setPresentation(autoplay && !reduced);
  }
  function scrub(t: number) {
    setPlaying(false);
    setPresentation(true);
    clock.current = t;
    setProgress(t);
    setPose(sampleAnimation(sound, t).pose);
  }
  function play() {
    setPresentation(true);
    if (reduced) {
      scrub(progress >= 0.95 ? 0 : Math.min(1, progress + 0.2));
      return;
    }
    if (playing) {
      setPlaying(false);
      return;
    }
    if (progress >= 1 || progress === 0.4) {
      clock.current = 0;
      setProgress(0);
    }
    setPlaying(true);
  }
  function edit(next: Pose) {
    setPlaying(false);
    setPresentation(false);
    setPose(next);
  }
  return {
    pose: presentation ? sampleAnimation(sound, progress).pose : pose,
    select,
    edit,
    progress,
    playing,
    speed,
    setSpeed,
    play,
    scrub,
    reduced,
    presentation,
    frame: sampleAnimation(sound, progress),
  };
}
