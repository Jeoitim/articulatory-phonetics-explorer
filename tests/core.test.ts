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
void test('all recordings have a source, attribution and a playable media URL', () => {
  const manifest = JSON.parse(
    readFileSync('public/audio/manifest.json', 'utf8'),
  ) as Record<
    string,
    { audioUrl: string; source: string; license: string; attribution: string }
  >;
  for (const s of consonants) {
    const a = manifest[s.symbol];
    assert.ok(a?.source.startsWith('https://commons.wikimedia.org/'), s.symbol);
    assert.ok(a.license && a.attribution, s.symbol);
    if (a.audioUrl.startsWith('/'))
      assert.equal(
        readFileSync('public' + a.audioUrl)
          .subarray(0, 4)
          .toString(),
        'OggS',
      );
    else assert.ok(a.audioUrl.startsWith('https://upload.wikimedia.org/'));
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
  assert.equal(consonants.length, 78);
  assert.equal(new Set(consonants.map((s) => s.symbol)).size, 78);
  for (const symbol of symbols)
    assert.ok(
      consonants.some((s) => s.symbol === symbol),
      symbol,
    );
});
void test('whole-configuration inference distinguishes all 78 presets', () => {
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
void test('closed fricatives, open stops, and unsupported mechanisms never yield exact matches', () => {
  const s = soundBySymbol('s'),
    t = soundBySymbol('t');
  assert.equal(infer(preset(t), s).status, 'none');
  assert.equal(infer(rest, t).status, 'none');
  assert.equal(
    infer(preset(t), { ...t, airstream: 'click' }).status,
    'unsupported',
  );
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
