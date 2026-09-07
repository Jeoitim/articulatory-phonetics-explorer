import type { Airstream, Consonant, Place } from '../domain/phonetics';
import { placeLabels } from './labels';

export const airstreamLabels: Record<Airstream, string> = {
  'pulmonic-egressive': '肺部呼气 · 向外',
  ejective: '挤喉 · 声门外出',
  implosive: '内爆 · 喉部下降',
  click: '搭嘴 · 口腔局部内入',
};
const specs: [string, Place, Airstream, string, string][] = [
  ['ʘ', 'bilabial', 'click', 'Bilabial click', 'Bilabial click'],
  ['ǀ', 'dental', 'click', 'Dental click', 'Dental click'],
  ['ǃ', 'alveolar', 'click', 'Postalveolar click', 'Postalveolar click'],
  [
    'ǂ',
    'postalveolar',
    'click',
    'Palatoalveolar click',
    'Palatoalveolar click',
  ],
  [
    'ǁ',
    'alveolar',
    'click',
    'Alveolar lateral click',
    'Alveolar lateral click',
  ],
  [
    'ɓ',
    'bilabial',
    'implosive',
    'Voiced bilabial implosive',
    'Voiced bilabial implosive',
  ],
  [
    'ɗ',
    'alveolar',
    'implosive',
    'Voiced alveolar implosive',
    'Voiced alveolar implosive',
  ],
  [
    'ʄ',
    'palatal',
    'implosive',
    'Voiced palatal implosive',
    'Voiced palatal implosive',
  ],
  [
    'ɠ',
    'velar',
    'implosive',
    'Voiced velar implosive',
    'Voiced velar implosive',
  ],
  [
    'ʛ',
    'uvular',
    'implosive',
    'Voiced uvular implosive',
    'Voiced uvular implosive',
  ],
  [
    'pʼ',
    'bilabial',
    'ejective',
    'Bilabial ejective',
    'Bilabial ejective plosive',
  ],
  [
    'tʼ',
    'alveolar',
    'ejective',
    'Alveolar ejective',
    'Alveolar ejective plosive',
  ],
  ['kʼ', 'velar', 'ejective', 'Velar ejective', 'Velar ejective plosive'],
  [
    'sʼ',
    'alveolar',
    'ejective',
    'Alveolar ejective fricative',
    'Alveolar ejective fricative',
  ],
];
export const nonPulmonicConsonants: Consonant[] = specs.map(
  ([symbol, place, airstream, name, audio]) => ({
    symbol,
    place,
    airstream,
    name,
    zh:
      placeLabels[place] +
      (symbol === 'ǁ'
        ? '边搭嘴音'
        : airstream === 'click'
          ? '搭嘴音'
          : airstream === 'implosive'
            ? '浊内爆音'
            : symbol === 'sʼ'
              ? '挤喉擦音'
              : '挤喉塞音'),
    manner: symbol === 'sʼ' ? 'fricative' : 'plosive',
    voiced: airstream === 'implosive',
    velum: 'raised',
    airflow: symbol === 'ǁ' ? 'lateral' : 'central',
    unicode: Array.from(symbol).map(
      (c) => 'U+' + c.codePointAt(0)!.toString(16).toUpperCase(),
    ),
    articulation:
      airstream === 'click'
        ? '先形成前部闭塞与舌背后部闭塞，再降低两者之间的舌面扩大封闭口腔。先释放前部，外界空气短暂流入口腔；后部闭塞仍保持。边搭嘴音从舌侧释放，须结合俯视图。这里展示无伴随浊音或鼻音的基本机制。'
        : airstream === 'ejective'
          ? '声门关闭，喉部上升，压缩声门上方的空气；口腔闭塞释放后空气向外喷出。挤喉擦音通过狭窄通道向外产生摩擦。气流并非由肺部呼气直接驱动。'
          : '口腔形成闭塞，喉部下降扩大声门上方空间，帮助维持浊音。释放时可出现短暂内入气流；实际内爆音常混合维持声带振动的肺部外出气流，不能理解为把空气一路吸入肺部。',
    acoustics:
      airstream === 'click'
        ? '前闭塞释放产生短促瞬态；不同前部闭塞形状影响爆破的频谱。'
        : airstream === 'ejective'
          ? '释放常有明显爆破或摩擦，并可伴随声门释放；强度与时间关系因语言而异。'
          : '通常带浊音，释放与后续元音起始提供辨认线索；并非所有内爆音都有可闻的吸气声。',
    examples: [
      airstream === 'click'
        ? '搭嘴音见于南部非洲多种语言；不同符号表示不同的前部闭塞类型。'
        : airstream === 'implosive'
          ? '内爆音见于信德语等语言；五个符号表示 IPA 表中的五类浊内爆音，并非某一种语言必然具有全部五类。'
          : '挤喉音见于高加索及美洲多种语言。ʼ 是可与辅音组合的气流机制附加符号，这里列出 IPA 官方表的四个示例。',
    ],
    audioFile: audio + '.ogg',
    preset: place,
    animationPreset: symbol === 'sʼ' ? 'fricative' : 'plosive',
    ...(airstream === 'click' ? { secondaryPlace: 'velar' as const } : {}),
  }),
);
