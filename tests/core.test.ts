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
import { vowelAudio } from '../src/data/vowel-audio';
import { onlineAudioUrl, resolveAudioUrl } from '../src/engine/audio';
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
void test('all exposed active-articulator variants remain valid, keep their symbol, and carry an asterisk', () => {
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
  assert.match(infer(apical, sh).explanation, /ʃ\*/);
  assert.equal(infer(preset(sh), sh).nonTypical, false);
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
