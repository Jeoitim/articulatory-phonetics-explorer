import type { Manner } from '../domain/phonetics';
export interface Phase {
  at: number;
  name: string;
  shape: number;
  flow: 'off' | 'smooth' | 'turbulent' | 'nasal' | 'burst';
  pressure: number;
}
const sustained: Phase[] = [
  { at: 0, name: '静息', shape: 0, flow: 'off', pressure: 0 },
  { at: 0.2, name: '接近目标', shape: 1, flow: 'smooth', pressure: 0 },
  { at: 0.8, name: '持续发音', shape: 1, flow: 'smooth', pressure: 0 },
  { at: 1, name: '恢复', shape: 0, flow: 'off', pressure: 0 },
];
export const animationPresets: Record<Manner, Phase[]> = {
  plosive: [
    { at: 0, name: '静息', shape: 0, flow: 'off', pressure: 0 },
    { at: 0.31, name: '形成闭塞', shape: 1, flow: 'off', pressure: 0 },
    { at: 0.56, name: '保持闭塞', shape: 1, flow: 'off', pressure: 0.4 },
    { at: 0.62, name: '压力积累', shape: 1, flow: 'off', pressure: 1 },
    { at: 0.66, name: '释放 burst', shape: 0.75, flow: 'burst', pressure: 0 },
    { at: 1, name: '恢复', shape: 0, flow: 'off', pressure: 0 },
  ],
  nasal: sustained.map((p) => ({ ...p, flow: p.shape ? 'nasal' : 'off' })),
  fricative: sustained.map((p) => ({
    ...p,
    flow: p.shape ? 'turbulent' : 'off',
  })),
  approximant: sustained,
  'lateral-approximant': sustained,
  trill: sustained.map((p) => ({
    ...p,
    name: p.at === 0.8 ? '周期性接触' : p.name,
  })),
  tap: [
    { at: 0, name: '静息', shape: 0, flow: 'smooth', pressure: 0 },
    { at: 0.45, name: '快速接近', shape: 0.5, flow: 'smooth', pressure: 0 },
    { at: 0.5, name: '单次接触', shape: 1, flow: 'off', pressure: 0 },
    { at: 0.56, name: '离开', shape: 0.4, flow: 'smooth', pressure: 0 },
    { at: 1, name: '恢复', shape: 0, flow: 'off', pressure: 0 },
  ],
  'lateral-fricative': sustained.map((p) => ({
    ...p,
    flow: p.shape ? 'turbulent' : 'off',
  })),
  affricate: [
    { at: 0, name: '接近', shape: 0, flow: 'off', pressure: 0 },
    { at: 0.25, name: '完全闭塞', shape: 1, flow: 'off', pressure: 0 },
    { at: 0.43, name: '闭塞保持', shape: 1, flow: 'off', pressure: 0.7 },
    { at: 0.53, name: '摩擦释放', shape: 1, flow: 'turbulent', pressure: 0 },
    { at: 0.83, name: '持续摩擦', shape: 1, flow: 'turbulent', pressure: 0 },
    { at: 1, name: '恢复', shape: 0, flow: 'off', pressure: 0 },
  ],
};
