import {
  phonationFrame,
  phonationControlFrame,
  phonationPresets,
  phonationContinuum,
  phonationControlKeys,
  samplePhonationContinuum,
} from '../src/engine/phonation';
import { VocalFolds } from '../src/components/vocal-tract/VocalFolds';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { consonants, soundBySymbol } from '../src/data/consonants';
import { chartRows } from '../src/data/chart';
import {
  preset,
  constrain,
  tongueKeys,
  roofY,
  rest,
  surface,
  isPlausible,
  moveJaw,
  underside,
  tongueArea,
  jawPoint,
  lowerLipBaseAnchor,
  lowerLipClosureLimit,
  lowerLipPoint,
  limitLowerLip,
} from '../src/engine/geometry';
import { infer } from '../src/engine/inference';
import { sampleAnimation } from '../src/engine/animation';
import { readFileSync } from 'node:fs';
import { airwayMidpoint, airflowPath, oralAirway } from '../src/engine/airflow';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { VocalTract } from '../src/components/vocal-tract/VocalTract';
import { nonPulmonicConsonants } from '../src/data/non-pulmonic';
import { vowels, apicalVowels, vowelChartPoint } from '../src/data/vowels';
import { vowelPose, mouthGeometry, describeVowel } from '../src/engine/vowels';
import { ipaMarkGroups } from '../src/data/ipa-marks';
import { IPAMarks } from '../src/components/IPAMarks';
import { interpolate } from '../src/engine/geometry';
import { vowelMotionProgress } from '../src/engine/vowel-motion';
import { UnmatchedSoundCard } from '../src/components/UnmatchedSoundCard';
import { IPAToken } from '../src/components/IPAToken';
import { vowelAudio } from '../src/data/vowel-audio';
import {
  onlineAudioUrl,
  resolveAudioUrl,
  variantAudioFor,
} from '../src/engine/audio';
import {
  chineseIPAReference,
  markExplanations,
  referenceForMark,
} from '../src/data/ipa-mark-details';
import { ipaReferenceAudio } from '../src/data/ipa-reference-audio';
import { ipaReferenceLocalAudio } from '../src/data/ipa-reference-local';
import {
  referencePreview,
  referenceFrame,
} from '../src/engine/reference-preview';
import { articulationContact } from '../src/engine/contact';
void test('open central vowels use centralization and keep equivalent notation without relabeling near-open anchors', () => {
  for (const height of [0.94, 1])
    for (const backness of [0.42, 0.5, 0.58]) {
      const result = describeVowel({ height, backness, rounding: 0 });
      assert.equal(result.symbol, 'ä');
      assert.deepEqual(result.alternatives, ['ɑ̈', 'ɐ̞']);
      assert.equal(result.traditional, 'ᴀ');
      assert.equal(result.description, '开央不圆唇元音');
    }
  const rounded = describeVowel({ height: 1, backness: 0.5, rounding: 1 });
  assert.equal(rounded.symbol, 'ɶ̈');
  assert.deepEqual(rounded.alternatives, ['ɒ̈']);
  assert.equal(rounded.traditional, undefined);
  const nearOpen = describeVowel(vowels.find((v) => v.symbol === 'ɐ')!);
  assert.equal(nearOpen.symbol, 'ɐ');
  assert.equal(nearOpen.alternatives.length, 0);
  assert.equal(
    describeVowel({ height: 1, backness: 0.5, rounding: 0.4 }).symbol,
    'ä̹',
  );
});
void test('every reference entry has an explanation and source audio maps diacritics to their correct Unicode identity', () => {
  for (const group of ipaMarkGroups)
    for (const [, name] of group.entries)
      assert.ok(markExplanations[name], name);
  assert.equal(referenceForMark('◌̃').clips.length, 4);
  assert.equal(referenceForMark('◌͡◌ / ◌͜◌').clips.length, 8);
  assert.equal(referenceForMark('◌̈').clips.length, 0);
  assert.equal(referenceForMark('◌̩ / ◌̍').clips.length, 0);
  assert.ok(referenceForMark('◌̥ / ◌̊').clips.some((c) => c.example === 'ŋ̊'));
  for (const r of Object.values(ipaReferenceAudio))
    for (const clip of r.clips) {
      assert.equal(
        new URL(clip.url).hostname,
        'www.internationalphoneticassociation.org',
      );
      assert.ok(clip.speaker);
      assert.ok(!clip.example.includes('<'));
      assert.ok(!clip.example.includes('&#'));
      assert.match(
        ipaReferenceLocalAudio[clip.url] ?? '',
        /^\/audio\/ipa-reference\/.+\.mp3$/,
      );
      assert.ok(
        readFileSync('public' + ipaReferenceLocalAudio[clip.url]!).length > 100,
      );
    }
  const markup = renderToStaticMarkup(createElement(IPAMarks, { query: '' }));
  assert.ok(markup.includes(chineseIPAReference));
  assert.ok(!markup.includes('按所提供'));
  assert.ok(markup.includes('查看说明与示例发音'));
  assert.equal(
    ipaReferenceAudio['ꜜ']?.clips[0]?.example,
    "He's determined to ꜜtake charge.",
  );
  assert.equal(
    ipaReferenceAudio['ꜛ']?.clips[0]?.example,
    "He's determined to ꜛtake charge.",
  );
});
void test('detail previews change the intended feature and stay bounded for supported examples', () => {
  const nasal = referencePreview('ẽ')!;
  assert.equal(nasal.from.velum, 0);
  assert.equal(nasal.to.velum, 1);
  assert.deepEqual(nasal.from.tongue, nasal.to.tongue);
  const moreRounded = referencePreview('ɔ̹')!;
  assert.ok(moreRounded.to.rounding > moreRounded.from.rounding);
  const lower = referencePreview('e̞')!;
  assert.ok(lower.to.jaw > lower.from.jaw);
  for (const example of [
    'n̥',
    'd̥',
    'ŋ̊',
    's̬',
    't̪',
    'tʷ',
    't̺',
    't̻',
    'tʲ',
    'tˠ',
    'tˤ',
    'ɫ',
    'dⁿ',
    'dˡ',
    'e̽',
    'u̟',
    'ɔ̜',
    'ẽ',
  ]) {
    const model = referencePreview(example)!;
    assert.ok(model, example);
    for (const t of [0, 0.25, 0.5, 0.75, 1])
      assert.ok(isPlausible(interpolate(model.from, model.to, t)), example);
    if (model.release) assert.ok(isPlausible(model.release), example);
  }
  assert.equal(referenceFrame(referencePreview('dⁿ')!, 0.7).flow, 'nasal');
  assert.equal(referenceFrame(referencePreview('dˡ')!, 0.7).flow, 'lateral');
  for (const example of ['ˌfoʊnəˈtɪʃən', 'e˩˥'])
    assert.equal(referencePreview(example), null);
});
void test('reference plosives retain closure, pressure and release instead of continuous airflow', () => {
  const model = referencePreview('t̪')!;
  assert.equal(referenceFrame(model, 0.3).flow, 'off');
  assert.ok(referenceFrame(model, 0.6).pressure > 0);
  assert.equal(referenceFrame(model, 0.7).flow, 'burst');
  assert.equal(referenceFrame(model, 1).flow, 'off');
  const markup = renderToStaticMarkup(
    createElement(VocalTract, {
      pose: model.to,
      place: model.place,
      highlightContact: true,
      display: { labels: true, zones: true, points: false, airflow: true },
      flow: 'off',
    }),
  );
  assert.ok(markup.includes('articulation-highlight'));
  assert.ok(!markup.includes('class="air-dashes"'));
  assert.ok(markup.includes('light-dark(#d89888, #a57166)'));
});
void test('free vowels preserve anchors and always label the entire chart and rounding continuum', () => {
  for (const v of [...vowels, ...apicalVowels])
    assert.equal(describeVowel(v).symbol, v.symbol);
  assert.equal(
    describeVowel({ height: 0.04, backness: 0.04, rounding: 0.1 }).symbol,
    'i',
  );
  assert.equal(
    describeVowel({ height: 0.09, backness: 0, rounding: 0 }).symbol,
    'i̞',
  );
  assert.equal(
    describeVowel({ height: 0, backness: 0.13, rounding: 0 }).symbol,
    'i̠',
  );
  assert.equal(
    describeVowel({ height: 0, backness: 0, rounding: 0.3 }).symbol,
    'i̹',
  );
  assert.equal(
    describeVowel({ height: 0, backness: 0, rounding: 0.7 }).symbol,
    'y̜',
  );
  for (let h = 0; h <= 20; h++)
    for (let b = 0; b <= 20; b++)
      for (let r = 0; r <= 10; r++) {
        const result = describeVowel({
          height: h / 20,
          backness: b / 20,
          rounding: r / 10,
        });
        assert.ok(result.symbol.startsWith(result.base.symbol));
        assert.ok(vowels.includes(result.base));
      }
  assert.equal(
    describeVowel({ ...apicalVowels[1]!, rounding: 0.5 }).symbol,
    'ʅ̹',
  );
});
void test('reference chart covers all supplied mark categories and searchable examples', () => {
  assert.equal(
    ipaMarkGroups.slice(0, 4).reduce((n, g) => n + g.entries.length, 0),
    31,
  );
  const markup = renderToStaticMarkup(createElement(IPAMarks, { query: '' }));
  for (const symbol of [
    'ŋ̊',
    't͡s',
    'k͡p',
    'e˥',
    'e˩˥',
    'ꜜ',
    '↘',
    'dⁿ',
    'dˡ',
    'd̚',
  ])
    assert.ok(markup.includes(symbol), symbol);
  const searched = renderToStaticMarkup(
    createElement(IPAMarks, { query: '舌根' }),
  );
  assert.ok(searched.includes('舌根偏前'));
  assert.ok(!searched.includes('主重音'));
});
void test('every standard vowel has a sourced recording and rounded high vowels keep a small aperture', () => {
  for (const v of vowels) {
    const a = vowelAudio[v.symbol];
    assert.ok(a?.source.startsWith('https://commons.wikimedia.org/wiki/File:'));
    assert.ok(a?.license && a?.attribution);
    if (a?.audioUrl.startsWith('/audio/'))
      assert.ok(
        ['OggS', 'RIFF'].includes(
          readFileSync('public' + a.audioUrl)
            .subarray(0, 4)
            .toString(),
        ),
        v.symbol,
      );
  }
  const u = mouthGeometry(1, 0),
    unrounded = mouthGeometry(0, 0),
    openRounded = mouthGeometry(1, 1);
  assert.ok(u.width < unrounded.width * 0.65, 'u has visibly gathered corners');
  assert.ok(
    u.height < 15,
    'rounding does not turn a high vowel into a wide-open mouth',
  );
  assert.ok(
    openRounded.height < openRounded.width,
    'open rounded aperture is not stretched vertically',
  );
  assert.ok(unrounded.width <= 60, 'neutral lips are not maximally stretched');
});
void test('audio URLs stay inside a GitHub Pages project and expose a Commons fallback', () => {
  assert.equal(
    resolveAudioUrl(
      '/audio/vowel-69.ogg',
      'https://jeoitim.github.io/articulatory-phonetics-explorer',
    ),
    'https://jeoitim.github.io/articulatory-phonetics-explorer/audio/vowel-69.ogg',
  );
  assert.equal(
    resolveAudioUrl('/audio/manifest.json', 'http://localhost:3000/'),
    'http://localhost:3000/audio/manifest.json',
  );
  assert.equal(
    resolveAudioUrl(
      '/audio/manifest.json',
      'https://jeoitim.github.io/articulatory-phonetics-explorer/index.html',
    ),
    'https://jeoitim.github.io/articulatory-phonetics-explorer/audio/manifest.json',
  );
  assert.equal(
    onlineAudioUrl(vowelAudio.i!.source),
    'https://commons.wikimedia.org/wiki/Special:FilePath/Close_front_unrounded_vowel.ogg',
  );
  for (const vowel of vowels)
    assert.match(
      onlineAudioUrl(vowelAudio[vowel.symbol]!.source)!,
      /Special:FilePath\/.+\.ogg$/,
    );
  assert.equal(onlineAudioUrl('https://example.com/audio.ogg'), null);
});
void test('unmatched result presents only current configuration, without a candidate symbol or recording', () => {
  const sound = soundBySymbol('l');
  const pose = preset(sound);
  pose.tongue.tip.y += 60;
  const match = infer(pose, sound);
  assert.equal(match.status, 'none');
  const html = renderToStaticMarkup(
    createElement(UnmatchedSoundCard, { match, features: sound }),
  );
  assert.match(html, /暂无对应音标/);
  assert.match(html, /当前主动器官/);
  assert.doesNotMatch(
    html,
    /big-ipa|audio-button|audio-caption|附近候选|录音来源|语言实例/,
  );
  for (const c of match.candidates)
    assert.ok(!html.includes(`[${c.sound.symbol}]`));
});
import { articulatoryVariants } from '../src/engine/variants';
import {
  fricativeContinuum,
  sampleFricativeContinuum,
} from '../src/engine/fricative-continuum';
void test('fricative continuum has distinct articulators and ordered categories without folded tissue', () => {
  let previous = 0;
  for (let n = 0; n <= 300; n++) {
    const pose = sampleFricativeContinuum(n / 100),
      match = infer(pose, soundBySymbol('s'));
    assert.ok(isPlausible(pose));
    const rank = fricativeContinuum.findIndex(
      (s) => s.symbol === match.candidates[0]!.sound.symbol,
    );
    assert.ok(rank >= previous, `${n}: category moved backwards`);
    previous = rank;
  }
  for (const [symbol, place, active] of [
    ['s', 'alveolar', '舌尖'],
    ['ʃ', 'postalveolar', '舌叶'],
    ['ɕ', 'alveolo-palatal', '舌叶后部与舌面前部'],
    ['ç', 'palatal', '舌面前部'],
  ]) {
    const sound = soundBySymbol(symbol!),
      m = infer(preset(sound), sound);
    assert.equal(m.place, place);
    assert.ok(m.contact.active.includes(active!));
  }
  const x = soundBySymbol('ɕ'),
    noPalatalization = preset(x);
  noPalatalization.tongue.front.y = 425;
  assert.equal(
    infer(noPalatalization, x).candidates[0]!.sound.symbol,
    'ʃ',
    'blade contact alone must not imply alveolo-palatal',
  );
});
void test('all exposed active-articulator variants remain valid and carry IPA marks', () => {
  let count = 0;
  for (const sound of consonants)
    for (const variant of articulatoryVariants(sound)) {
      count++;
      assert.ok(isPlausible(variant.pose), sound.symbol);
      const m = infer(variant.pose, sound);
      assert.equal(m.candidates[0]!.sound.symbol, sound.symbol);
      assert.equal(m.status, 'closest');
      assert.equal(m.nonTypical, true, sound.symbol);
    }
  assert.ok(count >= 24);
  const sh = soundBySymbol('ʃ'),
    apical = articulatoryVariants(sh)[0]!.pose;
  assert.equal(infer(apical, sh).place, 'postalveolar');
  assert.match(infer(apical, sh).explanation, /ʃ̺/);
  assert.equal(infer(apical, sh).variantMark, '̺');
  assert.ok(!infer(apical, sh).explanation.includes('*'));
  assert.equal(infer(preset(sh), sh).nonTypical, false);
});
void test('dentalized alveolar constructions keep their manner and display the dental mark', () => {
  for (const symbol of ['t', 'd']) {
    const sound = soundBySymbol(symbol);
    const dental = articulatoryVariants(sound).find((v) => v.mark === '̪');
    assert.ok(dental, symbol);
    const match = infer(dental.pose, sound);
    assert.equal(match.candidates[0]!.sound.symbol, symbol);
    assert.equal(match.place, 'dental');
    assert.equal(match.variantMark, '̪');
    assert.equal(match.nonTypical, true);
    assert.match(match.explanation, new RegExp(`${symbol}̪`));
    const markup = renderToStaticMarkup(
      createElement(IPAToken, { symbol, mark: match.variantMark }),
    );
    assert.ok(markup.includes(`${symbol}̪`));
    assert.ok(!markup.includes('<sup'));
  }
});
void test('linguolabial constructions keep the tongue-to-upper-lip contact in build and detail views', () => {
  for (const symbol of ['t', 'd']) {
    const sound = soundBySymbol(symbol);
    const variant = articulatoryVariants(sound).find((v) => v.mark === '̼');
    assert.ok(variant, symbol);
    const match = infer(variant.pose, sound);
    assert.equal(match.candidates[0]!.sound.symbol, symbol);
    assert.equal(match.variantMark, '̼');
    assert.equal(match.contact.active, '舌尖前端');
    assert.equal(match.contact.passive, '上唇');
    assert.notEqual(match.status, 'none');
    const model = referencePreview(`${symbol}̼`);
    assert.ok(model, symbol);
    assert.equal(
      articulationContact(model.to, model.place, model.sound?.manner).passive,
      '上唇',
    );
    assert.equal(
      articulationContact(
        referenceFrame(model, 0.4).pose,
        model.place,
        model.sound?.manner,
      ).passive,
      '上唇',
    );
    const markup = renderToStaticMarkup(
      createElement(VocalTract, {
        pose: model.to,
        place: model.place,
        highlightContact: true,
        display: { labels: false, zones: true, points: false, airflow: false },
      }),
    );
    assert.ok(markup.includes('舌尖前端接近上唇'));
    assert.ok(markup.includes('M118 422 L115 422'));
  }
});
void test('the existing apex drag reaches dental and upper-lip targets without a virtual landmark', () => {
  const sound = soundBySymbol('t');
  for (const target of [
    { x: 164, y: 418, passive: '上齿' },
    { x: 118, y: 422, passive: '上唇' },
  ]) {
    let pose = preset(sound);
    for (let i = 1; i <= 20; i++)
      pose = constrain(
        pose,
        'tip',
        {
          x: 220 + ((target.x - 220) * i) / 20,
          y: 385 + ((target.y - 385) * i) / 20,
        },
        false,
      );
    assert.equal(pose.tongue.tip.x, target.x);
    assert.equal(pose.tongue.tip.y, target.y);
    assert.ok(isPlausible(pose));
    assert.equal(surface(pose).length, 65);
    assert.equal(infer(pose, sound).contact.passive, target.passive);
  }
});
void test('phonation and aspiration variants are independently constructible', () => {
  for (const [symbol, mark] of [
    ['n', '̥'],
    ['d', '̥'],
    ['t', '̬'],
    ['t', 'ʰ'],
  ] as const) {
    const sound = soundBySymbol(symbol);
    const variant = articulatoryVariants(sound).find((v) => v.mark === mark);
    assert.ok(variant, `${symbol}${mark}`);
    const match = infer(variant.pose, sound);
    assert.equal(match.candidates[0]!.sound.symbol, symbol);
    assert.equal(match.variantMark, mark);
    assert.equal(match.nonTypical, true);
    assert.notEqual(match.status, 'none');
  }
  assert.equal(referencePreview('tʰ')?.to.aspiration, 1);
  assert.equal(referencePreview('n̥')?.to.velum, 1);
});
void test('variant audio is offered only for an exact locally cached example', () => {
  for (const [symbol, mark] of [
    ['n', '̥'],
    ['t', '̪'],
    ['t', '̼'],
    ['d', '̻'],
    ['t', 'ʷ'],
  ] as const) {
    const audio = variantAudioFor(symbol, mark);
    assert.ok(audio, `${symbol}${mark}`);
    assert.match(audio.audioUrl, /^\/audio\/ipa-reference\//);
  }
  assert.equal(variantAudioFor('ɹ', '̥'), undefined);
});
void test('IPA active-articulator marks stay in one text run instead of a drifting superscript', () => {
  const sound = soundBySymbol('ʃ');
  const pose = articulatoryVariants(sound)[0]!.pose;
  const match = infer(pose, sound);
  const markup = renderToStaticMarkup(
    createElement(IPAToken, { symbol: sound.symbol, mark: match.variantMark }),
  );
  assert.match(markup, /class="ipa-token">ʃ̺<\/span>/);
  assert.ok(!markup.includes('<sup'));
});
void test('inventory audit reports combined articulators and all canonical primary places consistently', () => {
  for (const s of consonants) {
    const m = infer(preset(s), s);
    assert.equal(m.place, s.place, s.symbol);
    assert.ok(m.contact.active && m.contact.passive);
    assert.equal(m.nonTypical, false);
    if (s.airstream === 'click') {
      assert.match(m.contact.active, /舌面后部/);
      assert.match(m.contact.passive, /软腭/);
    }
    if (s.variant === 'labial-velar' || s.variant === 'labial-palatal')
      assert.match(m.contact.active, /双唇/);
    if (s.variant === 'dark-l') assert.match(m.contact.active, /舌面后部/);
    if (s.variant === 'epiglottal') assert.match(m.contact.active, /会厌/);
  }
});
void test('vowel selection responds on the first frame and settles without overshoot', () => {
  assert.equal(vowelMotionProgress(0), 0);
  assert.ok(
    vowelMotionProgress(16) > 0.15,
    'visible movement within one frame',
  );
  assert.ok(vowelMotionProgress(100) > 0.7, 'no slow initial wait');
  assert.equal(vowelMotionProgress(280), 1);
  let last = 0;
  for (let elapsed = 0; elapsed < 500; elapsed += 8) {
    const p = vowelMotionProgress(elapsed);
    assert.ok(p >= last && p <= 1);
    last = p;
  }
});
void test('vowel inventory, continuous space and transitions preserve tongue integrity', () => {
  assert.equal(vowels.length, 28);
  assert.equal(new Set(vowels.map((v) => v.symbol)).size, 28);
  assert.deepEqual(
    apicalVowels.map((v) => v.symbol),
    ['ɿ', 'ʅ'],
  );
  for (let h = 0; h <= 10; h++)
    for (let b = 0; b <= 10; b++) {
      const p = vowelPose({ height: h / 10, backness: b / 10, rounding: 0.5 });
      assert.ok(isPlausible(p), `${h} ${b}`);
      for (const q of surface(p))
        if (q.x < 610) assert.ok(q.y >= roofY(q.x) - 0.1);
    }
  const all = [...vowels, ...apicalVowels];
  for (const a of all)
    for (const b of all)
      for (const t of [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1])
        assert.ok(
          isPlausible(interpolate(vowelPose(a), vowelPose(b), t)),
          `${a.symbol} → ${b.symbol} ${t}`,
        );
});
void test('rounding narrows frontal lips independently from vowel height and tongue position', () => {
  for (const [plain, rounded] of [
    ['i', 'y'],
    ['ɯ', 'u'],
    ['ɛ', 'œ'],
  ]) {
    const a = vowels.find((v) => v.symbol === plain)!,
      b = vowels.find((v) => v.symbol === rounded)!;
    assert.deepEqual(vowelPose(a).tongue, vowelPose(b).tongue);
    assert.deepEqual(
      vowelChartPoint(a.height, a.backness),
      vowelChartPoint(b.height, b.backness),
    );
    assert.ok(
      mouthGeometry(b.rounding, b.height).width <
        mouthGeometry(a.rounding, a.height).width,
    );
  }
  assert.ok(mouthGeometry(0, 1).height > mouthGeometry(0, 0).height);
  assert.notDeepEqual(
    vowelPose(vowels[0]!).tongue,
    vowelPose(apicalVowels[0]!).tongue,
  );
});
void test('all consonant and vowel recordings are local and keep matching attribution', () => {
  const manifest = JSON.parse(
    readFileSync('public/audio/manifest.json', 'utf8'),
  ) as Record<
    string,
    { audioUrl: string; source: string; license: string; attribution: string }
  >;
  assert.equal(Object.keys(manifest).length, consonants.length + vowels.length);
  assert.deepEqual(
    manifest,
    JSON.parse(readFileSync('public/attribution/audio.json', 'utf8')),
  );
  for (const v of vowels)
    assert.deepEqual(vowelAudio[v.symbol], manifest[v.symbol]);
  for (const s of [...consonants, ...vowels]) {
    const a = manifest[s.symbol];
    assert.ok(a?.source.startsWith('https://commons.wikimedia.org/'), s.symbol);
    assert.ok(a.license && a.attribution, s.symbol);
    assert.ok(
      a.audioUrl.startsWith('/audio/'),
      s.symbol + ' must use a cached recording',
    );
    assert.ok(
      ['OggS', 'RIFF'].includes(
        readFileSync('public' + a.audioUrl)
          .subarray(0, 4)
          .toString(),
      ),
      s.symbol,
    );
  }
});
void test('dorsum exercise can reach a velar closure without requiring an exact preset copy', () => {
  const t = soundBySymbol('t');
  let p = preset(t);
  for (let i = 0; i < 8; i++)
    p = constrain(p, 'dorsum', { x: 552, y: 374 }, true);
  const m = infer(p, t);
  assert.equal(m.candidates[0]?.sound.symbol, 'k');
  assert.notEqual(m.status, 'none');
  assert.ok(m.gap < 2);
});
void test('every official pulmonic chart symbol and common extension has a unique model', () => {
  const symbols = chartRows
    .flatMap((r) => r.cells.flatMap((c) => c.split(' ')))
    .filter((c) => c !== '#' && c !== '-');
  assert.equal(symbols.length, 59);
  assert.equal(
    consonants.filter((s) => s.airstream === 'pulmonic-egressive').length,
    78,
  );
  assert.equal(consonants.length, 92);
  assert.equal(new Set(consonants.map((s) => s.symbol)).size, 92);
  for (const symbol of symbols)
    assert.ok(
      consonants.some((s) => s.symbol === symbol),
      symbol,
    );
});
void test('whole-configuration inference distinguishes all 92 presets', () => {
  for (const s of consonants) {
    const m = infer(preset(s), s);
    assert.equal(m.candidates[0]?.sound.symbol, s.symbol, s.symbol);
    assert.notEqual(m.status, 'none', s.symbol);
  }
});
void test('voicing and nasal gate are independent from tongue position', () => {
  const t = soundBySymbol('t'),
    p = preset(t);
  assert.equal(
    infer(p, { ...t, voiced: true }).candidates[0]?.sound.symbol,
    'd',
  );
  const n = { ...t, voiced: true, manner: 'nasal' as const };
  assert.equal(infer(p, n).status, 'none');
  assert.equal(
    infer({ ...p, velum: 1 }, { ...n, velum: 'lowered' }).candidates[0]?.sound
      .symbol,
    'n',
  );
});
void test('lip contact target and rounding distinguish bilabial, labiodental and labiovelar gestures', () => {
  const p = preset(soundBySymbol('p'));
  assert.equal(
    infer({ ...p, lowerLip: 0.78 }, soundBySymbol('ɸ')).candidates[0]?.sound
      .symbol,
    'ɸ',
  );
  assert.equal(
    infer(preset(soundBySymbol('f')), soundBySymbol('f')).place,
    'labiodental',
  );
  const w = preset(soundBySymbol('w'));
  assert.equal(
    infer({ ...w, rounding: 0 }, soundBySymbol('w')).candidates[0]?.sound
      .symbol,
    'ɰ',
  );
});
void test('voiceless bilabial fricative remains reachable from h and near closure', () => {
  const target = soundBySymbol('ɸ');
  const openJaw = preset(soundBySymbol('h'));
  for (const lowerLip of [0.48, 0.52, 0.55]) {
    const match = infer({ ...openJaw, lowerLip }, target);
    assert.equal(match.candidates[0]?.sound.symbol, 'ɸ');
    assert.equal(match.place, 'bilabial');
    assert.notEqual(match.status, 'none');
  }
  const nearClosed = infer({ ...preset(target), lowerLip: 0.99 }, target);
  assert.equal(nearClosed.candidates[0]?.sound.symbol, 'ɸ');
  assert.equal(nearClosed.place, 'bilabial');
  assert.notEqual(nearClosed.status, 'none');
  assert.equal(
    infer({ ...preset(target), lowerLip: 1 }, target).status,
    'none',
  );
});
void test('lower lip stays attached to the jaw and caps stretch as the jaw opens', () => {
  const f = preset(soundBySymbol('f'));
  assert.equal(lowerLipClosureLimit(f), 1);
  assert.equal(infer(f, soundBySymbol('f')).place, 'labiodental');

  const open = limitLowerLip({ ...f, jaw: 1 });
  assert.ok(open.lowerLip < f.lowerLip);
  const base = jawPoint(lowerLipBaseAnchor, open.jaw);
  const lip = lowerLipPoint(open);
  assert.ok(
    Math.hypot(lip.x - base.x, lip.y - base.y) < 160,
    'open jaw must not stretch the lip into a long strip',
  );
});
void test('closed fricatives, open stops, and incomplete airstream mechanisms never yield exact matches', () => {
  const s = soundBySymbol('s'),
    t = soundBySymbol('t');
  assert.equal(infer(preset(t), s).status, 'none');
  assert.equal(infer(rest, t).status, 'none');
  assert.equal(infer(preset(t), { ...t, airstream: 'click' }).status, 'none');
  assert.notEqual(
    infer(preset(soundBySymbol('h')), soundBySymbol('h')).status,
    'canonical',
  );
});
void test('all canonical and intermediate animation outlines remain non-self-intersecting', () => {
  for (const s of consonants) {
    assert.ok(isPlausible(preset(s)), s.symbol);
    for (let i = 0; i <= 40; i++)
      assert.ok(
        isPlausible(sampleAnimation(s, i / 40).pose),
        s.symbol + ' at ' + i,
      );
  }
});
void test('extreme drags maintain a valid surface, palate exclusion, and finite coordinates', () => {
  let p = structuredClone(rest);
  for (let i = 0; i < 120; i++) {
    const key = tongueKeys[i % 5]!;
    p = constrain(
      p,
      key,
      { x: (i % 2 ? 1 : -1) * 10000, y: (i % 3 ? 1 : -1) * 10000 },
      false,
    );
    assert.ok(isPlausible(p), 'drag ' + i);
    for (const q of surface(p).slice(0, 48)) {
      assert.ok(Number.isFinite(q.x) && Number.isFinite(q.y));
      assert.ok(q.y >= roofY(q.x) - 0.001);
    }
  }
});
void test('moving one point distributes movement to adjacent tissue; jaw moves tongue too', () => {
  const p = constrain(rest, 'front', { x: 370, y: 465 }, false);
  assert.notDeepEqual(p.tongue.blade, rest.tongue.blade);
  assert.notDeepEqual(p.tongue.dorsum, rest.tongue.dorsum);
  const j = moveJaw(rest, 0.6);
  assert.notDeepEqual(j.tongue.front, rest.tongue.front);
  assert.ok(isPlausible(j));
});
void test('closure blocks flow, pressure precedes burst, affricates release into friction', () => {
  const t = soundBySymbol('t');
  assert.equal(sampleAnimation(t, 0.5).flow, 'off');
  assert.ok(sampleAnimation(t, 0.62).pressure > 0.9);
  assert.equal(sampleAnimation(t, 0.67).flow, 'burst');
  assert.equal(sampleAnimation(soundBySymbol('t͡s'), 0.6).flow, 'turbulent');
  const ys = [0.4, 0.5, 0.6].map(
    (t) => sampleAnimation(soundBySymbol('ɾ'), t).pose.tongue.tip.y,
  );
  assert.ok(ys[1]! < ys[0]! && ys[1]! < ys[2]!);
});

void test('manual apex drag can construct retroflex fricative and stop with coupled blade', () => {
  for (const symbol of ['ʂ', 'ʈ']) {
    let p = structuredClone(rest);
    const y = symbol === 'ʂ' ? 355 : 342;
    for (let i = 1; i <= 45; i++) {
      p = constrain(
        p,
        'tip',
        { x: 165 + (131 * i) / 45, y: 535 + ((y - 535) * i) / 45 },
        false,
      );
      assert.ok(isPlausible(p));
    }
    const m = infer(p, soundBySymbol(symbol));
    assert.equal(m.candidates[0]?.sound.symbol, symbol);
    assert.notEqual(m.status, 'none');
    assert.ok(p.tongue.tip.x > p.tongue.blade.x);
    assert.match(m.contact.passive, /龈后/);
  }
});
void test('active and passive articulators are both reported, rather than hiding apex/blade distinctions', () => {
  const s = soundBySymbol('ʃ'),
    p = preset(s);
  assert.match(infer(p, s).contact.active, /舌叶/);
  const apical = {
    ...p,
    retroflex: 0,
    tongue: { ...p.tongue, tip: { x: 270, y: 360 }, blade: { x: 322, y: 430 } },
  };
  const m = infer(apical, s);
  assert.match(m.contact.active, /舌尖/);
  assert.equal(m.contact.passive, '龈后');
  assert.notEqual(m.status, 'canonical');
  assert.ok(m.contact.note);
});

void test('raised apex and blade preserve a broad belly below the free tongue', () => {
  const poses = [
    constrain(rest, 'tip', { x: 230, y: 490 }, false),
    constrain(rest, 'blade', { x: 310, y: 350 }, false),
    preset(soundBySymbol('ʈ')),
    preset(soundBySymbol('k')),
  ];
  for (const p of poses) {
    const contour = [...surface(p), ...underside(p)];
    const y = jawPoint({ x: 235, y: 738 }, p.jaw).y + 25;
    const crossings: number[] = [];
    contour.forEach((a, i) => {
      const b = contour[(i + 1) % contour.length]!;
      if ((a.y <= y && b.y > y) || (b.y <= y && a.y > y))
        crossings.push(a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y));
    });
    assert.equal(crossings.length, 2, 'one continuous body at the attachment');
    assert.ok(
      Math.max(...crossings) - Math.min(...crossings) > 230,
      'no pinched waist',
    );
  }
});

