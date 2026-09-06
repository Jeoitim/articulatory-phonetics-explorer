import type { Point, Pose } from '../domain/phonetics';
import { roof, roofY, surface, underside, wallX } from './geometry';

const boundary: Point[] = [
  ...roof,
  { x: 667, y: 440 },
  { x: 667, y: 470 },
  { x: wallX(820), y: 820 },
];

/** Opposing airway boundary, not a fixed offset from the tongue. */
export function airwayMidpoint(point: Point): Point {
  let nearest = boundary[0]!;
  let distance = Infinity;
  for (let i = 1; i < boundary.length; i++) {
    const a = boundary[i - 1]!,
      b = boundary[i]!;
    const dx = b.x - a.x,
      dy = b.y - a.y;
    const t = Math.max(
      0,
      Math.min(
        1,
        ((point.x - a.x) * dx + (point.y - a.y) * dy) / (dx * dx + dy * dy),
      ),
    );
    const q = { x: a.x + t * dx, y: a.y + t * dy };
    const d = Math.hypot(point.x - q.x, point.y - q.y);
    if (d < distance) {
      nearest = q;
      distance = d;
    }
  }
  return { x: (point.x + nearest.x) / 2, y: (point.y + nearest.y) / 2 };
}

function airwaySamples(pose: Pose) {
  const top = surface(pose);
  const contour = [...top, ...underside(pose)];
  // A curled apex can overhang the blade. Use the exposed upper envelope,
  // rather than sending the streamline into tissue beneath that overhang.
  const upper = (p: Point) => {
    let y = p.y;
    contour.forEach((a, i) => {
      const b = contour[(i + 1) % contour.length]!;
      if (p.x < Math.min(a.x, b.x) || p.x > Math.max(a.x, b.x)) return;
      const t = b.x === a.x ? 0 : (p.x - a.x) / (b.x - a.x);
      y = Math.min(y, a.y + t * (b.y - a.y));
    });
    return { x: p.x, y };
  };
  const front = top.slice(0, 49);
  const minX = Math.min(...front.map((p) => p.x));
  const maxX = Math.max(...front.map((p) => p.x));
  const oral = [
    ...new Set(
      contour.filter((p) => p.x >= minX && p.x <= maxX).map((p) => p.x),
    ),
  ]
    .sort((a, b) => b - a)
    .map((x) => upper({ x, y: 1000 }));
  return [
    ...top
      .slice(49)
      .reverse()
      .map((tissue) => ({ point: airwayMidpoint(tissue), tissue })),
    ...oral.map((tissue) => ({
      point: { x: tissue.x, y: (tissue.y + roofY(tissue.x)) / 2 },
      tissue,
    })),
  ];
}

export function oralAirway(pose: Pose): Point[] {
  return airwaySamples(pose).map((s) => s.point);
}

export function airflowPath(pose: Pose, lip: Point): string {
  if (pose.velum > 0.5)
    return 'M 699 973 C 703 821 663 705 655 560 L 650 374 Q 650 285 563 260 C 387 230 234 220 71 223';
  const samples = airwaySamples(pose);
  const points = samples.map((s) => s.point);
  const first = points[0]!;
  let channel = '';
  for (let i = 1; i < points.length - 1; i++) {
    const q = points[i]!,
      next = points[i + 1]!,
      t = samples[i]!.tissue;
    if (Math.hypot(q.x - t.x, q.y - t.y) < 12) {
      // Keep narrow-gap samples exact instead of rounding across a closure.
      channel += ` L ${q.x} ${q.y}`;
    } else {
      channel += ` Q ${q.x} ${q.y} ${(q.x + next.x) / 2} ${(q.y + next.y) / 2}`;
    }
  }
  const last = points[points.length - 1]!;
  // Dense channel-midpoint samples pass through each actual constriction;
  // in open regions the streamline separates from the tongue into the lumen.
  return (
    `M 699 973 C 704 896 670 835 ${first.x} ${first.y} ` +
    channel +
    ` L ${last.x} ${last.y}` +
    ` Q 120 ${(422 + lip.y) / 2} 62 ${(422 + lip.y) / 2}`
  );
}
