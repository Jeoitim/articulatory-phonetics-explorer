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

// These anchors belong to the original 800 × 1000 sagittal drawing. Keeping
// them here makes every lower-lip interaction use the same jaw hinge as the
// mandible and lower incisor instead of maintaining a second visual pose.
export const lowerLipBaseAnchor: Point = { x: 90, y: 770 };
export const lowerLipRestAnchor: Point = { x: 74, y: 682 };
export const upperLipTarget: Point = { x: 115, y: 422 };
export const upperIncisorContact: Point = { x: 153, y: 429 };

export function lipTarget(p: Pick<Pose, 'rounding' | 'dentalContact'>): Point {
  const dental = Math.max(0, Math.min(1, p.dentalContact));
  const rounded = { x: 115 - p.rounding * 30, y: 422 };
  return {
    x: rounded.x + (upperIncisorContact.x - rounded.x) * dental,
    y: rounded.y + (upperIncisorContact.y - rounded.y) * dental,
  };
}

/**
 * Maximum closure that keeps the lower-lip tissue within its SVG-scale span.
 * The reference is the closed-jaw distance to the current target plus a small
 * amount of slack, so canonical labiodental presets still reach the incisor
 * while a wide jaw opening cannot pull the lip into a vertical strip.
 */
export function lowerLipClosureLimit(p: Pose): number {
  const base = jawPoint(lowerLipBaseAnchor, p.jaw);
  const restPoint = jawPoint(lowerLipRestAnchor, p.jaw);
  const target = lipTarget(p);
  const closedBase = jawPoint(lowerLipBaseAnchor, 0.05);
  const referenceSpan = Math.hypot(
    target.x - closedBase.x,
    target.y - closedBase.y,
  );
  const maxSpan = referenceSpan + 16;
  const restSpan = Math.hypot(restPoint.x - base.x, restPoint.y - base.y);
  const fullSpan = Math.hypot(target.x - base.x, target.y - base.y);
  if (fullSpan <= maxSpan || fullSpan <= restSpan) return 1;
  return Math.max(0, Math.min(1, (maxSpan - restSpan) / (fullSpan - restSpan)));
}

export function limitLowerLip(p: Pose): Pose {
  const next = structuredClone(p);
  next.lowerLip = Math.min(
    Math.max(0, Math.min(1, next.lowerLip)),
    lowerLipClosureLimit(next),
  );
  return next;
}