void test('body folding and invalid pointer coordinates cannot corrupt the tongue', () => {
  const folded = structuredClone(rest);
  folded.tongue.front = { x: 430, y: 390 };
  folded.tongue.dorsum = { x: 410, y: 600 };
  assert.equal(isPlausible(folded), false);
  assert.deepEqual(constrain(rest, 'tip', { x: NaN, y: 400 }, false), rest);
  assert.deepEqual(
    constrain(rest, 'root', { x: 600, y: Infinity }, false),
    rest,
  );
});

void test('long mixed drag sequences retain body thickness and bounded tissue strain', () => {
  let seed = 9137;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  for (const symbol of ['t', 'k', 'ʈ', 'ɕ', 'ħ']) {
    let p = preset(soundBySymbol(symbol));
    for (let i = 0; i < 160; i++) {
      p = constrain(
        p,
        tongueKeys[i % 5]!,
        { x: 100 + random() * 650, y: 300 + random() * 550 },
        i % 2 === 0,
      );
      assert.ok(isPlausible(p), symbol + ' drag ' + i);
      const area = tongueArea(p) / tongueArea(rest);
      assert.ok(area >= 0.82 && area <= 1.66);
      const { front, root } = p.tongue;
      assert.ok(Math.hypot(front.x - root.x, front.y - root.y) >= 259);
    }
  }
});

