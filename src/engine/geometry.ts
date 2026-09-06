import type {
  Consonant,
  Point,
  Pose,
  TongueKey,
  Place,
} from '../domain/phonetics';
export const tongueKeys: TongueKey[] = [
  'tip',
  'blade',
  'front',
  'dorsum',
  'root',
];
export const tongueLabels: Record<TongueKey, string> = {
  tip: '舌尖前端 · Apex',
  blade: '舌叶（舌尖后方）· Lamina',
  front: '舌面前部 · Predorsum',
  dorsum: '舌面后部（舌背）· Dorsum',
  root: '舌根 · Radix',
};
// A schematic mandibular hinge; posterior soft tissue stays attached to the neck.
export function jawPoint(p: Point, jaw: number): Point {
  const a = ((1 - jaw) * 26 * Math.PI) / 180,
    w = Math.max(0, Math.min(1, (565 - p.x) / 230));
  const x = p.x - 600,
    y = p.y - 600;
  return {
    x: p.x + w * (600 + x * Math.cos(a) - y * Math.sin(a) - p.x),
    y: p.y + w * (600 + x * Math.sin(a) + y * Math.cos(a) - p.y),
  };
}
export function jawPath(path: string, jaw: number) {
  return path.replace(
    /(-?\d+(?:\.\d+)?)[, ]+(-?\d+(?:\.\d+)?)/g,
    (_, x: string, y: string) => {
      const p = jawPoint({ x: Number(x), y: Number(y) }, jaw);
      return p.x.toFixed(2) + ' ' + p.y.toFixed(2);
    },
  );
}
export function moveJaw(p: Pose, jaw: number) {
  const next = constrain(
    p,
    'front',
    { x: p.tongue.front.x, y: p.tongue.front.y + (jaw - p.jaw) * 35 },
    false,
  );
  next.jaw = jaw;
  return isPlausible(next) ? next : { ...p, jaw: p.jaw };
}
// All landmarks share the original Wikimedia SVG's 800 × 1000 coordinate system.
export const roof: Point[] = [
  [130, 443],
  [155, 426],
  [185, 389],
  [220, 385],
  [245, 375],
  [270, 347],
  [307, 339],
  [367, 344],
  [410, 350],
  [456, 351],
  [526, 361],
  [552, 374],
  [575, 394],
  [591, 395],
  [603, 416],
  [610, 440],
].map(([x, y]) => ({ x: x!, y: y! }));
export function roofY(x: number) {
  if (x <= roof[0]!.x) return roof[0]!.y;
  if (x >= 610) return 440;
  const i = roof.findIndex((p) => p.x >= x),
    a = roof[i - 1]!,
    b = roof[i]!;
  return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x);
}
export function wallX(y: number) {
  return y < 470 ? 667 : 667 + Math.max(0, y - 470) * 0.22;
}
export const zones: { place: Place; point: Point; keys: TongueKey[] }[] = [
  { place: 'dental', point: { x: 162, y: 418 }, keys: ['tip'] },
  { place: 'alveolar', point: { x: 220, y: 385 }, keys: ['tip', 'blade'] },
  { place: 'postalveolar', point: { x: 270, y: 347 }, keys: ['blade', 'tip'] },
  { place: 'retroflex', point: { x: 290, y: 342 }, keys: ['tip'] },
  { place: 'palatal', point: { x: 410, y: 350 }, keys: ['front', 'dorsum'] },
  { place: 'velar', point: { x: 552, y: 374 }, keys: ['dorsum'] },
  { place: 'uvular', point: { x: 608, y: 438 }, keys: ['dorsum'] },
  { place: 'pharyngeal', point: { x: wallX(645), y: 645 }, keys: ['root'] },
];
export const rest: Pose = {
  tongue: {
    tip: { x: 165, y: 535 },
    blade: { x: 248, y: 503 },
    front: { x: 352, y: 498 },
    dorsum: { x: 462, y: 548 },
    root: { x: 543, y: 746 },
  },
  jaw: 0.34,
  lowerLip: 0.1,
  velum: 0,
  glottis: 1,
  rounding: 0,
  retroflex: 0,
  epiglottis: 0,
  dentalContact: 0,
  uvula: 0,
};
const bounds: Record<TongueKey, [number, number, number, number]> = {
  tip: [145, 335, 340, 600],
  blade: [200, 360, 340, 620],
  front: [285, 455, 339, 665],
  dorsum: [395, 625, 365, 725],
  root: [505, 708, 595, 795],
};
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
function boundPoint(p: Point, key: TongueKey) {
  const [x0, x1, y0, y1] = bounds[key];
  let y = clamp(p.y, y0, y1);
  const x = clamp(p.x, x0, Math.min(x1, wallX(y) - 10));
  if (key !== 'root') y = Math.max(y, roofY(x));
  return { x, y };
}
export function surface(p: Pose): Point[] {
  const pts = tongueKeys.map((k) => p.tongue[k]),
    out: Point[] = [];
  // Centripetal-like, limited cubic Hermite tangents retain continuous slope.
  // A curled apex may overhang the blade; the full polygon is checked, not just x order.
  for (let i = 0; i < 4; i++) {
    const a = pts[i]!,
      b = pts[i + 1]!,
      prev = pts[Math.max(0, i - 1)]!,
      next = pts[Math.min(4, i + 2)]!;
    const t0 = { x: (b.x - prev.x) * 0.32, y: (b.y - prev.y) * 0.32 },
      t1 = { x: (next.x - a.x) * 0.32, y: (next.y - a.y) * 0.32 };
    for (let j = 0; j < 16; j++) {
      const t = j / 16,
        t2 = t * t,
        t3 = t2 * t;
      let x =
        (2 * t3 - 3 * t2 + 1) * a.x +
        (t3 - 2 * t2 + t) * t0.x +
        (-2 * t3 + 3 * t2) * b.x +
        (t3 - t2) * t1.x;
      let y =
        (2 * t3 - 3 * t2 + 1) * a.y +
        (t3 - 2 * t2 + t) * t0.y +
        (-2 * t3 + 3 * t2) * b.y +
        (t3 - t2) * t1.y;
      if (i < 3) y = Math.max(y, roofY(x));
      x = Math.min(x, wallX(y) - 7);
      out.push({ x, y });
    }
  }
  out.push(pts[4]!);
  return out;
}
function underside(p: Pose): Point[] {
  const tip = p.tongue.tip,
    blade = p.tongue.blade,
    out: Point[] = [];
  let start = p.tongue.root;
  const curve = (a: Point, b: Point, end: Point) => {
    for (let j = 1; j <= 16; j++) {
      const t = j / 16,
        u = 1 - t;
      out.push({
        x:
          u * u * u * start.x +
          3 * u * u * t * a.x +
          3 * u * t * t * b.x +
          t * t * t * end.x,
        y:
          u * u * u * start.y +
          3 * u * u * t * a.y +
          3 * u * t * t * b.y +
          t * t * t * end.y,
      });
    }
    start = end;
  };
  const floorCurve = (a: Point, b: Point, end: Point) =>
    curve(jawPoint(a, p.jaw), jawPoint(b, p.jaw), jawPoint(end, p.jaw));
  floorCurve({ x: 557, y: 798 }, { x: 557, y: 811 }, { x: 548, y: 812 });
  floorCurve({ x: 495, y: 850 }, { x: 428, y: 839 }, { x: 398, y: 819 });
  floorCurve({ x: 355, y: 795 }, { x: 316, y: 766 }, { x: 300, y: 740 });
  // The free underside follows local surface normals. A rounded cap joins it
  // tangentially to the apex, rather than stretching a fixed anterior wall.
  const unit = (dx: number, dy: number) => {
    const d = Math.hypot(dx, dy) || 1;
    return { x: dx / d, y: dy / d };
  };
  const u = unit(blade.x - tip.x, blade.y - tip.y),
    n = { x: -u.y, y: u.x };
  const mid = unit(p.tongue.front.x - tip.x, p.tongue.front.y - tip.y);
  const underBlade = {
    x: blade.x - mid.y * (80 - 20 * p.retroflex),
    y: blade.y + mid.x * (80 - 20 * p.retroflex),
  };
  const cap = {
    x: tip.x + u.x * 24 + n.x * 27,
    y: tip.y + u.y * 24 + n.y * 27,
  };
  underBlade.y = Math.max(underBlade.y, cap.y + 30);
  const v = unit(cap.x - underBlade.x, cap.y - underBlade.y);
  curve(
    { x: start.x + 15, y: start.y + (underBlade.y - start.y) * 0.35 },
    { x: underBlade.x - v.x * 32, y: underBlade.y - v.y * 32 },
    underBlade,
  );
  curve(
    { x: underBlade.x + v.x * 24, y: underBlade.y + v.y * 24 },
    { x: cap.x + u.x * 18, y: cap.y + u.y * 18 },
    cap,
  );
  curve(
    { x: cap.x - u.x * 23, y: cap.y - u.y * 23 },
    { x: tip.x - u.x * 14, y: tip.y - u.y * 14 },
    tip,
  );
  return out.map((q) => ({
    x: q.x,
    y: q.y < 610 ? Math.max(q.y, roofY(q.x)) : q.y,
  }));
}
function cross(a: Point, b: Point, c: Point) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}
function intersects(a: Point, b: Point, c: Point, d: Point) {
  return (
    cross(a, b, c) * cross(a, b, d) < -0.001 &&
    cross(c, d, a) * cross(c, d, b) < -0.001
  );
}
export function tongueArea(p: Pose) {
  const points = [...surface(p), ...underside(p)];
  return (
    Math.abs(
      points.reduce((s, a, i) => {
        const b = points[(i + 1) % points.length]!;
        return s + a.x * b.y - b.x * a.y;
      }, 0),
    ) / 2
  );
}
const restArea = tongueArea(rest);
export function isPlausible(p: Pose) {
  const pts = [...surface(p), ...underside(p)];
  for (let i = 0; i < pts.length; i++)
    for (let j = i + 2; j < pts.length; j++) {
      if (i === 0 && j === pts.length - 1) continue;
      if (
        intersects(
          pts[i]!,
          pts[(i + 1) % pts.length]!,
          pts[j]!,
          pts[(j + 1) % pts.length]!,
        )
      )
        return false;
    }
  const a = tongueArea(p) / restArea;
  if (a < 0.58 || a > 1.72) return false;
  for (let i = 0; i < 4; i++) {
    const a = p.tongue[tongueKeys[i]!]!,
      b = p.tongue[tongueKeys[i + 1]!]!;
    const d = Math.hypot(a.x - b.x, a.y - b.y);
    if (d < 27 || d > [190, 205, 285, 400][i]!) return false;
  }
  return true;
}
export function projectPose(input: Pose): Pose {
  const p = structuredClone(input);
  for (const k of tongueKeys) p.tongue[k] = boundPoint(p.tongue[k], k);
  // Constraint relaxation distributes stretch instead of letting one vertex form a spike.
  for (let iteration = 0; iteration < 10; iteration++) {
    for (let i = 0; i < 4; i++) {
      const ka = tongueKeys[i]!,
        kb = tongueKeys[i + 1]!,
        a = p.tongue[ka],
        b = p.tongue[kb],
        dx = b.x - a.x,
        dy = b.y - a.y,
        d = Math.hypot(dx, dy) || 1,
        min = [43, 56, 68, 110][i]!,
        max = [175, 190, 263, 312][i]!;
      const error = d < min ? d - min : d > max ? d - max : 0;
      if (error) {
        const u = (error / d) * 0.42;
        p.tongue[ka] = boundPoint({ x: a.x + dx * u, y: a.y + dy * u }, ka);
        p.tongue[kb] = boundPoint({ x: b.x - dx * u, y: b.y - dy * u }, kb);
      }
    }
  }
  return p;
}
export function mixPose(a: Pose, b: Pose, t: number): Pose {
  const p = structuredClone(a);
  for (const k of tongueKeys)
    p.tongue[k] = {
      x: a.tongue[k].x + (b.tongue[k].x - a.tongue[k].x) * t,
      y: a.tongue[k].y + (b.tongue[k].y - a.tongue[k].y) * t,
    };
  for (const k of [
    'jaw',
    'lowerLip',
    'velum',
    'glottis',
    'rounding',
    'retroflex',
    'epiglottis',
    'dentalContact',
    'uvula',
  ] as const)
    p[k] = a[k] + (b[k] - a[k]) * t;
  return p;
}
export function constrain(
  pose: Pose,
  key: TongueKey,
  point: Point,
  snap: boolean,
): Pose {
  const index = tongueKeys.indexOf(key),
    target = boundPoint(point, key),
    original = pose.tongue[key],
    p = structuredClone(pose);
  if (snap) {
    const zone = zones
      .filter((z) => z.keys.includes(key) && z.place !== 'retroflex')
      .find((z) => Math.hypot(z.point.x - target.x, z.point.y - target.y) < 18);
    if (zone) target.x += (zone.point.x - target.x) * 0.12;
  }
  const dx = target.x - original.x,
    dy = target.y - original.y;
  for (let i = 0; i < 5; i++) {
    const k = tongueKeys[i]!,
      w =
        Math.exp(-Math.pow(Math.abs(i - index) / 1.38, 2)) *
        (k === 'root' && key !== 'root' ? 0.3 : 1);
    p.tongue[k] = {
      x: pose.tongue[k].x + dx * w,
      y: pose.tongue[k].y + dy * w,
    };
  }
  // Distributed compensatory motion approximates tissue redistribution. It is not
  // a claim that sagittal area equals conserved 3D volume.
  if (dy < 0 && index >= 2) {
    p.tongue.tip.y += Math.min(25, -dy * 0.16);
    p.tongue.blade.y += Math.min(17, -dy * 0.11);
  }
  if (dy < 0 && index < 2) p.tongue.dorsum.y += Math.min(18, -dy * 0.1);
  if (key === 'tip') {
    // Bending is not translation: posterior apex movement lets the blade bow
    // forward and down. This continuous response makes apical curling reachable.
    const bend =
      clamp((target.x - 245) / 65, 0, 1) * clamp((470 - target.y) / 100, 0, 1);
    p.tongue.blade.x +=
      (Math.min(p.tongue.blade.x, target.x - 40) - p.tongue.blade.x) *
      bend *
      0.72;
    p.tongue.blade.y = Math.max(p.tongue.blade.y, target.y + 58 * bend);
  }
  p.retroflex =
    key === 'tip'
      ? clamp((target.x - p.tongue.blade.x + 12) / 45, 0, 1) *
        clamp((p.tongue.blade.y - target.y - 10) / 40, 0, 1)
      : p.retroflex * 0.95;
  const projected = projectPose(p);
  if (isPlausible(projected)) return projected;
  // Reject only the inadmissible fraction of the move, preserving continuity.
  let lo = 0,
    hi = 1;
  for (let i = 0; i < 12; i++) {
    const m = (lo + hi) / 2;
    if (isPlausible(mixPose(pose, projected, m))) lo = m;
    else hi = m;
  }
  return mixPose(pose, projected, lo);
}
export function preset(s: Consonant): Pose {
  const p = structuredClone(rest),
    closing = [
      'plosive',
      'nasal',
      'tap',
      'trill',
      'lateral-approximant',
      'lateral-fricative',
      'affricate',
    ].includes(s.manner),
    gap = closing ? 0 : s.manner === 'approximant' ? 42 : 13;
  p.velum = s.velum === 'lowered' ? 1 : 0;
  p.glottis =
    s.place === 'glottal' && s.manner === 'plosive' ? 0 : s.voiced ? 0.16 : 1;
  // Shared gesture templates are organ configurations, not copied per-symbol SVGs.
  const shapes: Partial<Record<Place, number[][]>> = {
    dental: [
      [164, 418 + gap],
      [240, 451],
      [348, 494],
      [460, 547],
      [543, 746],
    ],
    alveolar: [
      [220, 385 + gap],
      [276, 432],
      [355, 483],
      [458, 548],
      [543, 746],
    ],
    postalveolar: [
      [218, 425],
      [270, 347 + gap],
      [352, 399],
      [463, 493],
      [543, 746],
    ],
    retroflex: [
      [296, 342 + gap],
      [255, 408],
      [353, 481],
      [458, 546],
      [543, 746],
    ],
    palatal: [
      [200, 485],
      [269, 446],
      [410, 350 + gap],
      [485, 444],
      [547, 741],
    ],
    velar: [
      [171, 533],
      [272, 506],
      [400, 462],
      [552, 374 + gap],
      [565, 738],
    ],
    uvular: [
      [173, 540],
      [279, 514],
      [431, 472],
      [608, 438 + gap + (s.manner === 'nasal' ? 60 : 0)],
      [604, 721],
    ],
    pharyngeal: [
      [174, 542],
      [270, 526],
      [388, 534],
      [534, 590],
      [wallX(645) - gap - 7, 645],
    ],
  };
  const shape = shapes[s.place];
  if (shape)
    tongueKeys.forEach(
      (k, i) => (p.tongue[k] = { x: shape[i]![0]!, y: shape[i]![1]! }),
    );
  p.retroflex = s.place === 'retroflex' ? 1 : 0;
  if (s.place === 'bilabial') p.lowerLip = closing ? 1 : 0.78;
  if (s.place === 'labiodental') {
    p.lowerLip = closing ? 0.91 : s.manner === 'approximant' ? 0.68 : 0.86;
    p.dentalContact = 1;
  }
  if (s.place === 'bilabial' || s.place === 'labiodental') {
    p.jaw = 0.05;
    for (const [i, k] of tongueKeys.entries())
      p.tongue[k].y -= [38, 38, 30, 18, 5][i]!;
  }
  if (s.variant === 'labial-velar' || s.variant === 'labial-palatal') {
    p.rounding = 0.85;
    p.lowerLip = 0.55;
  }
  if (s.variant === 'alveolo-palatal') {
    p.tongue.tip = { x: 184, y: 477 };
    p.tongue.blade = { x: 290, y: 354 + gap };
    p.tongue.front = { x: 392, y: 369 };
  }
  if (s.variant === 'sje') {
    p.tongue.dorsum = { x: 565, y: 440 };
    p.rounding = 0.35;
  }
  if (s.variant === 'dark-l') {
    p.tongue.dorsum = { x: 522, y: 510 };
    p.tongue.root = { x: 594, y: 711 };
  }
  if (s.variant === 'epiglottal') p.epiglottis = closing ? 1 : 0.7;
  return p;
}
export function tonguePath(p: Pose) {
  return (
    'M ' +
    [...surface(p), ...underside(p)]
      .map((q) => q.x.toFixed(2) + ' ' + q.y.toFixed(2))
      .join(' L ') +
    ' Z'
  );
}
export function interpolate(a: Pose, b: Pose, t: number) {
  t = clamp(t, 0, 1);
  const p = mixPose(a, b, t);
  if (b.retroflex > 0.6 && a.retroflex < 0.2) {
    // Raise the apex before retracting it: a straight interpolation would squash
    // apex and blade together on the way to a curled posture.
    p.tongue.tip.x =
      a.tongue.tip.x + (b.tongue.tip.x - a.tongue.tip.x) * Math.pow(t, 1.6);
    p.tongue.tip.y =
      a.tongue.tip.y + (b.tongue.tip.y - a.tongue.tip.y) * Math.pow(t, 0.4);
  }
  return p;
}
