import { soundBySymbol } from '../data/consonants';
import { interpolate, preset } from './geometry';
export const fricativeContinuum = [
  {
    symbol: 's',
    example: '普通话：三 sān 的声母；英语：see [siː] 的首辅音。',
    active: '舌尖或舌叶',
    passive: '齿龈',
    note: '本预设采用舌尖型；也存在舌叶型 [s]。中央舌沟与齿前气流形成咝声。',
  },
  {
    symbol: 'ʃ',
    example:
      '英语：ship [ʃɪp]、she [ʃiː] 的首辅音。粤语提示：部分口音的 s 会腭化或后移，但现代粤语通常以 /s/ 记音，不能统一当作英语式 [ʃ]。',
    active: '舌叶（本教学预设）',
    passive: '龈后',
    note: '舌叶与舌面前部形成连续圆拱，舌尖自然向前下方延伸，不必大幅弯折；腭化弱于 [ɕ]。也有舌尖型 [ʃ̺]，此处只展示一种舌叶构形。',
  },
  {
    symbol: 'ɕ',
    example: '普通话：西 xī [ɕi˥]、小 xiǎo 的声母，拼音 x 是典型例子。',
    active: '舌叶后部与舌面前部',
    passive: '龈后至硬腭前部',
    note: '舌尖较低，舌叶后部和舌面前部共同抬高，形成较长的腭化狭窄区；普通话 x 的典型记音。',
  },
  {
    symbol: 'ç',
    example:
      '德语：ich [ɪç] 的末辅音；日语：ひ hi（如「火」[çi]）的首辅音，通常是 /h/ 在 /i/ 前的实现。',
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