void test('airflow occupies open lumen and narrows with the articulatory gap', () => {
  const open = oralAirway(rest);
  const tongue = surface(rest).reverse();
  assert.ok(
    open.every(
      (q) =>
        Math.min(...tongue.map((t) => Math.hypot(q.x - t.x, q.y - t.y))) > 30,
    ),
  );
  for (const x of [220, 410, 552]) {
    const y = roofY(x);
    const closed = airwayMidpoint({ x, y });
    assert.ok(Math.hypot(closed.x - x, closed.y - y) < 0.01);
    const narrow = airwayMidpoint({ x, y: y + 10 });
    assert.ok(narrow.y > y && narrow.y < y + 10);
  }
  for (const s of consonants) {
    const pose = preset(s);
    const path = airflowPath(pose, { x: 110, y: 500 });
    assert.doesNotMatch(path, /NaN|Infinity/);
    const contour = [...surface(pose), ...underside(pose)];
    const channel = oralAirway(pose);
    channel.forEach((a, i) => {
      const b = channel[i + 1];
      if (!b) return;
      for (let step = 1; step < 5; step++) {
        const x = a.x + ((b.x - a.x) * step) / 5;
        const y = a.y + ((b.y - a.y) * step) / 5 - 0.01;
        let inside = false;
        contour.forEach((c, j) => {
          const d = contour[(j + 1) % contour.length]!;
          if (
            c.y > y !== d.y > y &&
            x < ((d.x - c.x) * (y - c.y)) / (d.y - c.y) + c.x
          )
            inside = !inside;
        });
        assert.equal(
          inside,
          false,
          s.symbol + ' airflow must remain outside tongue tissue',
        );
      }
    });
  }
  assert.notEqual(
    airflowPath(rest, { x: 110, y: 500 }),
    airflowPath({ ...rest, velum: 1 }, { x: 110, y: 500 }),
  );
});

