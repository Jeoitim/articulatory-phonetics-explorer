/** Normalized teaching parameters, not measured muscle forces or pressure thresholds. */
export interface PhonationControls {
  adduction: number;
  posteriorOpening: number;
  tension: number;
  drive: number;
  irregularity: number;
  edgeOnly: number;
}
export type Phonation =
  | 'silent'
  | 'voiceless'
  | 'whisper'
  | 'breathy'
  | 'slack'
  | 'modal'
  | 'stiff'
  | 'pressed'
  | 'creaky'
  | 'falsetto'
  | 'closure'
  | 'whispery'
  | 'whispery-creaky'
  | 'creaky-falsetto'
  | 'whispery-falsetto'
  | 'whispery-creaky-falsetto';
export const phonationLabels: Record<Phonation, string> = {
  silent: '无声态',
  voiceless: '喉开态（呼气声）',
  whisper: '耳语声',
  breathy: '气声（呼气浊声）',
  slack: '弛声（松声）',
  modal: '常态浊声',
  stiff: '紧声（僵声）',
  pressed: '挤喉发声',
  creaky: '嘎裂声',
  falsetto: '假声',
  closure: '喉闭态',
  whispery: '耳语浊声',
  'whispery-creaky': '耳语嘎裂声',
  'creaky-falsetto': '嘎裂假声',
  'whispery-falsetto': '耳语假声',
  'whispery-creaky-falsetto': '耳语嘎裂假声',
};
const controls = (
  adduction: number,
  posteriorOpening: number,
  tension: number,
  drive: number,
  irregularity = 0,
  edgeOnly = 0,
): PhonationControls => ({
  adduction,
  posteriorOpening,
  tension,
  drive,
  irregularity,
  edgeOnly,
});
export const phonationPresets: Record<
  Phonation,
  { english: string; controls: PhonationControls; description: string }
> = {
  silent: {
    english: 'No phonation',
    controls: controls(0.08, 0.75, 0.3, 0),
    description:
      '示例为低驱动的静息开口：没有声带周期振动，也没有明显气流噪声。无声不只对应这一种声门形状。',
  },
  voiceless: {
    english: 'Open glottis / breath',
    controls: controls(0.08, 0.8, 0.35, 0.7),
    description:
      '韧带声门与后部软骨声门开放；气流通过而没有周期性声带振动。图示呼气条件，喉开态本身不保证有可闻噪声。',
  },
  whisper: {
    english: 'Whisper',
    controls: controls(0.88, 0.65, 0.5, 0.28),
    description:
      '典型耳语构形：前部声带靠拢，后部保留气流通道，以噪声为主而没有规则声带振动；不是小音量的常态浊声。',
  },
  breathy: {
    english: 'Breathy voice',
    controls: controls(0.34, 0.3, 0.4, 0.7),
    description:
      '声带振动伴随较多漏气，闭合不完全。图中同时保留膜部缝隙与后部开口，只代表一种教学构形。',
  },
  slack: {
    english: 'Slack / lax voice',
    controls: controls(0.47, 0.1, 0.4, 0.65),
    description:
      '比常态浊声较松、漏气较轻，未达到典型气声的程度；“弛声”与气声的分界依语言和研究而异。',
  },
  modal: {
    english: 'Modal voice',
    controls: controls(0.6, 0, 0.5, 0.65),
    description:
      '声带适度靠拢，较规则地开闭。本预设有完整闭合，但不同说话人的常态浊声并不都具有相同闭合比例。',
  },
  stiff: {
    english: 'Stiff / tense voice',
    controls: controls(0.76, 0, 0.55, 0.65),
    description:
      '比常态浊声内收更强、开放期较短，仍可规则振动。常见译名包括紧声、僵声；与挤喉发声有用语重叠，并非统一分级。',
  },
  pressed: {
    english: 'Pressed phonation',
    controls: controls(0.9, 0, 0.5, 0.72),
    description:
      '更强的声带内收与压紧，图示短开放期。挤喉不必伴随嘎裂脉冲，也不等同于把声带纵向拉长。',
  },
  creaky: {
    english: 'Creaky voice',
    controls: controls(0.88, 0, 0.2, 0.62, 1),
    description:
      '以较短厚的声带、较长闭合期与不均匀脉冲示意一种嘎裂声。实际有规则低频、双脉冲等亚型，不规则性不是所有嘎裂声的必备条件。',
  },
  falsetto: {
    english: 'Falsetto',
    controls: controls(0.57, 0, 0.95, 0.7, 0, 1),
    description:
      '声带拉长变薄，以边缘振动为主；图示较小振幅。假声不能只靠“频率更高”或“内收更紧”定义，也不必都有漏气。',
  },
  closure: {
    english: 'Glottal closure',
    controls: controls(1, 0, 0.5, 0.65),
    description:
      '完全闭合的保持阶段，无持续周期振动，也没有穿过声门的气流；释放可形成喉塞音 [ʔ]，此面板不演示除阻。',
  },
  whispery: {
    english: 'Whispery voice',
    controls: controls(0.65, 0.5, 0.5, 0.65),
    description:
      '前部振动与后部气流噪声并存。本页称耳语浊声以区别无周期振动的耳语声；部分文献将其与气声合称。',
  },
  'whispery-creaky': {
    english: 'Whispery creaky voice',
    controls: controls(0.88, 0.45, 0.2, 0.62, 1),
    description:
      '嘎裂型前部脉冲叠加后部耳语气流通道；作为可组合特征示意，不是所有语言共有的独立音位。',
  },
  'creaky-falsetto': {
    english: 'Creaky falsetto',
    controls: controls(0.82, 0, 0.95, 0.7, 0.85, 1),
    description:
      '假声边缘振动条件叠加嘎裂型脉冲调制。图示的是复合特征，不表示嘎裂声必须低音、假声必须规则。',
  },
  'whispery-falsetto': {
    english: 'Whispery falsetto',
    controls: controls(0.6, 0.45, 0.95, 0.7, 0, 1),
    description:
      '假声型边缘振动叠加后部漏气通道；不能把它放在单一松紧轴的某个固定位置。',
  },
  'whispery-creaky-falsetto': {
    english: 'Whispery creaky falsetto',
    controls: controls(0.82, 0.45, 0.95, 0.7, 0.85, 1),
    description:
      '同时示意后部漏气、假声边缘振动和嘎裂型脉冲。用于理解特征组合，不作为标准发音或喉镜重建。',
  },
};
export const phonationGroups: { label: string; modes: Phonation[] }[] = [
  {
    label: '常见基本发声态',
    modes: [
      'breathy',
      'slack',
      'modal',
      'stiff',
      'pressed',
      'creaky',
      'falsetto',
      'whisper',
      'voiceless',
      'closure',
      'silent',
    ],
  },
  {
    label: '耳语与假声的复合态',
    modes: [
      'whispery',
      'whispery-creaky',
      'creaky-falsetto',
      'whispery-falsetto',
      'whispery-creaky-falsetto',
    ],
  },
];
export const phonationContinuum: Phonation[] = [
  'breathy',
  'slack',
  'modal',
  'stiff',
  'creaky',
];
export const phonationControlKeys = [
  'adduction',
  'posteriorOpening',
  'tension',
  'drive',
  'irregularity',
  'edgeOnly',
] as const;
const clamp = (n: number, fallback = 0) =>
  Math.max(0, Math.min(1, Number.isFinite(n) ? n : fallback));
