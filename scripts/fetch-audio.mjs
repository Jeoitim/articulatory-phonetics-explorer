import { readFile, writeFile } from 'node:fs/promises';
const manifest = JSON.parse(
  await readFile('public/audio/manifest.json', 'utf8'),
);
// The checked-in manifest is the replaceable audio interface. All existing URLs
// and licenses were verified against Commons imageinfo and source revisions.
// Download is opt-in; honor throttling immediately rather than retrying in a loop.
if (!process.argv.includes('--download')) {
  console.log(
    Object.keys(manifest).length +
      ' attributed examples; pass --download to cache remote files.',
  );
  process.exit(0);
}
for (const [symbol, item] of Object.entries(manifest)) {
  if (!item.audioUrl.startsWith('https://upload.wikimedia.org/')) continue;
  const response = await fetch(item.audioUrl, {
    signal: AbortSignal.timeout(30000),
  });
  if (response.status === 429) {
    console.log(
      'Source rate limit. Retry after ' +
        (response.headers.get('retry-after') || '600') +
        ' seconds.',
    );
    break;
  }
  if (!response.ok) {
    console.log(symbol + ': ' + response.status);
    continue;
  }
  const bytes = Buffer.from(await response.arrayBuffer()),
    header = bytes.toString('ascii', 0, 4);
  if (header !== 'OggS' && header !== 'RIFF')
    throw Error('Unexpected audio format for ' + symbol);
  const name =
    Array.from(symbol)
      .map((c) => c.codePointAt(0).toString(16))
      .join('-') + (header === 'RIFF' ? '.wav' : '.ogg');
  await writeFile('public/audio/' + name, bytes);
  item.audioUrl = '/audio/' + name;
  await writeFile(
    'public/audio/manifest.json',
    JSON.stringify(manifest, null, 2),
  );
  await writeFile(
    'public/attribution/audio.json',
    JSON.stringify(manifest, null, 2),
  );
  console.log(symbol + ' cached');
  await new Promise((r) => setTimeout(r, 5000));
}