void test('diagram starts without an unrelated tooltip and includes separate cavity hit regions', () => {
  const markup = renderToStaticMarkup(
    createElement(VocalTract, {
      pose: rest,
      place: 'alveolar',
      display: { labels: true, zones: true, points: true, airflow: true },
    }),
  );
  assert.doesNotMatch(markup, /class="tract-label"/);
  for (const cavity of [
    '口腔 · Oral cavity',
    '鼻腔 · Nasal cavity',
    '咽腔 · Pharyngeal cavity',
  ])
    assert.ok(markup.includes(`data-anatomy-label="${cavity}"`));
});

void test('palatal and velar crowns spread elevation over a broad tongue surface', () => {
  for (const symbol of ['ç', 'c', 'ɡ', 'k']) {
    const p = preset(soundBySymbol(symbol));
    const points = surface(p);
    const level =
      (symbol === 'ç' || symbol === 'c'
        ? p.tongue.front.y
        : p.tongue.dorsum.y) + 30;
    const crossings: number[] = [];
    points.forEach((a, i) => {
      const b = points[i + 1];
      if (b && a.y > level !== b.y > level)
        crossings.push(a.x + ((b.x - a.x) * (level - a.y)) / (b.y - a.y));
    });
    assert.equal(crossings.length, 2, symbol);
    assert.ok(
      Math.max(...crossings) - Math.min(...crossings) > 100,
      symbol + ' broad crown',
    );
  }
});

