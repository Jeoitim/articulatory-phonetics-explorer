import type { Place, Manner } from '../domain/phonetics';
export const placeLabels: Record<Place, string> = {
  bilabial: '双唇',
  labiodental: '唇齿',
  dental: '齿',
  alveolar: '齿龈',
  postalveolar: '齿龈后',
  retroflex: '卷舌',
  palatal: '硬腭',
  velar: '软腭',
  uvular: '小舌',
  pharyngeal: '咽',
  glottal: '声门',
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
