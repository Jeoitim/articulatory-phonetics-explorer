import type { Point, Pose } from '../domain/phonetics';
import { surface, underside, wallX, hyoidOffset } from './geometry';

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const polygonPath = (points: Point[]) =>
  'M ' +
  points.map((p) => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ') +
  ' Z';

/** Posterior tissue boundary, including the root's return to the mouth floor. */
export function posteriorTongueX(contour: Point[], y: number) {
  let x = 0;
  contour.forEach((a, i) => {
    const b = contour[(i + 1) % contour.length]!;
    if (y < Math.min(a.y, b.y) || y > Math.max(a.y, b.y)) return;
    x = Math.max(
      x,
      a.y === b.y
        ? Math.max(a.x, b.x)
        : a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y),
    );
  });
  return x;
}

/** Coupled sagittal teaching geometry, not measured muscle forces or a swallow.
 * The epiglottis is displaced by surrounding tissue. The posterior fold moves
 * toward its laryngeal face; constriction and root retraction remain independent.
 * Collision clearance is computed from actual tongue edges, never SVG order.
 */
export function laryngealGeometry(p: Pose) {
  const narrowing = clamp(p.epiglottis);
  const retraction = clamp((p.tongue.root.x - 543) / 150);
  const offset = hyoidOffset(p);
  const offsetY = offset.y;
  const contour = [...surface(p), ...underside(p)];
  const anterior: Point[] = [],
    posterior: Point[] = [];
  let translation = 0,
    slope = -18 + 62 * narrowing;
  // Nearby tissues limit posterior inclination. Preserve a whole cartilage leaf
  // and reduce tilt if a manual low-root posture leaves less pharyngeal room.
  for (let attempt = 0; attempt <= 32; attempt++) {
    slope = -18 + 62 * narrowing * (1 - attempt / 32);
    translation = 0;
    for (let i = 0; i <= 192; i++) {
      const t = i / 192;
      const y = 828 + offsetY - 96 * t;
      const nominal = 564 + 35 * retraction + slope * t;
      translation = Math.max(
        translation,
        posteriorTongueX(contour, y) + 8 - nominal,
      );
    }
    let clearance = Infinity;
    for (let i = 0; i <= 32; i++) {
      const t = i / 32,
        y = 828 + offsetY - 96 * t;
      clearance = Math.min(
        clearance,
        wallX(y) -
          (564 +
            35 * retraction +
            slope * t +
            translation +
            3 +
            7 * Math.sin(Math.PI * t)),
      );
    }
    if (clearance >= 6) break;
  }
  for (let i = 0; i <= 32; i++) {
    const t = i / 32;
    const y = 828 + offsetY - 96 * t;
    const width = 3 + 7 * Math.sin(Math.PI * t);
    const nominal = 564 + 35 * retraction + slope * t;
    // Translate the whole leaf. Do not bend cartilage around the tongue edge.
    const x = nominal + translation;
    anterior.push({ x, y });
    posterior.push({ x: x + width, y });
  }
  const epiglottis = [...anterior, ...posterior.toReversed()];
  // The lower lingual face belongs to the pre-epiglottic soft-tissue space.
  // Only the upper leaf is free beside the vallecula; it must not float.
  const attachment = { x: 548 + offset.x, y: 812 + offsetY };
  const lowerLeaf = anterior[12]!;
  const preEpiglotticPath = `M${attachment.x} ${attachment.y}
    Q${attachment.x + 30} ${attachment.y - 8} ${lowerLeaf.x} ${lowerLeaf.y}
    ${anterior
      .slice(0, 12)
      .toReversed()
      .map((q) => `L${q.x} ${q.y}`)
      .join(' ')}
    Q${attachment.x + 22} ${attachment.y + 38} ${attachment.x} ${attachment.y} Z`;
  // Contact at the lower laryngeal face, not the epiglottic tip or pharyngeal wall.
  const contact = posterior[16]!;
  const openX = Math.max(contact.x, 716);
  const gap = (openX - contact.x) * (1 - narrowing);
  const foldTip = { x: contact.x + gap, y: contact.y };
  const lowerContact = posterior[12]!;
  const lowerX = lowerContact.x + gap;
  const foldPath = `M751 ${891 + offsetY} Q${Math.max(718, lowerX + 16)} ${865 + offsetY} ${lowerX} ${lowerContact.y}
    L${foldTip.x} ${foldTip.y} Q${foldTip.x + 20} ${foldTip.y - 16} 743 ${785 + offsetY}
    Q759 ${840 + offsetY} 773 ${879 + offsetY} Z`;
  return {
    epiglottis,
    anterior,
    posterior,
    epiglottisPath: polygonPath(epiglottis),
    preEpiglotticPath,
    foldPath,
    foldTip,
    contact,
    gap,
    offsetY,
    offsetX: offset.x,
    label: posterior[24]!,
    // Exposed for numerical QA rather than hiding impossible manual postures.
    wallClearance: Math.min(...epiglottis.map((q) => wallX(q.y) - q.x)),
  };
}