void test('laminal families keep supported crowns and their intended constrictions', () => {
  for (const sound of consonants) {
    const base = preset(sound);
    const poses = [
      ...(sound.place === 'postalveolar' && sound.variant !== 'sje' &&
        sound.airstream === 'pulmonic-egressive' ? [base] : []),
      ...articulatoryVariants(sound)
        .filter((v) => v.mark === '̻' ||
          (sound.place === 'postalveolar' && v.mark !== '̺'))
        .map((v) => v.pose),
    ];
    for (const pose of poses) {
      const { tip, blade } = pose.tongue;
      assert.ok(blade.x > tip.x, sound.symbol + ' anterior apex');
      assert.ok((tip.y - blade.y) / (blade.x - tip.x) < 1.2,
        sound.symbol + ' no steep folded blade');
      assert.ok(isPlausible(pose), sound.symbol);
      const points = surface(pose).slice(16, 33);
      assert.ok(points.filter((q) => q.y <= blade.y + 30).length >= 8,
        sound.symbol + ' supported blade crown');
      assert.equal(infer(pose, sound).candidates[0]!.sound.symbol, sound.symbol);
    }
  }
});

void test('posterior gestures redistribute tissue and jaw motion preserves dorsal closure', () => {
  for (const symbol of ['k', 'ɡ', 'ŋ', 'x', 'ɣ', 'q', 'ɢ', 'ʁ', 'ħ', 'ʕ']) {
    const sound = soundBySymbol(symbol), pose = preset(sound);
    // Sagittal area is not 3D volume: a 1.4 cap previously encouraged an
    // artificially depressed foretongue. Check shape and contact instead.
    assert.ok(tongueArea(pose) / tongueArea(rest) < 1.66, symbol + ' bounded expansion');
    if (sound.place === 'velar' || sound.place === 'uvular') {
      assert.ok(pose.tongue.tip.x > 240 && pose.tongue.blade.x > 300,
        symbol + ' relaxed anterior tongue is drawn back');
      assert.ok(pose.tongue.tip.x < pose.tongue.blade.x && pose.retroflex === 0,
        symbol + ' retraction is not retroflexion');
      assert.ok(pose.tongue.blade.y - pose.tongue.dorsum.y < 120,
        symbol + ' foretongue not forced down');
      assert.ok(pose.tongue.front.y - pose.tongue.dorsum.y < 45,
        symbol + ' broad elevated body');
    }
    assert.ok(isPlausible(pose), symbol);
    assert.equal(infer(pose, sound).candidates[0]!.sound.symbol, symbol);
  }
  const k = preset(soundBySymbol('k'));
  const moved = moveJaw(k, k.jaw + 0.1);
  assert.ok(moved.jaw > k.jaw);
  assert.ok(Math.hypot(moved.tongue.tip.x - k.tongue.tip.x,
    moved.tongue.tip.y - k.tongue.tip.y) > 1, 'free apex follows jaw');
  assert.deepEqual(moved.tongue.dorsum, k.tongue.dorsum, 'dorsal closure stays on palate');
  assert.ok(isPlausible(moved));
  assert.deepEqual(moveJaw(k, NaN), k);
});

