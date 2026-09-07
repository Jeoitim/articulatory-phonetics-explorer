import { readFile, stat } from 'node:fs/promises';
const manifest = JSON.parse(
  await readFile('public/audio/manifest.json', 'utf8'),
);
let local = 0;
const pending = [];
for (const [symbol, item] of Object.entries(manifest)) {
  if (!item.audioUrl.startsWith('/audio/')) {
    pending.push(symbol);
    continue;
  }
  const path = 'public' + item.audioUrl;
  const bytes = await readFile(path);
  if (bytes.subarray(0, 4).toString() === 'RIFF') {
    if (bytes.readUInt32LE(4) + 8 > bytes.length)
      throw Error('Truncated WAV: ' + symbol);
  } else {
    let offset = 0,
      ended = false;
    while (offset < bytes.length) {
      if (
        bytes.subarray(offset, offset + 4).toString() !== 'OggS' ||
        offset + 27 > bytes.length
      )
        throw Error('Invalid Ogg page: ' + symbol);
      const segments = bytes[offset + 26];
      if (offset + 27 + segments > bytes.length)
        throw Error('Truncated Ogg table: ' + symbol);
      const payload = bytes
        .subarray(offset + 27, offset + 27 + segments)
        .reduce((a, b) => a + b, 0);
      ended = (bytes[offset + 5] & 4) !== 0;
      offset += 27 + segments + payload;
      if (offset > bytes.length)
        throw Error('Truncated Ogg payload: ' + symbol);
    }
    if (!ended) throw Error('Missing end-of-stream: ' + symbol);
  }
  if ((await stat(path)).size < 100) throw Error('Empty recording: ' + symbol);
  local++;
}
console.log(
  `${local}/${Object.keys(manifest).length} complete local recordings; ${pending.length} awaiting cache.`,
);
if (pending.length) console.log('Pending: ' + pending.join(' '));
if (pending.length && process.argv.includes('--require-complete'))
  process.exitCode = 1;