export function lowerLipPoint(p: Pose): Point {
  const restPoint = jawPoint(lowerLipRestAnchor, p.jaw);
  const target = lipTarget(p);
  const amount = Math.min(
    Math.max(0, Math.min(1, p.lowerLip)),
    lowerLipClosureLimit(p),
  );
  return {
    x: restPoint.x + (target.x - restPoint.x) * amount,
    y: restPoint.y + (target.y - restPoint.y) * amount,
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
  if (!Number.isFinite(jaw)) return structuredClone(p);
  const next = structuredClone(p);
  next.jaw = Math.max(0, Math.min(1, jaw));
  // Carry free tissue with the mandible, tapering toward the attached root.
  // Near-palatal tissue compensates so changing the jaw need not tear an
  // existing primary constriction away from its target.
  for (const [i, key] of tongueKeys.entries()) {
    const point = p.tongue[key];
    const before = jawPoint(point, p.jaw), after = jawPoint(point, next.jaw);
    const freedom = Math.max(0, Math.min(1, (point.y - roofY(point.x) - 15) / 70));
    const weight = [0.55, 0.5, 0.4, 0.18, 0][i]! * freedom;
    next.tongue[key] = boundPoint({
      x: point.x + (after.x - before.x) * weight,
      y: point.y + (after.y - before.y) * weight,
    }, key);
  }
  if (isPlausible(next)) return limitLowerLip(next);
  let lo = 0, hi = 1;
  for (let i = 0; i < 12; i++) {
    const mid = (lo + hi) / 2;
    if (isPlausible(mixPose(p, next, mid))) lo = mid;
    else hi = mid;
  }
  return limitLowerLip(mixPose(p, next, lo));
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
  {
    place: 'alveolo-palatal',
    point: { x: 305, y: 354 },
    keys: ['blade', 'front'],
  },
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
  larynx: 0,
  aspiration: 0,
};
const bounds: Record<TongueKey, [number, number, number, number]> = {
  // Leave enough anterior room for the existing upper-lip target. The point
  // is still bounded by the drawing and tissue constraints; it simply no
  // longer stops at the alveolar ridge when the user drags it forward.
  tip: [96, 335, 340, 600],
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
  if (key !== 'root') {
    // The apex can leave the palate boundary while it is dragged to the
    // upper lip. Keep that escape limited to the same anterior span used by
    // the surface/underside curves so a manual linguolabial gesture remains
    // continuous and ordinary tongue landmarks still follow the palate.
    const anteriorEscape = key === 'tip' ? clamp((176 - x) / 61, 0, 1) : 0;
    const roofFloor = roofY(x) - anteriorEscape * 28;
    // Reject out-of-bounds vertical drags at the palate boundary. A genuine
    // upper-lip drag is close to the target and explicitly enters this small
    // anterior window; an extreme pointer jump must remain palate-safe.
    const allowAnteriorEscape =
      anteriorEscape > 0 && p.y >= roofFloor - 0.001;
    y = Math.max(y, allowAnteriorEscape ? roofFloor : roofY(x));
  }
  return { x, y };
}

export function surface(p: Pose): Point[] {
  const tip = p.tongue.tip,
    pts = tongueKeys.map((k) => p.tongue[k]),
    // Moving the apex from the alveolar ridge to the upper lip is still one
    // continuous landmark motion. A distance based taper keeps the first
    // tangent and terminal cap smooth throughout that motion.
    tipReach = clamp((220 - tip.x) / 102, 0, 1),
    tipEscape = tipReach * clamp((roofY(tip.x) - tip.y) / 28, 0, 1),
    out: Point[] = [];
  const unit = (x: number, y: number) => {
    const length = Math.hypot(x, y) || 1;
    return { x: x / length, y: y / length };
  };
  const directions = pts.map((q, i) => {
    if (i === 0) return unit(pts[1]!.x - q.x, pts[1]!.y - q.y);
    if (i === pts.length - 1) return rootTangent(p);
    const before = pts[i - 1]!,
      after = pts[i + 1]!;
    // Chord-normalized directions keep a long root segment from turning a
    // dorsal contact into a vertical spike. Elevated body contacts have a
    // broad crown; a near-palatal crown follows the opposing palate slope.
    const incoming = unit(q.x - before.x, q.y - before.y);
    const outgoing = unit(after.x - q.x, after.y - q.y);
    const base = unit(incoming.x + outgoing.x, incoming.y + outgoing.y);
    // A raised blade also has a broad crown. Apply this only when the apex
    // remains anterior, leaving the reversed tangent of a curled tip intact.
    const crownWeight =
      i >= 2 || (i === 1 && before.x < q.x)
        ? clamp((Math.min(before.y, after.y) - q.y) / 45, 0, 1)
        : 0;
    const proximity = clamp((40 - (q.y - roofY(q.x))) / 40, 0, 1);
    const roofSlope = ((roofY(q.x + 2) - roofY(q.x - 2)) / 4) * proximity;
    // The descending uvula is not a tangent template for the tongue crown.
    const crown = unit(1, i >= 3 ? clamp(roofSlope, -0.6, 0.6) : roofSlope);
    return unit(
      base.x * (1 - crownWeight) + crown.x * crownWeight,
      base.y * (1 - crownWeight) + crown.y * crownWeight,
    );
  });
  // Arc-length-scaled Hermite handles maintain tangent direction across
  // landmarks, with a rounded posterior shoulder returning to the hyoid.
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i]!,
      b = pts[i + 1]!;
    const length = Math.hypot(b.x - a.x, b.y - a.y);
    const strength = i === 0 ? 0.65 - tipReach * 0.12 : i === 1 ? 0.65 : 0.95;
    const t0 = {
        x: directions[i]!.x * length * strength,
        y: directions[i]!.y * length * strength,
      },
      t1 = {
        x: directions[i + 1]!.x * length * strength,
        y: directions[i + 1]!.y * length * strength,
      };
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
      // The anterior tip can pass in front of the palate while it approaches
      // the upper lip. Fade that exclusion floor in continuously with the
      // apex position; ordinary poses keep the full palate boundary.
      const anteriorWeight = clamp((176 - x) / 61, 0, 1);
      // Keep the first sample exactly on the draggable apex. The remaining
      // samples ease into the palate floor, so the contact point and the
      // rendered tongue surface never appear one pixel apart.
      if (!(i === 0 && j === 0 && tipEscape > 0))
        y = Math.max(y, roofY(x) - tipEscape * 28 * anteriorWeight);
      x = Math.min(x, wallX(y) - 7);
      out.push({ x, y });
    }
  }
  out.push(pts[pts.length - 1]!);
  return out;
}
// A retracted root is a posterior wall segment, not the pointed end of a
// tongue pulled diagonally toward its fixed hyoid attachment. Use the same
// downward tangent on both sides of this landmark, with continuous blending
// for manual retraction and secondary pharyngealization.
function rootTangent(p: Pose): Point {
  const root = p.tongue.root;
  const retraction = clamp((root.x - 580) / 80, 0, 1);
  const dx = (557 - root.x) * (1 - retraction);
  const dy = 798 - root.y;
  const length = Math.hypot(dx, dy) || 1;
  return { x: dx / length, y: dy / length };
}
export function underside(p: Pose): Point[] {
  const tip = p.tongue.tip,
    blade = p.tongue.blade,
    tipReach = clamp((220 - tip.x) / 102, 0, 1),
    tipEscape = tipReach * clamp((roofY(tip.x) - tip.y) / 28, 0, 1),
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
  const rootDirection = rootTangent(p);
  const rootHandle = Math.hypot(557 - start.x, 798 - start.y);
  curve(
    { x: start.x + rootDirection.x * rootHandle,
      y: start.y + rootDirection.y * rootHandle },
    jawPoint({ x: 557, y: 811 }, p.jaw),
    jawPoint({ x: 548, y: 812 }, p.jaw),
  );
  floorCurve({ x: 495, y: 850 }, { x: 428, y: 839 }, { x: 398, y: 819 });
  const attachment = jawPoint({ x: 235, y: 738 }, p.jaw);
  // A broad mandibular attachment supports the belly. Do not route the
  // ventral contour through an offset blade: that creates an artificial waist.
  curve(
    jawPoint({ x: 338, y: 782 }, p.jaw),
    { x: attachment.x + 28, y: attachment.y + 64 },
    attachment,
  );
  // The free underside follows local surface normals. A rounded cap joins it
  // tangentially to the apex, rather than stretching a fixed anterior wall.
  const unit = (dx: number, dy: number) => {
    const d = Math.hypot(dx, dy) || 1;
    return { x: dx / d, y: dy / d };
  };
  const u = unit(blade.x - tip.x, blade.y - tip.y),
    n = { x: -u.y, y: u.x };
  // Taper the terminal cap gradually as the tip reaches the lip or incisor;
  // the body thickness remains unchanged and there is no inserted apex.
  const tipThickness = 27 - tipReach * 7;
  const cap = {
    x: tip.x + u.x * 24 + n.x * tipThickness,
    y: tip.y + u.y * 24 + n.y * tipThickness,
  };
  const freeLength = Math.hypot(cap.x - attachment.x, cap.y - attachment.y);
  const tangent = Math.min(60, freeLength * 0.28);
  curve(
    { x: attachment.x - tangent * 0.44, y: attachment.y - tangent },
    { x: cap.x + u.x * tangent, y: cap.y + u.y * tangent },
    cap,
  );
  curve(
    { x: cap.x - u.x * 23, y: cap.y - u.y * 23 },
    { x: tip.x - u.x * 14, y: tip.y - u.y * 14 },
    tip,
  );
  return out.map((q) => ({
    x: q.x,
    y:
      q.y < 610
        ? Math.max(
            q.y,
            roofY(q.x) - tipEscape * 28 * clamp((176 - q.x) / 61, 0, 1),
          )
        : q.y,
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
// Regional strain envelopes in drawing coordinates, calibrated to the gesture
// family below. These are geometric safeguards, not measured tissue moduli.
const tissueLinks: [TongueKey, TongueKey, number, number][] = [
  ['tip', 'blade', 30, 165],
  ['blade', 'front', 65, 180],
  ['front', 'dorsum', 85, 225],
  ['dorsum', 'root', 145, 375],
  ['front', 'root', 260, 415],
];
function tissueValid(p: Pose, tolerance = 1) {
  if (
    !tongueKeys.every(
      (k) => Number.isFinite(p.tongue[k].x) && Number.isFinite(p.tongue[k].y),
    )
  )
    return false;
  for (const [ka, kb, min, max] of tissueLinks) {
    const a = p.tongue[ka],
      b = p.tongue[kb];
    const d = Math.hypot(b.x - a.x, b.y - a.y);
    if (d < min - tolerance || d > max + tolerance) return false;
  }
  // The free apex can curl; the load-bearing body cannot double back on itself.
  const { blade, front, dorsum, root } = p.tongue;
  if (
    front.x < blade.x + 30 ||
    dorsum.x < front.x + 40 ||
    root.x < dorsum.x - 45
  )
    return false;
  for (const [a, b, c] of [
    [blade, front, dorsum],
    [front, dorsum, root],
  ]) {
    const ux = b!.x - a!.x,
      uy = b!.y - a!.y;
    const vx = c!.x - b!.x,
      vy = c!.y - b!.y;
    if ((ux * vx + uy * vy) / (Math.hypot(ux, uy) * Math.hypot(vx, vy)) < -0.67)
      return false;
  }
  return true;
}
export function isPlausible(p: Pose) {
  if (!tissueValid(p)) return false;
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
  if (a < 0.82 || a > 1.66) return false;
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
  for (let iteration = 0; iteration < 18; iteration++) {
    for (const [ka, kb, min, max] of tissueLinks) {
      const a = p.tongue[ka],
        b = p.tongue[kb],
        dx = b.x - a.x,
        dy = b.y - a.y,
        d = Math.hypot(dx, dy) || 1;
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
    'larynx',
  ] as const)
    p[k] = a[k] + (b[k] - a[k]) * t;
  p.aspiration =
    (a.aspiration ?? 0) + ((b.aspiration ?? 0) - (a.aspiration ?? 0)) * t;
  // Carry a selected marked gesture through the approach animation so the
  // contact overlay follows its intended articulator instead of flashing back
  // to the nearest chart zone. Drop the source mark halfway through recovery.
  p.variantOf = b.variantOf ?? (t < 0.5 ? a.variantOf : undefined);
  p.variantMark = b.variantMark ?? (t < 0.5 ? a.variantMark : undefined);
  return p;
}
export function constrain(
  pose: Pose,
  key: TongueKey,
  point: Point,
  snap: boolean,
): Pose {
  if (!Number.isFinite(point.x) || !Number.isFinite(point.y))
    return structuredClone(pose);
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
    const k = tongueKeys[i]!;
    let wx =
      key === k
        ? 1
        : index >= 2 && i >= 2
          ? i === 4 || index === 4
            ? 0.38
            : 0.78
          : Math.exp(-Math.pow(Math.abs(i - index) / 1.38, 2));
    let wy =
      key === k
        ? 1
        : k === 'root' && key !== 'root'
          ? wx * 0.32
          : key === 'dorsum' && k === 'front'
            ? 0.4
            : key === 'front' && k === 'dorsum'
              ? 0.55
              : wx;

    // Retraction coupling: when retracting the body posteriorly (dx > 0)
    // toward velar/uvular/pharyngeal positions, the anterior tongue retracts
    // with the muscular hydrostat instead of stretching into an extreme wedge.
    // Also anchor the root near the hyoid unless explicitly dragged.
    const uvularBlend =
      index >= 3 && dx > 0 ? clamp((target.x - 550) / 58, 0, 1) : 0;
    if (index >= 3 && dx > 0) {
      if (k === 'root' && key === 'dorsum') {
        wx = 0.06 * (1 - uvularBlend) + 0.22 * uvularBlend;
        wy = 0.04;
      } else if (k === 'front') {
        wx = Math.max(wx, 0.78 * (1 - uvularBlend) + 0.55 * uvularBlend);
      } else if (k === 'blade') {
        wx = Math.max(wx, 0.68 * (1 - uvularBlend) + 0.42 * uvularBlend);
      } else if (k === 'tip') {
        wx = Math.max(wx, 0.65 * (1 - uvularBlend) + 0.48 * uvularBlend);
      }
    }

    // Forward contraction: when advancing anterior articulators (dx < 0)
    // toward dental/alveolar targets, retracting body tissue follows forward
    // so anterior and posterior articulators do not deadlock.
    if (index < 2 && dx < 0) {
      if (k === 'tip' && key === 'blade') wx = Math.max(wx, 0.82);
      if (k === 'front') wx = Math.max(wx, 0.75);
      if (k === 'dorsum') wx = Math.max(wx, 0.65);
    }

    // Asymmetric vertical decoupling between tip and blade:
    // 1. Lowering the tip (dy > 0) to form a laminal gesture or rest behind
    // incisors should not drag an elevated blade away from its constriction.
    if (key === 'tip' && k === 'blade' && dy > 0 && pose.tongue.blade.y < 460) {
      wy = 0;
    }
    // 2. Elevating the blade (dy < 0) should not pull a lowered tip into an
    // unwanted apical curl.
    if (
      key === 'blade' &&
      k === 'tip' &&
      dy < 0 &&
      pose.tongue.tip.y >= pose.tongue.blade.y
    ) {
      wy = 0;
    }

    // Dual-closure decoupling for clicks / rarefaction chambers:
    // When lowering front (dy > 0) to carve the central pocket, anchored roof closures
    // (blade, tip, or dorsum) must not be pulled away vertically or horizontally.
    const dorsumAtRoof =
      pose.tongue.dorsum.y - roofY(pose.tongue.dorsum.x) < 22;
    const bladeAtRoof =
      pose.tongue.blade.y - roofY(pose.tongue.blade.x) < 25;
    const tipAtRoof =
      pose.tongue.tip.y - roofY(pose.tongue.tip.x) < 25;
    const hasLoweredPocket = pose.tongue.front.y >= 430;

    if (key === 'front' && dy > 0) {
      if (k === 'dorsum' && dorsumAtRoof) {
        wx = 0;
        wy = 0;
      }
      if (k === 'blade' && bladeAtRoof) {
        wx = 0;
        wy = 0;
      }
      if (k === 'tip' && tipAtRoof) {
        wx = 0;
        wy = 0;
      }
    }

    // When an anterior articulator is dragged in a click configuration (lowered pocket
    // and velar closure already established), preserve the posterior closure.
    if (index < 2 && hasLoweredPocket && dorsumAtRoof && k === 'dorsum') {
      wx = 0;
      wy = 0;
    }

    // When dorsum is dragged in a click configuration, preserve established anterior closure.
    if (index >= 3 && hasLoweredPocket && (k === 'blade' && bladeAtRoof || k === 'tip' && tipAtRoof)) {
      wx = 0;
      wy = 0;
    }

    let nextX = pose.tongue[k].x + dx * wx;
    let nextY = pose.tongue[k].y + dy * wy;

    // Posterior elevation releases prior high coronal constrictions toward
    // neutral dorsal height instead of pinning them to the roof or floor.
    if (index >= 3 && (dy < 0 || uvularBlend > 0) && !hasLoweredPocket) {
      const targetBladeY = 440 * (1 - uvularBlend) + 470 * uvularBlend;
      const targetFrontY = 410 * (1 - uvularBlend) + 450 * uvularBlend;
      const targetTipY = 470 * (1 - uvularBlend) + 490 * uvularBlend;
      const relaxStrength = Math.max(Math.min(1, -dy / 80), uvularBlend * 0.9);
      if (k === 'blade' && pose.tongue.blade.y < targetBladeY) {
        nextY =
          pose.tongue.blade.y +
          (targetBladeY - pose.tongue.blade.y) * relaxStrength;
      }
      if (k === 'front' && pose.tongue.front.y < targetFrontY) {
        nextY =
          pose.tongue.front.y +
          (targetFrontY - pose.tongue.front.y) * relaxStrength;
      }
      if (k === 'tip' && pose.tongue.tip.y < targetTipY) {
        nextY =
          pose.tongue.tip.y + (targetTipY - pose.tongue.tip.y) * relaxStrength;
      }
      if (k === 'root' && uvularBlend > 0) {
        nextY =
          pose.tongue.root.y + (725 - pose.tongue.root.y) * uvularBlend * 0.8;
      }
    }

    // Advancing anterior articulators forward relaxes prior dorsal elevation
    // UNLESS in a click configuration with an established lowered suction pocket.
    if (index < 2 && dx < 0 && k === 'dorsum' && pose.tongue.dorsum.y < 500 && !(hasLoweredPocket && dorsumAtRoof)) {
      nextY = Math.min(520, pose.tongue.dorsum.y + -dx * 0.7);
    }
    if (
      key === 'blade' &&
      k === 'tip' &&
      dx < 0 &&
      pose.tongue.tip.y > 430 &&
      target.y < 420
    ) {
      nextY = Math.max(430, pose.tongue.tip.y + dy * 0.5);
    }

    // Only dragging the tip itself allows moving into the anterior escape zone (< 176).
    // Coupling from blade drags must keep the tip at or behind the alveolar boundary.
    if (key !== 'tip' && k === 'tip') {
      nextX = Math.max(165, nextX);
    }

    p.tongue[k] = { x: nextX, y: nextY };
  }

  if (dy < 0 && index < 2) p.tongue.dorsum.y += Math.min(18, -dy * 0.1);
  if (key === 'tip') {
    // Bending is not translation: posterior apex movement lets the blade bow
    // forward and down. This continuous response makes apical curling reachable.
    const bend =
      clamp((target.x - 245) / 65, 0, 1) * clamp((470 - target.y) / 100, 0, 1);
    if (bend > 0) {
      p.tongue.blade.x +=
        (Math.min(p.tongue.blade.x, target.x - 40) - p.tongue.blade.x) *
        bend *
        0.72;
      p.tongue.blade.y = Math.max(p.tongue.blade.y, target.y + 58 * bend);
    }
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
      [195, 420],
      [270, 347 + gap],
      [352, 390],
      [463, 485],
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
      [185, 505],
      [285, 420],
      [410, 350 + gap],
      [520, 468],
      [545, 725],
    ],
    velar: [
      [260, 470],
      [320, 440],
      [420, 400],
      [552, 374 + gap],
      [550, 725],
    ],
    uvular: [
      [265, 490],
      [330, 470],
      [435, 450],
      [608, 438 + gap + (s.manner === 'nasal' ? 60 : 0)],
      [575, 725],
    ],
    pharyngeal: [
      [255, 520],
      [330, 495],
      [430, 485],
      [550, 535],
      [wallX(645) - gap - 7, 645],
    ],
  };
  const shape = shapes[s.place];
  // The jaw contributes to dorsal closure; these are neutral-context drawing
  // presets, not phoneme-specific measured jaw angles. Leave pharyngeals more
  // open and do not confuse mandibular elevation with closing the lips.
  if (s.place === 'velar' || s.place === 'uvular') p.jaw = closing ? 0.16 : 0.22;
  if (s.place === 'pharyngeal') p.jaw = 0.28;
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
    p.tongue.tip = { x: 190, y: 445 };
    p.tongue.blade = { x: 290, y: 354 + gap };
    p.tongue.front = { x: 392, y: 369 };
    p.tongue.dorsum = { x: 490, y: 470 };
  }
  if (s.variant === 'sje') {
    // This separate double-constriction schematic needs room for its raised
    // dorsum; it is not a universal Swedish realization of this variable sound.
    p.tongue.front.y = 410;
    p.tongue.dorsum = { x: 565, y: 440 };
    p.rounding = 0.35;
  }
  if (s.variant === 'dark-l') {
    p.tongue.dorsum = { x: 522, y: 510 };
    p.tongue.root = { x: 594, y: 711 };
  }
  if (s.variant === 'epiglottal') p.epiglottis = closing ? 1 : 0.7;
  if (s.airstream === 'ejective') {
    p.glottis = 0;
    p.larynx = -1;
  }
  if (s.airstream === 'implosive') {
    p.glottis = 0.16;
    p.larynx = 1;
  }
  if (s.airstream === 'click') {
    // Calibrated against phonetic literature (Ladefoged & Maddieson 1996, Thomas 2008, Sands 1991):
    // Clicks produce suction via a rarefaction chamber formed between an anterior closure
    // (lips, teeth, alveolar, or broad postalveolar/laminal) and a posterior velar/uvular closure.
    // The central tongue body is lowered into a shallow saucer (not a sharp vertical cliff),
    // maintaining natural tissue continuity without excessive jaw stretch or area violation.
    p.jaw = 0.12;
    p.tongue.dorsum = { x: 552, y: 374 };
    p.tongue.root = { x: 550, y: 725 };
    if (s.place === 'postalveolar') {
      // Palatoalveolar click [ǂ]: broad laminal-palatal anterior closure
      p.tongue.tip = { x: 205, y: 415 };
      p.tongue.blade = { x: 275, y: 347 };
      p.tongue.front = { x: 390, y: 450 };
    } else if (s.place === 'bilabial') {
      p.tongue.front = { x: 400, y: 460 };
    } else {
      p.tongue.front = { x: 395, y: 460 };
    }
  }
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
