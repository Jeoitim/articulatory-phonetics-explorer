import type { Consonant, Place, Manner } from '../domain/phonetics';
import { nonPulmonicConsonants } from './non-pulmonic';
import { placeLabels, mannerLabels } from './labels';
import {
  additionalConsonants,
  extendedConsonants,
} from './additional-consonants';
type Row = [string, Place, Manner, boolean, string, string[]];
const rows: Row[] = [
  [
    'p',
    'bilabial',
    'plosive',
    false,
    'Voiceless bilabial plosive',
    ['英语 spin 中的 p 通常不送气；普通话 p 通常送气，不能直接等同。'],
  ],
  [
    'b',
    'bilabial',
    'plosive',
    true,
    'Voiced bilabial plosive',
    ['法语 beau；普通话拼音 b 通常是清不送气音，并非 [b]。'],
  ],
  [
    'm',
    'bilabial',
    'nasal',
    true,
    'Bilabial nasal',
    ['英语 moon；普通话 妈 mā 的声母。'],
  ],
  [
    't',
    'alveolar',
    'plosive',
    false,
    'Voiceless alveolar plosive',
    ['英语 stay 中的 t；法语 t 常更接近齿音。'],
  ],
  [
    'd',
    'alveolar',
    'plosive',
    true,
    'Voiced alveolar plosive',
    ['英语 day；普通话拼音 d 通常为清不送气音。'],
  ],
  [
    'n',
    'alveolar',
    'nasal',
    true,
    'Alveolar nasal',
    ['英语 no；实际接触部位随语言和相邻音改变。'],
  ],
  [
    's',
    'alveolar',
    'fricative',
    false,
    'Voiceless alveolar sibilant',
    ['英语 see；普通话 s。舌尖／舌叶实现可能不同。'],
  ],
  [
    'z',
    'alveolar',
    'fricative',
    true,
    'Voiced alveolar sibilant',
    ['英语 zoo；法语 zéro。普通话拼音 z 是塞擦音。'],
  ],
  [
    'l',
    'alveolar',
    'lateral-approximant',
    true,
    'Alveolar lateral approximant',
    ['英语 light 的清晰 l；英语词尾 l 常伴随舌背后缩。'],
  ],
  [
    'ɹ',
    'alveolar',
    'approximant',
    true,
    'Alveolar approximant',
    ['英语 red 的 r 有舌尖型和舌体隆起型等变体；此处展示一种教学构形。'],
  ],
  [
    'ʃ',
    'postalveolar',
    'fricative',
    false,
    'Voiceless palato-alveolar sibilant',
    [
      'English · ship [ʃɪp]',
      'French · chat [ʃa]',
      '普通话 sh 常记为 [ʂ]，不能直接等同于 [ʃ]。',
    ],
  ],
  [
    'ʒ',
    'postalveolar',
    'fricative',
    true,
    'Voiced palato-alveolar sibilant',
    ['英语 vision 中间的音；法语 jour。'],
  ],
  [
    'ɾ',
    'alveolar',
    'tap',
    true,
    'Alveolar tap',
    ['西班牙语 pero；部分美式英语 city 中的 t。'],
  ],
  [
    'r',
    'alveolar',
    'trill',
    true,
    'Alveolar trill',
    ['西班牙语 perro；与 pero 中的单次闪音相区别。'],
  ],
  [
    'j',
    'palatal',
    'approximant',
    true,
    'Palatal approximant',
    ['英语 yes；德语 ja。不是英语字母 j 的发音。'],
  ],
  [
    'k',
    'velar',
    'plosive',
    false,
    'Voiceless velar plosive',
    ['英语 skin 中的 k；接触位置受后接元音影响。'],
  ],
  [
    'ɡ',
    'velar',
    'plosive',
    true,
    'Voiced velar plosive',
    ['英语 go；普通话拼音 g 通常为清不送气音。'],
  ],
  [
    'ŋ',
    'velar',
    'nasal',
    true,
    'Velar nasal',
    ['英语 sing；普通话 ang、eng 的韵尾。'],
  ],
  [
    'x',
    'velar',
    'fricative',
    false,
    'Voiceless velar fricative',
    ['德语 Bach；部分西班牙语 jota 的首音，方言间可偏小舌或声门。'],
  ],
  [
    'f',
    'labiodental',
    'fricative',
    false,
    'Voiceless labiodental fricative',
    ['英语 fine；普通话 f。'],
  ],
  [
    'v',
    'labiodental',
    'fricative',
    true,
    'Voiced labiodental fricative',
    ['英语 very；法语 vous。'],
  ],
  [
    'θ',
    'dental',
    'fricative',
    false,
    'Voiceless dental fricative',
    ['英语 thin；西班牙部分方言 cinco 中的 c。'],
  ],
  [
    'ð',
    'dental',
    'fricative',
    true,
    'Voiced dental fricative',
    ['英语 this；西班牙语元音间 d 经常为更开放的近音实现。'],
  ],
  [
    'h',
    'glottal',
    'fricative',
    false,
    'Voiceless glottal fricative',
    ['英语 hat；[h] 的口腔形状常随相邻元音变化。'],
  ],
];
const explanations: Record<Manner, string> = {
  plosive:
    '形成完整闭塞，短暂阻断口腔气流；随后解除闭塞，出现释放。闭塞时的压力以定性高亮表示。',
  nasal: '口腔形成闭塞，软腭降低，使鼻咽通道开放。呼出的气流经鼻腔流出。',
  fricative:
    '主动调音器官接近被动部位，形成狭窄通道。气流通过时产生摩擦噪声；二维间距仅作示意。',
  approximant:
    '器官接近目标部位，但保留较宽通道；典型实现没有持续、明显的摩擦噪声。',
  'lateral-approximant':
    '舌尖中央与齿龈接触，气流沿舌头一侧或两侧绕过。请结合俯视图观察侧向通道。',
  trill:
    '气流驱动舌尖与齿龈区域反复接触和分离。动画是周期性开闭的简化示意，并非肌肉主动逐次敲击。',
  tap: '舌尖快速接触齿龈区域一次，立即离开。它与颤音的区别在时间行为，不只在静态嘴型。',
  'lateral-fricative': '中央阻塞，气流通过狭窄侧向通道产生摩擦。',
  affricate: '先完整闭塞，再释放到摩擦阶段；两个阶段构成连续发音过程。',
};
export const consonants: Consonant[] = [
  ...rows.map<Consonant>(
    ([symbol, place, manner, voiced, audioName, examples]) => ({
      symbol,
      place,
      manner,
      voiced,
      unicode: Array.from(symbol).map(
        (c) => 'U+' + c.codePointAt(0)!.toString(16).toUpperCase(),
      ),
      velum: manner === 'nasal' ? 'lowered' : 'raised',
      airflow: manner.startsWith('lateral') ? 'lateral' : 'central',
      airstream: 'pulmonic-egressive',
      name: `${voiced ? 'Voiced' : 'Voiceless'} ${place} ${manner.replaceAll('-', ' ')}`,
      zh: `${voiced ? '浊' : '清'}${placeLabels[place]}${mannerLabels[manner]}`,
      articulation:
        symbol === 'h'
          ? '声门处形成呼气性噪声，口腔通常预备相邻元音的形状；不能依据舌头位置识别 [h]。'
          : explanations[manner],
      acoustics:
        manner === 'nasal'
          ? '鼻腔共鸣带来低频鼻音能量及反共振；具体频谱随口腔闭塞位置改变。'
          : manner === 'plosive'
            ? '闭塞段、释放瞬间与起声时序共同构成听觉线索。图中的时间并非录音的实测时间。'
            : manner === 'fricative'
              ? '持续噪声的频谱受狭窄形状和前腔长度影响。[s] 与 [ʃ] 的主要噪声能量分布通常不同。'
              : '共振与快速过渡共同提供听觉线索；构形示意不能唯一预测实际声学结果。',
      examples,
      audioFile: audioName + '.ogg',
      preset: place,
      animationPreset: manner,
    }),
  ),
  ...additionalConsonants,
  ...extendedConsonants,
  ...nonPulmonicConsonants,
];
export const soundBySymbol = (symbol: string) =>
  consonants.find((s) => s.symbol === symbol) ?? consonants[10]!;
