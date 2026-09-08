import type { Place, Manner, VariantMark } from '../domain/phonetics';
export const placeLabels: Record<Place, string> = {
  bilabial: '双唇',
  labiodental: '唇齿',
  dental: '齿',
  alveolar: '齿龈',
  postalveolar: '齿龈后',
  'alveolo-palatal': '龈腭',
  retroflex: '卷舌',
  palatal: '硬腭',
  velar: '软腭',
  uvular: '小舌',
  pharyngeal: '咽',
  glottal: '声门',
};
export const placeEnglish: Record<Place, string> = {
  bilabial: 'Bilabial',
  labiodental: 'Labiodental',
  dental: 'Dental',
  alveolar: 'Alveolar',
  postalveolar: 'Postalveolar',
  'alveolo-palatal': 'Alveolo-palatal',
  retroflex: 'Retroflex',
  palatal: 'Palatal',
  velar: 'Velar',
  uvular: 'Uvular',
  pharyngeal: 'Pharyngeal',
  glottal: 'Glottal',
};
export const mannerLabels: Record<Manner, string> = {
  plosive: '塞音',
  nasal: '鼻音',
  trill: '颤音',
  tap: '闪音',
  fricative: '擦音',
  'lateral-fricative': '边擦音',
  approximant: '近音',
  'lateral-approximant': '边近音',
  affricate: '塞擦音',
};
export const mannerEnglish: Record<Manner, string> = {
  plosive: 'Plosive',
  nasal: 'Nasal',
  trill: 'Trill',
  tap: 'Tap / flap',
  fricative: 'Fricative',
  'lateral-fricative': 'Lateral fricative',
  approximant: 'Approximant',
  'lateral-approximant': 'Lateral approximant',
  affricate: 'Affricate',
};

/**
 * Chinese prefixes for the secondary marks exposed by the construction lab.
 * Keeping these beside the place/manner labels lets a displayed title read as
 * one precise phonetic term, for example “清化浊齿龈鼻音” for [n̥].
 */
export const variantPrefixLabels: Partial<Record<VariantMark, string>> = {
  '̪': '齿化',
  '̺': '舌尖性',
  '̻': '舌叶性',
  '̼': '舌唇性',
  ʷ: '唇化',
  ʲ: '腭化',
  ˠ: '软腭化',
  ˤ: '咽化',
  ʰ: '送气',
  '̥': '清化',
  '̊': '清化',
  '̬': '浊化',
};

/**
 * English prefixes for the constructible secondary realizations. Voice
 * changes use a full phrase so the base category remains unambiguous, e.g.
 * “Voiceless realization of voiced alveolar nasal”.
 */
export const variantEnglishPrefixLabels: Partial<
  Record<VariantMark, string>
> = {
  '̪': 'Dentalized',
  '̺': 'Apical',
  '̻': 'Laminal',
  '̼': 'Linguolabial',
  ʷ: 'Labialized',
  ʲ: 'Palatalized',
  ˠ: 'Velarized',
  ˤ: 'Pharyngealized',
  ʰ: 'Aspirated',
  '̥': 'Voiceless realization of',
  '̊': 'Voiceless realization of',
  '̬': 'Voiced realization of',
};
