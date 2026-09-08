export const places = [
  'bilabial',
  'labiodental',
  'dental',
  'alveolar',
  'postalveolar',
  'retroflex',
  'palatal',
  'velar',
  'uvular',
  'pharyngeal',
  'glottal',
] as const;
export type Place = (typeof places)[number] | 'alveolo-palatal';
export type ExtendedPlace =
  | 'labial-velar'
  | 'labial-palatal'
  | 'alveolo-palatal'
  | 'epiglottal'
  | 'sje';
export const manners = [
  'plosive',
  'nasal',
  'trill',
  'tap',
  'fricative',
  'lateral-fricative',
  'approximant',
  'lateral-approximant',
  'affricate',
] as const;
export type Manner = (typeof manners)[number];
export type Point = { x: number; y: number };
export type TongueKey = 'tip' | 'blade' | 'front' | 'dorsum' | 'root';
export type Airstream =
  | 'pulmonic-egressive'
  | 'ejective'
  | 'implosive'
  | 'click';
export interface Features {
  manner: Manner;
  voiced: boolean;
  velum: 'raised' | 'lowered';
  airflow: 'central' | 'lateral';
  airstream: Airstream;
}
export interface Pose {
  tongue: Record<TongueKey, Point>;
  jaw: number;
  lowerLip: number;
  velum: number;
  glottis: number;
  rounding: number;
  retroflex: number;
  epiglottis: number;
  dentalContact: number;
  uvula: number;
  larynx: number;
  /** Extra glottal airflow used by an aspirated secondary articulation. */
  aspiration?: number;
  /** Internal hint retained by a constructible variant until the next drag. */
  variantOf?: string;
  variantMark?: VariantMark;
}
export interface AudioExample {
  audioUrl: string;
  speaker: string;
  source: string;
  license: string;
  licenseUrl: string;
  attribution: string;
}
export interface Consonant extends Features {
  symbol: string;
  unicode: string[];
  place: Place;
  name: string;
  zh: string;
  articulation: string;
  acoustics: string;
  examples: string[];
  audioFile: string;
  preset: string;
  animationPreset: Manner;
  secondaryPlace?: Place;
  variant?: ExtendedPlace | 'dark-l' | 'lateral-tap';
}
export type VariantMark =
  | '̪'
  | '̺'
  | '̻'
  | '̼'
  | 'ʷ'
  | 'ʲ'
  | 'ˠ'
  | 'ˤ'
  | 'ʰ'
  | '̥'
  | '̊'
  | '̬';
export interface VariantHint {
  symbol: string;
  mark?: VariantMark;
}
export type Match = {
  nonTypical?: boolean;
  /** IPA place or active-articulator mark used for the displayed realization. */
  variantMark?: VariantMark;
  contact: {
    active: string;
    passive: string;
    key: TongueKey | null;
    note?: string;
  };
  status: 'canonical' | 'closest' | 'none' | 'unsupported';
  place: Place;
  candidates: { sound: Consonant; distance: number; differences: string[] }[];
  explanation: string;
  proximity: number;
  gap: number;
};
export type Mode = 'explore' | 'build' | 'compare' | 'lessons' | 'vowels';
