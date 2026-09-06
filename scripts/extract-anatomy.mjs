import { readFile, writeFile } from 'node:fs/promises';
const xml = await readFile(
  'public/reference/places-of-articulation.svg',
  'utf8',
);
const paths = {};
for (const m of xml.matchAll(/<path\s([\s\S]*?)\/>/g)) {
  const id = m[1].match(/id="([^"]+)"/)?.[1],
    d = m[1].match(/\bd="([^"]+)"/)?.[1];
  if (id && d) paths[id] = d;
}
const sections = paths.path2170.split(/ z M /);
const head = sections[0] + ' Z',
  posteriorLarynx = 'M ' + sections[1] + ' Z';
const originalFloor = 'M ' + sections[2];
const floor = originalFloor
  .replace(
    /C 199\.59607[\s\S]*?C 540\.90879/,
    'C 250 738 337 798 428 811 C 479 820 524 816 539.46207 793.40019 C 540.90879',
  )
  .replace(
    /C 540\.90879[\s\S]*?C 571\.39158/,
    'Q 553 810 568.75649 828.25045 C 571.39158',
  )
  .replace(
    /C 92\.75585[\s\S]*?C 150\.28176/,
    'Q 93 746 139.56421 744.91286 C 150.28176',
  );
const palate = paths.path3143.replace(
  /C 588\.84401[\s\S]*?C 499\.4262/,
  'L 565.50799 373 Q 543 365 526.17767 361.27625 C 499.4262',
);
const result = {
  head,
  posteriorLarynx,
  floor,
  palate,
  upperTooth: paths.path3179,
  lowerTooth: paths.path3181,
  glottis: paths.path3183,
};
await writeFile(
  'src/data/anatomy-paths.ts',
  '// Adapted from ish shwar / Rohieb, Places_of_articulation.svg, CC BY-SA 3.0.\n// Original contours retained; tongue and velum separated for deformation.\nexport const anatomyPaths = ' +
    JSON.stringify(result, null, 2) +
    ' as const;\n',
);
