import type { Pose, Place, Manner, TongueKey } from '../domain/phonetics';
import { zones } from './geometry';
export interface ArticulatoryContact {
  active: string;
  passive: string;
  key: TongueKey | null;
  note?: string;
}
const names: Record<TongueKey, string> = {
  tip: '舌尖前端',
  blade: '舌叶（舌尖后方）',
  front: '舌面前部',
  dorsum: '舌面后部',
  root: '舌根',
};
const passive: Partial<Record<Place, string>> = {
  dental: '上齿',
  alveolar: '齿龈',
  postalveolar: '龈后',
  retroflex: '龈后／硬腭前缘',
  palatal: '硬腭',
  velar: '软腭',
  uvular: '小舌区',
  pharyngeal: '咽后壁',
};
/** Active and passive articulators are separate from the conventional IPA column. */
export function articulationContact(
  p: Pose,
  place: Place,
  manner?: Manner,
): ArticulatoryContact {
  if (place === 'bilabial')
    return { active: '下唇', passive: '上唇', key: null };
  if (place === 'labiodental')
    return { active: '下唇', passive: '上门齿', key: null };
  if (place === 'glottal')
    return { active: '声带', passive: '对侧声带／声门', key: null };
  if (place === 'pharyngeal' && p.epiglottis > 0.5)
    return {
      active: '会厌与杓会厌区',
      passive: '喉入口',
      key: null,
      note: '喉入口狭窄示意，不能仅由舌根位置解释。',
    };
  if (place === 'uvular' && manner === 'trill')
    return { active: '小舌', passive: '舌面后部', key: null };
  if (place === 'retroflex')
    return {
      active: p.retroflex > 0.85 ? '反卷舌尖／舌尖下表面' : '抬起并后撤的舌尖',
      passive: passive.retroflex!,
      key: 'tip',
      note: '这里展示一种卷舌构形；卷舌并不要求所有语言都采用强烈反卷。',
    };
  const z = zones.find((z) => z.place === place),
    key = z
      ? [...z.keys].sort(
          (a, b) =>
            Math.hypot(p.tongue[a].x - z.point.x, p.tongue[a].y - z.point.y) -
            Math.hypot(p.tongue[b].x - z.point.x, p.tongue[b].y - z.point.y),
        )[0]!
      : 'tip';
  return {
    active: names[key],
    passive: passive[place] || place,
    key,
    ...(place === 'postalveolar' && key === 'tip'
      ? {
          note: '舌尖—龈后不能独自决定 [ʃ] 或 [ʂ]；还需观察舌尖朝向、舌叶与舌面形状。',
        }
      : {}),
  };
}