void test('retracted root has a broad descending wall instead of a pointed spur', () => {
  for (const symbol of ['ħ', 'ʕ']) {
    const pose = preset(soundBySymbol(symbol));
    const upper = surface(pose), lower = underside(pose);
    const root = pose.tongue.root;
    const before = upper[upper.length - 2]!, after = lower[0]!;
    assert.ok(before.y < root.y && after.y > root.y, 'continuous descent');
    assert.ok(Math.abs(after.x - root.x) < (after.y - root.y) * 0.25,
      'root continues downward, not diagonally back to attachment');
    const wall = lower.filter((q) => q.x > root.x - 25 && q.y > root.y);
    assert.ok(Math.max(...wall.map((q) => q.y)) - root.y > 60,
      'posterior narrowing extends over tissue, not one vertex');
  }
});

void test('posterior tongue forms a shoulder and returns smoothly toward its attachment', () => {
  for (const symbol of ['ɡ', 'k', 'q', 'ʁ']) {
    const p = preset(soundBySymbol(symbol));
    const points = surface(p),
      a = p.tongue.dorsum,
      b = p.tongue.root;
    const mid = points[56]!;
    const bow =
      Math.abs((b.x - a.x) * (mid.y - a.y) - (b.y - a.y) * (mid.x - a.x)) /
      Math.hypot(b.x - a.x, b.y - a.y);
    assert.ok(bow > 20, symbol + ' curved posterior shoulder');
    const before = points[63]!,
      after = underside(p)[0]!;
    const ux = b.x - before.x,
      uy = b.y - before.y;
    const vx = after.x - b.x,
      vy = after.y - b.y;
    assert.ok(
      (ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy)) > 0.95,
      symbol + ' smooth root attachment',
    );
  }
});

void test('official non-pulmonic inventory and mechanism-specific release directions are complete', () => {
  assert.deepEqual(
    nonPulmonicConsonants.map((s) => s.symbol),
    ['ʘ', 'ǀ', 'ǃ', 'ǂ', 'ǁ', 'ɓ', 'ɗ', 'ʄ', 'ɠ', 'ʛ', 'pʼ', 'tʼ', 'kʼ', 'sʼ'],
  );
  for (const s of nonPulmonicConsonants) {
    const held = sampleAnimation(s, 0.5),
      released = sampleAnimation(s, 0.7);
    assert.equal(held.flow, 'off', s.symbol);
    assert.notEqual(released.flow, 'off', s.symbol);
    const path = airflowPath(released.pose, { x: 100, y: 500 }, s.airstream);
    const numbers = path.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
    const startX = numbers[0]!,
      endX = numbers[numbers.length - 2]!;
    if (s.airstream === 'ejective') {
      assert.ok(startX > endX);
      assert.equal(held.pose.glottis, 0);
      assert.ok(held.pose.larynx < 0);
    } else {
      assert.ok(startX < endX);
      if (s.airstream === 'click') {
        assert.deepEqual(released.pose.tongue.dorsum, held.pose.tongue.dorsum);
        assert.ok(
          Math.max(...numbers.filter((_, i) => i % 2 === 1)) < 600,
          'click influx stays in mouth',
        );
      } else assert.ok(held.pose.larynx > 0);
    }
    assert.equal(sampleAnimation(s, 1).flow, 'off');
    assert.deepEqual(sampleAnimation(s, 1).pose, rest);
  }
});

