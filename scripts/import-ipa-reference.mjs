// Read the official chart's literal data without executing downloaded JavaScript.
import ts from 'typescript';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const sourceUrl =
  'https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html#eng';
const sourceText = await readFile('work/ipa-arrays.js', 'utf8').catch(
  async () => {
    const response = await fetch(new URL('dbs/arrays.js', sourceUrl), {
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) throw Error(`IPA source unavailable: ${response.status}`);
    const body = await response.text();
    await mkdir('work', { recursive: true });
    await writeFile('work/ipa-arrays.js', body);
    return body;
  },
);
const source = ts.createSourceFile(
  'arrays.js',
  sourceText,
  ts.ScriptTarget.Latest,
  true,
);
function literal(node) {
  if (ts.isStringLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node))
    return Object.fromEntries(
      node.properties
        .filter(ts.isPropertyAssignment)
        .map((p) => [p.name.text, literal(p.initializer)]),
    );
  return undefined;
}
const declaration = source.statements
  .filter(ts.isVariableStatement)
  .flatMap((s) => [...s.declarationList.declarations])
  .find((d) => d.name.getText(source) === 'aSymbols');
const records = literal(declaration.initializer);
const clean = (s) =>
  s.replaceAll('◌', '').replaceAll('\u034f', '').normalize('NFD').trim();
const decodeHtmlEntities = (value) =>
  value.replace(
    /&(#x?[0-9a-f]+|amp|lt|gt|quot|apos|nbsp);/gi,
    (full, entity) => {
      const lower = entity.toLowerCase();
      if (lower === 'amp') return '&';
      if (lower === 'lt') return '<';
      if (lower === 'gt') return '>';
      if (lower === 'quot') return '"';
      if (lower === 'apos') return "'";
      if (lower === 'nbsp') return '\u00a0';
      const code = lower.startsWith('#x')
        ? Number.parseInt(lower.slice(2), 16)
        : Number.parseInt(lower.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : full;
    },
  );
const cleanExample = (value) =>
  decodeHtmlEntities(value).replace(/<\/?u\s*>/gi, '');
const authors = [
  ['JE', 'J. Esling'],
  ['JH', 'J. House'],
  ['PL', 'P. Ladefoged'],
  ['JW', 'J. Wells'],
];
const inventory = {};
for (const item of records.filter(
  (r) => [4, 6, 7].includes(r.Tbl) || [311, 312].includes(r.SID),
)) {
  const clips = [];
  for (const [a, [code, speaker]] of authors.entries()) {
    for (const [i, available] of (item.Audio?.[a] ?? []).entries()) {
      if (available !== 1 || !item.U_No) continue;
      const exampleId = i === 0 ? item.Ex : item['Ex_' + i];
      const example = records.find((r) => r.SID === exampleId);
      const context = [1, 2, 3, 4]
        .map((n) => records.find((r) => r.SID === item['Ex_' + n])?.Symbol)
        .filter(Boolean);
      const exampleText =
        typeof exampleId === 'string' ? exampleId : (example?.Symbol ?? '');
      const filename =
        item.U_No.replaceAll(' + ', '_') + (i === 0 ? '' : '_' + i);
      clips.push({
        speaker,
        example: cleanExample(exampleText)
          .replaceAll('\u034f', '')
          .replaceAll('\u0342', '\u0303'),
        context: exampleText
          ? []
          : context.map((s) =>
              cleanExample(s)
                .replaceAll('\u034f', '')
                .replaceAll('\u0342', '\u0303'),
            ),
        url: `https://www.internationalphoneticassociation.org/IPAcharts/common_files/sounds/${code}/${filename}.mp3`,
      });
    }
  }
  // The source uses a font-specific perispomeni glyph for nasalization, but
  // correctly supplies U+0303 in U_No. Prefer its declared Unicode identity.
  const key = item.U_No
    ? item.U_No.split(' + ')
        .map((h) => String.fromCodePoint(parseInt(h, 16)))
        .join('')
        .normalize('NFD')
    : clean(item.Symbol);
  inventory[key] = { ipaNumber: item.IPA_No ?? '', clips };
}
await writeFile(
  'src/data/ipa-reference-audio.ts',
  `// Official interactive IPA chart metadata, retrieved 2026-09-07. Source URLs are retained; the local cache is generated separately by fetch-ipa-reference.mjs.\nexport const ipaAudioSource = ${JSON.stringify(sourceUrl)};\nexport interface ReferenceClip { speaker: string; example: string; context: string[]; url: string; }\nexport const ipaReferenceAudio: Record<string, { ipaNumber: string; clips: ReferenceClip[] }> = ${JSON.stringify(inventory, null, 2)};\n`,
);
console.log(
  `${Object.keys(inventory).length} reference symbols, ${Object.values(inventory).reduce((n, r) => n + r.clips.length, 0)} source-listed recordings`,
);
if (process.argv.includes('--check')) {
  const urls = [
    ...new Set(
      Object.values(inventory).flatMap((r) => r.clips.map((c) => c.url)),
    ),
  ];
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: 6 }, async () => {
      while (next < urls.length) {
        const url = urls[next++];
        try {
          const response = await fetch(url, {
            method: 'HEAD',
            signal: AbortSignal.timeout(15000),
          });
          results.push({
            url,
            status: response.status,
            type: response.headers.get('content-type'),
          });
        } catch {
          results.push({ url, status: 0 });
        }
      }
    }),
  );
  await writeFile(
    'work/ipa-audio-check.json',
    JSON.stringify(results, null, 2),
  );
  console.log(
    JSON.stringify({
      total: results.length,
      failed: results.filter((r) => r.status !== 200),
    }),
  );
}
