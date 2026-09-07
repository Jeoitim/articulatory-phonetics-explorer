// Official interactive IPA chart metadata, retrieved 2026-09-07. Audio streams from its original host.
export const ipaAudioSource =
  'https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html#eng';
export interface ReferenceClip {
  speaker: string;
  example: string;
  context: string[];
  url: string;
}
export const ipaReferenceAudio: Record<
  string,
  { ipaNumber: string; clips: ReferenceClip[] }
> = {
  '͜': {
    ipaNumber: '-509',
    clips: [
      {
        speaker: 'J. Esling',
        example: 't͜s',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/035C.mp3',
      },
      {
        speaker: 'J. House',
        example: 't͜s',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/035C.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 't͜s',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/035C.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 't͜s',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/035C.mp3',
      },
    ],
  },
  '͡': {
    ipaNumber: '433',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'k͡p',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0361.mp3',
      },
      {
        speaker: 'J. House',
        example: 'k͡p',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0361.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'k͡p',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0361.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'k͡p',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0361.mp3',
      },
    ],
  },
  '̥': {
    ipaNumber: '402A',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'n̥',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0325_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'd̥',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0325_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'n̥',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0325_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'd̥',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0325_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'ŋ̊',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0325_3.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'n̥',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0325_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'd̥',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0325_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'n̥',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0325_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'd̥',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0325_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'ŋ̊',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0325_3.mp3',
      },
    ],
  },
  '̊': {
    ipaNumber: '402B',
    clips: [],
  },
  '̤': {
    ipaNumber: '405',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'b̤',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0324_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'a̤',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0324_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'b̤a̤',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0324_3.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'b̤',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0324_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'a̤',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0324_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'b̤a̤',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0324_3.mp3',
      },
    ],
  },
  '̪': {
    ipaNumber: '408',
    clips: [
      {
        speaker: 'J. Esling',
        example: 't̪',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/032A_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'd̪',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/032A_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 't̪',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/032A_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'd̪',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/032A_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 't̪',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/032A_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'd̪',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/032A_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 't̪',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/032A_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'd̪',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/032A_2.mp3',
      },
    ],
  },
  '̬': {
    ipaNumber: '403',
    clips: [
      {
        speaker: 'J. Esling',
        example: 's̬',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/032C_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 't̬',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/032C_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 's̬',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/032C_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 's̬',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/032C_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 't̬',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/032C_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 's̬',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/032C_1.mp3',
      },
    ],
  },
  '̰': {
    ipaNumber: '406',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'b̰',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0330_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'a̰',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0330_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'b̰a̰',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0330_3.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'b̰',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0330_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'a̰',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0330_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'b̰a̰',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0330_3.mp3',
      },
    ],
  },
  '̺': {
    ipaNumber: '409',
    clips: [
      {
        speaker: 'J. Esling',
        example: 't̺',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/033A_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'd̺',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/033A_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 't̺',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/033A_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'd̺',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/033A_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 't̺',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/033A_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'd̺',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/033A_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 't̺',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/033A_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'd̺',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/033A_2.mp3',
      },
    ],
  },
  ʰ: {
    ipaNumber: '404',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'tʰ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02B0_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'dʰ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02B0_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'tʰ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02B0_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'dʰ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02B0_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'tʰ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02B0_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'dʰ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02B0_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'tʰ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02B0_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'dʰ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02B0_2.mp3',
      },
    ],
  },
  '̼': {
    ipaNumber: '407',
    clips: [
      {
        speaker: 'J. Esling',
        example: 't̼',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/033C_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'd̼',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/033C_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 't̼',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/033C_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'd̼',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/033C_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 't̼',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/033C_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'd̼',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/033C_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 't̼',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/033C_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'd̼',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/033C_2.mp3',
      },
    ],
  },
  '̻': {
    ipaNumber: '410',
    clips: [
      {
        speaker: 'J. Esling',
        example: 't̻',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/033B_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'd̻',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/033B_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 't̻',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/033B_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'd̻',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/033B_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 't̻',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/033B_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'd̻',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/033B_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 't̻',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/033B_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'd̻',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/033B_2.mp3',
      },
    ],
  },
  '̹': {
    ipaNumber: '411',
    clips: [
      {
        speaker: 'P. Ladefoged',
        example: 'ɔ̹',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0339.mp3',
      },
    ],
  },
  ʷ: {
    ipaNumber: '420',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'tʷ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02B7_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'dʷ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02B7_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'tʷ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02B7_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'dʷ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02B7_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'tʷ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02B7_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'dʷ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02B7_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'tʷ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02B7_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'dʷ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02B7_2.mp3',
      },
    ],
  },
  '̃': {
    ipaNumber: '424',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['ẽ', 'ɑ̃'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0303.mp3',
      },
      {
        speaker: 'J. House',
        example: '',
        context: ['ẽ', 'ɑ̃'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0303.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['ẽ', 'ɑ̃'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0303.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['ẽ', 'ɑ̃'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0303.mp3',
      },
    ],
  },
  '̜': {
    ipaNumber: '412',
    clips: [
      {
        speaker: 'P. Ladefoged',
        example: 'ɔ̜',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/031C.mp3',
      },
    ],
  },
  ʲ: {
    ipaNumber: '421',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'tʲ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02B2_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'dʲ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02B2_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'tʲ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02B2_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'dʲ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02B2_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'tʲ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02B2_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'dʲ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02B2_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'tʲ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02B2_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'dʲ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02B2_2.mp3',
      },
    ],
  },
  ⁿ: {
    ipaNumber: '425',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'dⁿ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/207F.mp3',
      },
      {
        speaker: 'J. House',
        example: 'dⁿ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/207F.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'dⁿ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/207F.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'dⁿ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/207F.mp3',
      },
    ],
  },
  '̟': {
    ipaNumber: '413',
    clips: [
      {
        speaker: 'P. Ladefoged',
        example: 'u̟',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/031F.mp3',
      },
    ],
  },
  ˠ: {
    ipaNumber: '422',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'tˠ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02E0_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'dˠ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02E0_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'tˠ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02E0_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'dˠ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02E0_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'tˠ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02E0_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'dˠ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02E0_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'tˠ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02E0_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'dˠ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02E0_2.mp3',
      },
    ],
  },
  ˡ: {
    ipaNumber: '426',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'dˡ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02E1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'dˡ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02E1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'dˡ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02E1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'dˡ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02E1.mp3',
      },
    ],
  },
  '̠': {
    ipaNumber: '414',
    clips: [],
  },
  ˤ: {
    ipaNumber: '423',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'tˤ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02E4_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'dˤ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02E4_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'tˤ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02E4_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'dˤ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02E4_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'tˤ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02E4_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'dˤ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02E4_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'tˤ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02E4_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'dˤ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02E4_2.mp3',
      },
    ],
  },
  '̚': {
    ipaNumber: '427',
    clips: [
      {
        speaker: 'J. House',
        example: '',
        context: ['d̚', 'p̚'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/031A.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['d̚', 'p̚'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/031A.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['d̚', 'p̚'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/031A.mp3',
      },
    ],
  },
  '̈': {
    ipaNumber: '415',
    clips: [],
  },
  '̴': {
    ipaNumber: '428',
    clips: [
      {
        speaker: 'J. House',
        example: '',
        context: ['ɫ', 'ᵰ', 'ᵭ', 'ꭨ'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0334.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['ɫ', 'ᵰ', 'ᵭ', 'ꭨ'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0334.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['ɫ', 'ᵰ', 'ᵭ', 'ꭨ'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0334.mp3',
      },
    ],
  },
  '̽': {
    ipaNumber: '416',
    clips: [
      {
        speaker: 'P. Ladefoged',
        example: 'e̽',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/033D.mp3',
      },
    ],
  },
  '̝': {
    ipaNumber: '429',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'ɹ̝',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/031D_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'e̝',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/031D_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'ɹ̝',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/031D_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'e̝',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/031D_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'ɹ̝',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/031D_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'e̝',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/031D_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'ɹ̝',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/031D_2.mp3',
      },
    ],
  },
  '̩': {
    ipaNumber: '431',
    clips: [],
  },
  '̞': {
    ipaNumber: '430',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'β̞',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/031E_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'e̞',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/031E_1.mp3',
      },
      {
        speaker: 'J. House',
        example: 'β̞',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/031E_2.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'e̞',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/031E_1.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'β̞',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/031E_2.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'e̞',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/031E_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'β̞',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/031E_2.mp3',
      },
    ],
  },
  '̯': {
    ipaNumber: '432',
    clips: [],
  },
  '̘': {
    ipaNumber: '417',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'e̘',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0318.mp3',
      },
      {
        speaker: 'J. House',
        example: 'e̘',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0318.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'e̘',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0318.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'e̘',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0318.mp3',
      },
    ],
  },
  '˞': {
    ipaNumber: '419',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'ɚ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02DE_1.mp3',
      },
      {
        speaker: 'J. Esling',
        example: 'a˞',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/02DE_2.mp3',
      },
      {
        speaker: 'J. House',
        example: 'ɚ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02DE_1.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'ɚ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02DE_1.mp3',
      },
    ],
  },
  '̙': {
    ipaNumber: '418',
    clips: [
      {
        speaker: 'J. Esling',
        example: 'e̙',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0319.mp3',
      },
      {
        speaker: 'J. House',
        example: 'e̙',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0319.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'e̙',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0319.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'e̙',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0319.mp3',
      },
    ],
  },
  ˈ: {
    ipaNumber: '501',
    clips: [
      {
        speaker: 'J. House',
        example: 'ˌfoʊnəˈtɪʃən',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02C8.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'ˌfoʊnəˈtɪʃən',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02C8.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'ˌfoʊnəˈtɪʃən',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02C8.mp3',
      },
    ],
  },
  ˌ: {
    ipaNumber: '502',
    clips: [
      {
        speaker: 'J. House',
        example: 'ˌfoʊnəˈtɪʃən',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/02CC.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: 'ˌfoʊnəˈtɪʃən',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02CC.mp3',
      },
      {
        speaker: 'J. Wells',
        example: 'ˌfoʊnəˈtɪʃən',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/02CC.mp3',
      },
    ],
  },
  ː: {
    ipaNumber: '503',
    clips: [
      {
        speaker: 'P. Ladefoged',
        example: 'eː',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02D0.mp3',
      },
    ],
  },
  ˑ: {
    ipaNumber: '504',
    clips: [
      {
        speaker: 'P. Ladefoged',
        example: 'eˑ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/02D1.mp3',
      },
    ],
  },
  '̆': {
    ipaNumber: '505',
    clips: [
      {
        speaker: 'P. Ladefoged',
        example: 'ĕ',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0306.mp3',
      },
    ],
  },
  '|': {
    ipaNumber: '507',
    clips: [],
  },
  '‖': {
    ipaNumber: '508',
    clips: [],
  },
  '.': {
    ipaNumber: '506',
    clips: [
      {
        speaker: 'P. Ladefoged',
        example: 'ɹi.ækt',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/002E.mp3',
      },
    ],
  },
  '‿': {
    ipaNumber: '509',
    clips: [],
  },
  '̋': {
    ipaNumber: '512',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['e̋', 'ɑ̋'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/030B.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['e̋', 'ɑ̋'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/030B.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['e̋', 'ɑ̋'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/030B.mp3',
      },
    ],
  },
  '˥': {
    ipaNumber: '519',
    clips: [],
  },
  '̌': {
    ipaNumber: '524',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['ě', 'ɑ̌'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/030C.mp3',
      },
      {
        speaker: 'J. House',
        example: '',
        context: ['ě', 'ɑ̌'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/030C.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['ě', 'ɑ̌'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/030C.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['ě', 'ɑ̌'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/030C.mp3',
      },
    ],
  },
  '˩˥': {
    ipaNumber: '529',
    clips: [],
  },
  '́': {
    ipaNumber: '513',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['é', 'ɑ́'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0301.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['é', 'ɑ́'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0301.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['é', 'ɑ́'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0301.mp3',
      },
    ],
  },
  '˦': {
    ipaNumber: '520',
    clips: [],
  },
  '̂': {
    ipaNumber: '525',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['ê', 'ɑ̂'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0302.mp3',
      },
      {
        speaker: 'J. House',
        example: '',
        context: ['ê', 'ɑ̂'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/0302.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['ê', 'ɑ̂'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0302.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['ê', 'ɑ̂'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0302.mp3',
      },
    ],
  },
  '˥˩': {
    ipaNumber: '530',
    clips: [],
  },
  '̄': {
    ipaNumber: '514',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['ē', 'ɑ̄'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0304.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['ē', 'ɑ̄'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0304.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['ē', 'ɑ̄'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0304.mp3',
      },
    ],
  },
  '˧': {
    ipaNumber: '521',
    clips: [],
  },
  '᷄': {
    ipaNumber: '526',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['e᷄', 'a᷄'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/1DC4.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['e᷄', 'a᷄'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/1DC4.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['e᷄', 'a᷄'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/1DC4.mp3',
      },
    ],
  },
  '˧˥': {
    ipaNumber: '531',
    clips: [],
  },
  '̀': {
    ipaNumber: '515',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['è', 'ɑ̀'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/0300.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['è', 'ɑ̀'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/0300.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['è', 'ɑ̀'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/0300.mp3',
      },
    ],
  },
  '˨': {
    ipaNumber: '522',
    clips: [],
  },
  '᷅': {
    ipaNumber: '527',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['e᷅', 'a᷅'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/1DC5.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['e᷅', 'a᷅'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/1DC5.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['e᷅', 'a᷅'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/1DC5.mp3',
      },
    ],
  },
  '˩˧': {
    ipaNumber: '532',
    clips: [],
  },
  '̏': {
    ipaNumber: '516',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['ȅ', 'ɑ̏'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/030F.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['ȅ', 'ɑ̏'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/030F.mp3',
      },
      {
        speaker: 'J. Wells',
        example: '',
        context: ['ȅ', 'ɑ̏'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/030F.mp3',
      },
    ],
  },
  '˩': {
    ipaNumber: '523',
    clips: [],
  },
  '᷈': {
    ipaNumber: '528',
    clips: [
      {
        speaker: 'J. Esling',
        example: '',
        context: ['e᷈', 'a᷈'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JE/1DC8.mp3',
      },
      {
        speaker: 'J. House',
        example: '',
        context: ['e᷈', 'a᷈'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/1DC8.mp3',
      },
      {
        speaker: 'P. Ladefoged',
        example: '',
        context: ['e᷈', 'a᷈'],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/PL/1DC8.mp3',
      },
    ],
  },
  '˧˦˨': {
    ipaNumber: '533',
    clips: [],
  },
  ꜜ: {
    ipaNumber: '517',
    clips: [
      {
        speaker: 'J. House',
        example:
          'He&#39;s determined to ꜜ&#60;u&#62;take&#60;&#47;u&#62; charge.',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/A71C.mp3',
      },
      {
        speaker: 'J. Wells',
        example:
          'He&#39;s determined to ꜜ&#60;u&#62;take&#60;&#47;u&#62; charge.',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/A71C.mp3',
      },
    ],
  },
  '↗': {
    ipaNumber: '510',
    clips: [
      {
        speaker: 'J. Wells',
        example: '↗What did you say you wanted?',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/2197.mp3',
      },
    ],
  },
  ꜛ: {
    ipaNumber: '518',
    clips: [
      {
        speaker: 'J. House',
        example:
          'He&#39;s determined to ꜛ&#60;u&#62;take&#60;&#47;u&#62; charge.',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/A71B.mp3',
      },
      {
        speaker: 'J. Wells',
        example:
          'He&#39;s determined to ꜛ&#60;u&#62;take&#60;&#47;u&#62; charge.',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JW/A71B.mp3',
      },
    ],
  },
  '↘': {
    ipaNumber: '511',
    clips: [
      {
        speaker: 'J. House',
        example: '↘What did you say you wanted?',
        context: [],
        url: 'https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/JH/2198.mp3',
      },
    ],
  },
};