void test('new mechanism motion has no discontinuity at closure or release', () => {
  for (const s of nonPulmonicConsonants)
    for (const t of [0.25, 0.58, 0.82]) {
      const a = sampleAnimation(s, t - 0.00001).pose;
      const b = sampleAnimation(s, t + 0.00001).pose;
      for (const key of tongueKeys)
        assert.ok(
          Math.hypot(
            a.tongue[key].x - b.tongue[key].x,
            a.tongue[key].y - b.tongue[key].y,
          ) < 0.1,
          s.symbol + ' ' + t,
        );
    }
});

void test('phonation previews support vowels and voiced labial sequences without changing oral geometry', () => {
  for (const mark of ['̤', '̰']) {
    for (const example of [`a${mark}`, `b${mark}`, `b${mark}a${mark}`]) {
      const model = referencePreview(example)!;
      assert.ok(model, example);
      assert.equal(model.phonation, mark === '̤' ? 'breathy' : 'creaky');
      assert.ok(isPlausible(model.from));
      assert.ok(isPlausible(model.to));
    }
  }
  assert.deepEqual(
    referencePreview('a̤')!.to.tongue,
    referencePreview('a̰')!.to.tongue,
  );
  assert.equal(referencePreview('a̤˥'), null);
});

void test('breathy cycles never seal, creaky cycles close longer and tension is independent', () => {
  const phases = Array.from({ length: 100 }, (_, i) => i / 100);
  assert.ok(
    phases.every(
      (t) =>
        phonationFrame('breathy', t).gap > 0 &&
        phonationFrame('breathy', t).posteriorGap > 0,
    ),
  );
  const closures = (mode: 'modal' | 'creaky') =>
    phases.filter((t) => phonationFrame(mode, t).gap === 0).length;
  assert.ok(closures('creaky') > closures('modal'));
  assert.equal(phonationFrame('creaky', 0.4).gap, 0);
  assert.ok(
    phonationFrame('creaky', 0.63).gap > phonationFrame('creaky', 0.16).gap,
  );
  assert.ok(
    phonationFrame('modal', 0.25, 1).length >
      phonationFrame('modal', 0.25, 0).length,
  );
  assert.ok(
    phonationFrame('modal', 0.25, 1).thickness <
      phonationFrame('modal', 0.25, 0).thickness,
  );
});
void test('epilaryngeal narrowing keeps one epiglottis and a persistent attached posterior region', () => {
  for (const epiglottis of [0, 0.05, 0.1, 0.5, 1]) {
    const html = renderToStaticMarkup(
      createElement(VocalTract, {
        pose: { ...rest, epiglottis },
        place: 'pharyngeal',
        display: { labels: true, points: false, zones: false, airflow: false },
      }),
    );
    assert.equal(
      (html.match(/data-anatomy-label="会厌 · Epiglottis"/g) ?? []).length,
      1,
    );
    assert.equal((html.match(/data-anatomy-label="杓会厌区/g) ?? []).length, 1);
    assert.ok(!html.includes('M 622 837'));
  }
});

void test('phonation continuum is continuous through all landmarks and does not equate adduction with longitudinal tension', () => {
  phonationContinuum.forEach((mode, i) => {
    assert.deepEqual(
      samplePhonationContinuum(i),
      phonationPresets[mode].controls,
    );
    if (i > 0 && i < 4) {
      const left = samplePhonationContinuum(i - 1e-6);
      const right = samplePhonationContinuum(i + 1e-6);
      for (const k of phonationControlKeys)
        assert.ok(Math.abs(left[k] - right[k]) < 1e-5, k);
      for (const phase of [0.16, 0.25, 0.4, 0.63, 0.9]) {
        const a = phonationControlFrame(left, phase),
          b = phonationControlFrame(right, phase);
        assert.ok(Math.abs(a.gap - b.gap) < 0.001);
        assert.ok(Math.abs(a.posteriorGap - b.posteriorGap) < 0.001);
      }
    }
  });
  assert.ok(
    samplePhonationContinuum(4).adduction >
      samplePhonationContinuum(2).adduction,
  );
  assert.ok(
    samplePhonationContinuum(4).tension < samplePhonationContinuum(2).tension,
  );
  assert.deepEqual(
    samplePhonationContinuum(NaN),
    phonationPresets.modal.controls,
  );
});
void test('whisper, breath, closure and composite phonation preserve independent posterior and vibratory behavior', () => {
  for (const mode of ['silent', 'voiceless', 'whisper', 'closure'] as const) {
    const frames = [0, 0.16, 0.25, 0.4, 0.63, 0.9].map((t) =>
      phonationFrame(mode, t),
    );
    assert.ok(
      frames.every((f) => f.vibration === 0),
      mode,
    );
    assert.ok(
      frames.every((f) => f.gap === frames[0]!.gap),
      mode,
    );
  }
  assert.equal(phonationFrame('silent', 0.25).turbulence, 0);
  assert.ok(phonationFrame('whisper', 0.25).turbulence > 0);
  assert.equal(phonationFrame('whisper', 0.25).gap, 0);
  assert.ok(phonationFrame('whisper', 0.25).posteriorGap > 0);
  assert.equal(phonationFrame('closure', 0.25).gap, 0);
  assert.equal(phonationFrame('closure', 0.25).posteriorGap, 0);
  assert.equal(phonationFrame('closure', 0.25).turbulence, 0);
  for (const mode of [
    'whispery',
    'whispery-creaky',
    'whispery-falsetto',
    'whispery-creaky-falsetto',
  ] as const) {
    assert.ok(phonationFrame(mode, 0.25).vibration > 0);
    assert.ok(phonationFrame(mode, 0.25).posteriorGap > 0);
  }
  const base = phonationPresets.modal.controls;
  const highTension = phonationControlFrame({ ...base, tension: 1 }, 0.25);
  assert.equal(highTension.posteriorGap, 0);
  assert.ok(highTension.length > phonationControlFrame(base, 0.25).length);
});
void test('all phonation presets and extreme controls render bounded geometry', () => {
  for (const preset of Object.values(phonationPresets)) {
    for (const t of [0, 0.16, 0.25, 0.4, 0.63, 1]) {
      const frame = phonationControlFrame(preset.controls, t);
      assert.ok(Object.values(frame).every(Number.isFinite));
      assert.ok(frame.gap >= 0 && frame.gap < 60);
      assert.ok(frame.posteriorGap >= 0 && frame.posteriorGap <= 24);
    }
    const html = renderToStaticMarkup(
      createElement(VocalFolds, {
        controls: preset.controls,
        animated: false,
        detailed: true,
      }),
    );
    assert.ok(!/NaN|Infinity/.test(html));
    assert.ok(html.includes('软骨声门'));
  }
  for (let mask = 0; mask < 64; mask++) {
    const p = { ...phonationPresets.modal.controls };
    phonationControlKeys.forEach((k, i) => {
      p[k] = (mask >> i) & 1;
    });
    assert.ok(
      Object.values(phonationControlFrame(p, 0.25)).every(Number.isFinite),
    );
  }
});

void test('tongue body reaches velum and uvula from coronal postures with coordinated retraction', () => {
  const sh = preset(soundBySymbol('ʃ'));
  const velarTarget = { x: 552, y: 374 };
  const toVelar = constrain(sh, 'dorsum', velarTarget, false);
  assert.equal(Math.round(toVelar.tongue.dorsum.x), velarTarget.x);
  assert.equal(Math.round(toVelar.tongue.dorsum.y), velarTarget.y);
  assert.ok(toVelar.tongue.tip.x > 220, 'tip retracts with dorsal pull');
  assert.ok(toVelar.tongue.blade.x > 290, 'blade retracts with dorsal pull');
  assert.ok(isPlausible(toVelar));

  const uvularTarget = { x: 608, y: 438 };
  const toUvular = constrain(sh, 'dorsum', uvularTarget, false);
  assert.equal(Math.round(toUvular.tongue.dorsum.x), uvularTarget.x);
  assert.equal(Math.round(toUvular.tongue.dorsum.y), uvularTarget.y);
  assert.ok(isPlausible(toUvular));

  const fromRest = constrain(rest, 'dorsum', velarTarget, false);
  assert.equal(Math.round(fromRest.tongue.dorsum.x), velarTarget.x);
  assert.equal(Math.round(fromRest.tongue.dorsum.y), velarTarget.y);
  assert.ok(fromRest.tongue.tip.x > 210, 'rest foretongue retracts posteriorly');
  assert.ok(fromRest.tongue.blade.x > 290, 'rest blade retracts posteriorly');
  assert.ok(isPlausible(fromRest));
});

void test('anterior articulators advance without deadlocking against a retracted dorsum', () => {
  const k = preset(soundBySymbol('k'));
  const alveolarTarget = { x: 220, y: 385 };

  const bladeToAlveolar = constrain(k, 'blade', alveolarTarget, false);
  assert.equal(Math.round(bladeToAlveolar.tongue.blade.x), alveolarTarget.x);
  assert.equal(Math.round(bladeToAlveolar.tongue.blade.y), alveolarTarget.y);
  assert.ok(
    bladeToAlveolar.tongue.dorsum.x < 500,
    'dorsum advances forward when anterior blade is dragged forward',
  );
  assert.ok(isPlausible(bladeToAlveolar));

  const tipToAlveolar = constrain(k, 'tip', alveolarTarget, false);
  assert.equal(Math.round(tipToAlveolar.tongue.tip.x), alveolarTarget.x);
  assert.equal(Math.round(tipToAlveolar.tongue.tip.y), alveolarTarget.y);
  assert.ok(isPlausible(tipToAlveolar));

  const dentalTarget = { x: 164, y: 418 };
  const tipToDental = constrain(k, 'tip', dentalTarget, false);
  assert.equal(Math.round(tipToDental.tongue.tip.x), dentalTarget.x);
  assert.equal(Math.round(tipToDental.tongue.tip.y), dentalTarget.y);
  assert.ok(isPlausible(tipToDental));
});

void test('laminal postures decouple lower tip adjustments from blade constriction', () => {
  const sh = preset(soundBySymbol('ʃ'));
  assert.equal(infer(sh, soundBySymbol('ʃ')).contact.key, 'blade');

  for (const targetY of [420, 450, 480, 505]) {
    const loweredTip = constrain(sh, 'tip', { x: 195, y: targetY }, false);
    assert.equal(Math.round(loweredTip.tongue.tip.y), targetY);
    assert.ok(
      loweredTip.tongue.blade.y <= 365,
      `blade remains elevated when tip is at ${targetY}`,
    );
    assert.ok(isPlausible(loweredTip));
    const match = infer(loweredTip, soundBySymbol('ʃ'));
    assert.equal(match.contact.key, 'blade', 'contact articulator remains blade');
    assert.match(match.contact.active, /舌叶/);
  }
});
void test('pharyngeal consonants retract foretongue posteriorly with plausible area', () => {
  for (const sym of ['ħ', 'ʕ', 'ʜ', 'ʢ', 'ʡ']) {
    const s = soundBySymbol(sym);
    const p = preset(s);
    assert.ok(isPlausible(p), `preset for ${sym} is plausible`);
    assert.ok(p.tongue.tip.x >= 240, `tip for ${sym} is retracted posteriorly (x >= 240)`);
    assert.ok(p.tongue.blade.x >= 320, `blade for ${sym} is retracted posteriorly (x >= 320)`);
    assert.ok(p.tongue.front.x >= 420, `front for ${sym} is retracted posteriorly (x >= 420)`);
    const match = infer(p, s);
    assert.equal(match.place, s.place, `infer recognizes ${sym} place`);
  }
});

void test('click consonants conform to literature geometry without cliff deformation or area violation', () => {
  for (const sym of ['ʘ', 'ǀ', 'ǃ', 'ǂ', 'ǁ']) {
    const s = soundBySymbol(sym);
    const p = preset(s);
    assert.ok(isPlausible(p), `click ${sym} is plausible`);
    const match = infer(p, s);
    assert.equal(match.place, s.place, `click ${sym} matches place`);
    assert.equal(match.nonTypical, false, `click ${sym} is not nonTypical`);
    // Velar posterior closure present
    assert.match(match.contact.active, /舌面后部/);
    assert.match(match.contact.passive, /软腭/);

    // Front pocket should be a shallow cavity (y <= 465), not a deep cliff deformation (480+)
    assert.ok(p.tongue.front.y <= 465, `click ${sym} front.y is not an extreme cliff`);
    assert.ok(p.tongue.front.y >= 440, `click ${sym} front.y has sufficient rarefaction pocket`);
  }

  // Palatoalveolar click ǂ specific laminal anterior closure
  const palatoalveolarClick = preset(soundBySymbol('ǂ'));
  assert.equal(palatoalveolarClick.tongue.blade.y, 347);
  assert.equal(palatoalveolarClick.tongue.dorsum.y, 374);
  assert.ok(isPlausible(palatoalveolarClick));

  // Dragging blade maintains plausible geometry and valid area without destroying posterior velar closure
  const draggedBlade = constrain(palatoalveolarClick, 'blade', { x: 260, y: 347 }, false);
  assert.ok(isPlausible(draggedBlade));
  assert.ok(draggedBlade.tongue.dorsum.y <= 376, 'dorsum velar closure remains near roof on blade drag');

  // Dragging dorsum maintains anterior postalveolar closure
  const draggedDorsum = constrain(palatoalveolarClick, 'dorsum', { x: 550, y: 374 }, false);
  assert.ok(isPlausible(draggedDorsum));
  assert.ok(draggedDorsum.tongue.blade.y <= 350, 'blade anterior closure remains near roof on dorsum drag');

  // Dragging front downward carves cavity without pulling down blade or dorsum closures
  const draggedFront = constrain(palatoalveolarClick, 'front', { x: 390, y: 460 }, false);
  assert.ok(isPlausible(draggedFront));
  assert.ok(draggedFront.tongue.blade.y <= 350, 'blade remains closed when carving cavity');
  assert.ok(draggedFront.tongue.dorsum.y <= 376, 'dorsum remains closed when carving cavity');
  assert.equal(Math.round(draggedFront.tongue.front.y), 460);
});
