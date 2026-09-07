import fs from 'node:fs';
import ts from 'typescript';
const manifest = JSON.parse(
  fs.readFileSync('public/audio/manifest.json', 'utf8').replace(/^\uFEFF/, ''),
);
const source = ts.createSourceFile(
  'vowel-audio.ts',
  fs.readFileSync('src/data/vowel-audio.ts', 'utf8'),
  ts.ScriptTarget.Latest,
  true,
);
const declaration = source.statements.find(ts.isVariableStatement)
  .declarationList.declarations[0];
const symbols = declaration.initializer.properties.map((p) => p.name.text);
if (symbols.length !== 28 || symbols.some((s) => !manifest[s]))
  throw Error('Vowel recording set mismatch');
fs.writeFileSync(
  'src/data/vowel-audio.ts',
  "import type { AudioExample } from '../domain/phonetics';\nexport const vowelAudio: Record<string, AudioExample> = " +
    JSON.stringify(
      Object.fromEntries(symbols.map((s) => [s, manifest[s]])),
      null,
      2,
    ) +
    ';\n',
);
for (const path of [
  'public/audio/manifest.json',
  'public/attribution/audio.json',
])
  fs.writeFileSync(path, JSON.stringify(manifest, null, 2) + '\n');