export function constrainPhonation(p: PhonationControls): PhonationControls {
  return Object.fromEntries(
    phonationControlKeys.map((k) => [
      k,
      clamp(p[k], phonationPresets.modal.controls[k]),
    ]),
  ) as unknown as PhonationControls;
}
export function samplePhonationContinuum(value: number): PhonationControls {
  const t = Math.max(0, Math.min(4, Number.isFinite(value) ? value : 2));
  if (Number.isInteger(t))
    return { ...phonationPresets[phonationContinuum[t]!].controls };
  const i = Math.min(3, Math.floor(t));
  const a = phonationPresets[phonationContinuum[i]!].controls;
  const b = phonationPresets[phonationContinuum[i + 1]!].controls;
  return Object.fromEntries(
    phonationControlKeys.map((k) => [k, a[k] + (b[k] - a[k]) * (t - i)]),
  ) as unknown as PhonationControls;
}
/** A continuous teaching model; coefficients are display choices, not physiological thresholds. */
export function phonationControlFrame(input: PhonationControls, phase: number) {
  const p = constrainPhonation(input);
  const t = Number.isFinite(phase) ? ((phase % 1) + 1) % 1 : 0.25;
  const ramp = (v: number, low: number, high: number) =>
    clamp((v - low) / (high - low));
  const vibration =
    ramp(p.drive, 0.32, 0.55) *
    ramp(p.adduction, 0.12, 0.28) *
    (1 - ramp(p.adduction, 0.96, 1));
  const pulse = Math.max(0, Math.sin(t * Math.PI * 2));
  const threshold = clamp((p.adduction - 0.4) * 1.5);
  const regular = Math.max(0, (pulse - threshold) / (1 - threshold));
  const irregular =
    Math.max(0, 1 - Math.abs(t - 0.16) / 0.055) * 0.65 +
    Math.max(0, 1 - Math.abs(t - 0.63) / 0.085);
  const minGap =
    Math.max(0, (0.52 - p.adduction) / 0.18) * 3 +
    p.edgeOnly * 0.6 * (1 - ramp(p.adduction, 0.8, 1));
  const aperture = Math.max(0, (0.28 - p.adduction) / 0.28) * 32;
  const gap =
    Math.max(aperture, minGap) +
    vibration *
      (12 - 5 * p.irregularity) *
      (1 - 0.6 * p.edgeOnly) *
      ((1 - p.irregularity) * regular + p.irregularity * irregular);
  const posteriorGap = p.posteriorOpening * 24;
  const turbulence =
    ramp(p.drive, 0.08, 0.4) *
    clamp((posteriorGap + Math.max(aperture, minGap)) / 12);
  return {
    gap,
    posteriorGap,
    vibration,
    turbulence,
    length: 142 + p.tension * 36,
    thickness: (27 - p.tension * 10) * (1 - 0.25 * p.edgeOnly),
    edgeOnly: p.edgeOnly,
  };
}
/** Compatibility entry point used by consonant and IPA-mark insets. */
export function phonationFrame(
  mode: Phonation,
  phase: number,
  tension?: number,
) {
  return phonationControlFrame(
    {
      ...phonationPresets[mode].controls,
      ...(tension === undefined ? {} : { tension }),
    },
    phase,
  );
}
