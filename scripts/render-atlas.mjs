import './compile-model.mjs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
const { VocalTract } =
  await import('../work/verify/src/components/vocal-tract/VocalTract.js');
const { consonants, soundBySymbol } =
  await import('../work/verify/src/data/consonants.js');
const { preset, isPlausible, tongueArea, rest } =
  await import('../work/verify/src/engine/geometry.js');
await mkdir('work/atlas', { recursive: true });
const layers = [];
for (const [i, symbol] of (
  process.argv[2]?.split(',') || ['t', 'ʃ', 'ʂ', 'ʈ', 'ɻ', 'c', 'k', 'q']
).entries()) {
  const s = soundBySymbol(symbol);
  const html = renderToStaticMarkup(
    React.createElement(VocalTract, {
      pose: preset(s),
      place: s.place,
      display: { labels: false, points: false, zones: true, airflow: false },
      compact: true,
      animated: false,
    }),
  );
  const svg = html.slice(html.indexOf('<svg'), html.indexOf('</svg>') + 6);
  await writeFile('work/atlas/' + i + '.svg', svg);
  const png = await sharp(Buffer.from(svg))
    .resize(320, 400)
    .flatten({ background: '#faf8f2' })
    .png()
    .toBuffer();
  layers.push({
    input: png,
    left: (i % 4) * 320,
    top: Math.floor(i / 4) * 430,
  });
  const label = Buffer.from(
    '<svg width="320" height="30"><text x="150" y="23" font-size="24">[' +
      symbol +
      ']</text></svg>',
  );
  layers.push({
    input: label,
    left: (i % 4) * 320,
    top: Math.floor(i / 4) * 430 + 400,
  });
}
await sharp({
  create: { width: 1280, height: 860, channels: 4, background: '#faf8f2' },
})
  .composite(layers)
  .png()
  .toFile('work/atlas/contact-sheet.png');
console.log(
  'inventory',
  consonants.length,
  'implausible',
  consonants.filter((s) => !isPlausible(preset(s))).map((s) => s.symbol),
);
console.log(
  'area ratios',
  consonants
    .filter((s) => !isPlausible(preset(s)))
    .map((s) => [
      s.symbol,
      (tongueArea(preset(s)) / tongueArea(rest)).toFixed(2),
    ]),
);
