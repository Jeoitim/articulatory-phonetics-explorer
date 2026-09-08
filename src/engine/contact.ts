import type {
  Pose,
  Place,
  Manner,
  TongueKey,
  Consonant,
} from '../domain/phonetics';
import { zones, roofY } from './geometry';
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
  sound?: Consonant,
): ArticulatoryContact {
  if (sound?.airstream === 'click') {
    const front = articulationContact(p, place, manner);
    return {
      ...front,
      active: front.active + ' ＋ 舌面后部',
      passive: front.passive + ' ＋ 软腭',
      note: '前后两处闭塞共同建立口腔气流机制；边搭嘴音的舌侧释放需结合俯视图。',
    };
  }
  if (
    sound?.variant === 'labial-velar' ||
    sound?.variant === 'labial-palatal'
  ) {
    const back = articulationContact(p, place, manner);
    return {
      ...back,
      active: '双唇 ＋ ' + back.active,
      passive: '唇间 ＋ ' + back.passive,
      note: '唇部与舌部同时形成狭窄，不能只标为单一舌部调音。',
    };
  }
  if (sound?.variant === 'dark-l') {
    const front = articulationContact(p, place, manner);
    return {
      ...front,
      active: front.active + ' ＋ 舌面后部',
      passive: front.passive + ' ＋ 软腭区',
      note: '保留齿龈中央接触和舌侧通道，同时加入后舌抬高。',
    };
  }
  if (sound?.variant === 'sje')
    return {
      active: '舌叶与舌背（本示意）',
      passive: '龈后与后部狭窄区',
      key: 'blade',
      note: '[ɧ] 的实际构形差异很大；此图只展示一种近似，不把它当作统一精确模板。',
    };
  // A linguolabial gesture uses the tongue tip or blade against the upper
  // lip. It is easy to misread as dental when only the nearest chart zone is
  // considered, so detect the anterior tongue point before place fallbacks.
  const linguolabialKey: TongueKey | null =
    p.variantMark === '̼'
      ? 'tip'
      : p.tongue.tip.x <= 135 &&
          p.tongue.tip.y >= 390 &&
          p.tongue.tip.y <= 475
        ? 'tip'
        : p.tongue.blade.x <= 145
          ? 'blade'
          : null;
  if (linguolabialKey)
    return {
      active: linguolabialKey === 'tip' ? '舌尖前端' : '舌叶（舌尖后方）',
      passive: '上唇',
      key: linguolabialKey,
      note: '舌尖或舌叶与上唇形成接触或狭窄；舌唇音用附加符号 [t̼ d̼] 标示。',
    };
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
  if (place === 'alveolo-palatal')
    return {
      active: '舌叶后部与舌面前部',
      passive: '龈后至硬腭前部',
      key: 'front',
      note: '舌叶与舌面前部共同抬高，形成较长的腭化狭窄区；不能只凭一个龈后接近点判断。',
    };
  if (place === 'retroflex')
    return {
      active: p.retroflex > 0.85 ? '反卷舌尖／舌尖下表面' : '抬起并后撤的舌尖',
      passive: passive.retroflex!,
      key: 'tip',
      note: '这里展示一种卷舌构形；卷舌并不要求所有语言都采用强烈反卷。',
    };
  const z = zones.find((z) => z.place === place);
  let key: TongueKey = 'tip';
  if (z) {
    if (
      (place === 'alveolar' || place === 'postalveolar') &&
      z.keys.includes('blade') &&
      z.keys.includes('tip')
    ) {
      const bladeGap = p.tongue.blade.y - roofY(p.tongue.blade.x);
      const tipGap = p.tongue.tip.y - roofY(p.tongue.tip.x);
      if (bladeGap < tipGap - 8) {
        key = 'blade';
      } else if (tipGap < bladeGap - 8) {
        key = 'tip';
      } else {
        key = [...z.keys].sort(
          (a, b) =>
            Math.hypot(p.tongue[a].x - z.point.x, p.tongue[a].y - z.point.y) -
            Math.hypot(p.tongue[b].x - z.point.x, p.tongue[b].y - z.point.y),
        )[0]!;
      }
    } else {
      key = [...z.keys].sort(
        (a, b) =>
          Math.hypot(p.tongue[a].x - z.point.x, p.tongue[a].y - z.point.y) -
          Math.hypot(p.tongue[b].x - z.point.x, p.tongue[b].y - z.point.y),
      )[0]!;
    }
  }
  return {
    active: names[key],
    passive: passive[place] || place,
    key,
    ...(place === 'postalveolar' && key === 'tip'
      ? {
          note: '可形成舌尖型 [ʃ̺]。本项目采用舌叶型教学预设；舌尖性与舌叶性用 IPA 附加符号区分，还需结合舌尖朝向与整体形状区分卷舌音。',
        }
      : {}),
  };
}
