import { soundBySymbol } from '../data/consonants';
import { interpolate, preset } from './geometry';
export const fricativeContinuum = [
  {
    symbol: 's',
    active: '舌尖或舌叶',
    passive: '齿龈',
    note: '本预设采用舌尖型；也存在舌叶型 [s]。中央舌沟与齿前气流形成咝声。',
  },
  {
    symbol: 'ʃ',
    active: '舌叶（本教学预设）',
    passive: '龈后',
    note: '舌叶抬起，舌面呈拱形，但不要求 [ɕ] 那样强的舌面前部抬高。舌尖型可显示 [ʃ*]。',
  },
  {
    symbol: 'ɕ',
    active: '舌叶后部与舌面前部',
    passive: '龈后至硬腭前部',
    note: '舌尖较低，舌叶后部和舌面前部共同抬高，形成较长的腭化狭窄区；普通话 x 的典型记音。',
  },
  {
    symbol: 'ç',
    active: '舌面前部',
    passive: '硬腭',
    note: '主要狭窄转到舌面前部与硬腭之间，是非咝擦音。不能仅把舌尖向后移动就视为 [ç]。',
  },
] as const;
export function sampleFricativeContinuum(value: number) {
  const t = Math.max(0, Math.min(3, Number.isFinite(value) ? value : 0));
  const i = Math.min(2, Math.floor(t));
  return interpolate(
    preset(soundBySymbol(fricativeContinuum[i]!.symbol)),
    preset(soundBySymbol(fricativeContinuum[i + 1]!.symbol)),
    t - i,
  );
}
