'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG control circles are two-dimensional sliders with keyboard handlers; HTML inputs cannot occupy an SVG path layer. */
import { airflowPath } from '../../engine/airflow';
import { airstreamLabels } from '../../data/non-pulmonic';
import { useId, useRef, useState } from 'react';
import type { PointerEvent, KeyboardEvent, MouseEvent } from 'react';
import type {
  Airstream,
  Pose,
  Place,
  TongueKey,
  Point,
} from '../../domain/phonetics';
import {
  tonguePath,
  tongueKeys,
  tongueLabels,
  zones,
  constrain,
  surface,
  jawPoint,
  jawPath,
  moveJaw,
  roof,
} from '../../engine/geometry';
import { anatomyPaths as paths } from '../../data/anatomy-paths';
import { articulationContact } from '../../engine/contact';
export interface Display {
  labels: boolean;
  zones: boolean;
  points: boolean;
  airflow: boolean;
}
interface Props {
  airstream?: Airstream;
  pose: Pose;
  place: Place;
  display: Display;
  onEdit?: (pose: Pose) => void;
  flow?: string;
  pressure?: number;
  overlay?: Pose;
  compact?: boolean;
  lateral?: boolean;
  animated?: boolean;
  highlightContact?: boolean;
  onAnatomyClick?: (name: string) => void;
}

type TractControl = TongueKey | 'jaw' | 'lowerLip';
type DragState = {
  key: TractControl;
  anchor: Point;
  offset: Point;
  startPose: Pose;
};
export function VocalTract({
  airstream = 'pulmonic-egressive',
  pose,
  place,
  display,
  onEdit,
  flow = 'smooth',
  pressure = 0,
  overlay,
  compact = false,
  lateral = false,
  animated = true,
  highlightContact = false,
  onAnatomyClick,
}: Props) {
  const id = useId().replaceAll(':', ''),
    ref = useRef<SVGSVGElement>(null),
    [hover, setHover] = useState(''),
    [locked, setLocked] = useState('');
  const drag = useRef<DragState | null>(null);
  const clampValue = (value: number) => Math.max(0, Math.min(1, value));
  const label = locked || hover;
  const contact = articulationContact(pose, place);
  const activePoint = contact.key ? pose.tongue[contact.key] : null;
  const passivePoint = zones.find(
    (z) => z.place === (place === 'retroflex' ? 'postalveolar' : place),
  )?.point;
  const meta = (name: string) => ({
    'data-anatomy-label': name,
    pointerEvents: 'visiblePainted' as const,
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': name,
    'aria-pressed': locked === name,
    onFocus: () => setHover(name),
    onBlur: () => setHover(''),
    onClick: (e: MouseEvent<SVGElement>) => {
      e.stopPropagation();
      setLocked(locked === name ? '' : name);
      onAnatomyClick?.(name);
    },
    onKeyDown: (e: KeyboardEvent<SVGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        setLocked(locked === name ? '' : name);
        onAnatomyClick?.(name);
      }
    },
  });
  function position(e: PointerEvent<SVGElement>) {
    const m = ref.current?.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }
  const top = surface(pose),
    nasal = pose.velum > 0.5,
    tip = pose.tongue.tip;
  const lipBase = jawPoint({ x: 90, y: 770 }, pose.jaw),
    lipRest = jawPoint({ x: 74, y: 682 }, pose.jaw),
    lipTarget =
      pose.dentalContact > 0.5
        ? { x: 153, y: 429 }
        : { x: 115 - pose.rounding * 30, y: 422 };
  const lip = {
    x: lipRest.x + (lipTarget.x - lipRest.x) * pose.lowerLip,
    y: lipRest.y + (lipTarget.y - lipRest.y) * pose.lowerLip,
  };
  const air = airflowPath(pose, lip, airstream);
  const mouthFloor = jawPoint({ x: 139, y: 745 }, pose.jaw);
  const jawControl = jawPoint({ x: 116, y: 790 }, pose.jaw);
  const upperLipPoint = { x: 116, y: 420 };
  const upperIncisorPoint = { x: 168, y: 399 };
  const labialActivePoint =
    place === 'bilabial' || place === 'labiodental' ? lip : null;
  const labialPassivePoint =
    place === 'labiodental'
      ? upperIncisorPoint
      : place === 'bilabial'
        ? upperLipPoint
        : null;
  const highlightActivePoint = activePoint ?? labialActivePoint;
  const highlightPassivePoint = passivePoint ?? labialPassivePoint;
  const oralCavity =
    'M 105 443 L ' +
    roof.map((p) => `${p.x} ${p.y}`).join(' L ') +
    ` L 610 740 L 568 828 L ${mouthFloor.x} ${mouthFloor.y} L ${lip.x + 20} ${lip.y + 29} Z`;
  const velum = nasal
    ? 'M 526 337 C 588 331 628 339 640 376 C 651 409 638 461 624 501 Q 624 535 612 536 Q 598 535 606 491 C 596 427 578 389 550 373 L 526 361 Z'
    : 'M 526 337 C 572 333 621 319 667 334 L 667 365 C 643 379 640 407 626 428 Q 622 443 614 439 Q 607 435 613 421 C 610 392 580 375 550 369 L 526 361 Z';
  function beginDrag(
    e: PointerEvent<SVGElement>,
    key: TractControl,
    anchor: Point,
  ) {
    if (!onEdit) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = position(e);
    drag.current = {
      key,
      anchor,
      startPose: structuredClone(pose),
      offset: { x: p.x - anchor.x, y: p.y - anchor.y },
    };
    setHover(
      key === 'jaw'
        ? '下颌开度 · Jaw opening'
        : key === 'lowerLip'
          ? '下唇闭合度 · Lower lip closure'
          : tongueLabels[key],
    );
  }
  function moveDrag(e: PointerEvent<SVGElement>, key: TractControl) {
    const current = drag.current;
    if (!current || current.key !== key || !onEdit) return;
    e.preventDefault();
    const p = position(e);
    if (key === 'jaw') {
      const nextJaw = clampValue(
        current.startPose.jaw +
          (p.y - current.offset.y - current.anchor.y) / 180,
      );
      onEdit(moveJaw(current.startPose, nextJaw));
      return;
    }
    if (key === 'lowerLip') {
      const nextLowerLip = clampValue(
        current.startPose.lowerLip -
          (p.y - current.offset.y - current.anchor.y) / 230,
      );
      onEdit({ ...current.startPose, lowerLip: nextLowerLip });
      return;
    }
    onEdit(
      constrain(
        current.startPose,
        key,
        {
          x: p.x - current.offset.x,
          y: p.y - current.offset.y,
        },
        !e.shiftKey,
      ),
    );
  }
  function endDrag() {
    drag.current = null;
    setHover('');
  }
  function nudge(key: TractControl, delta: Point) {
    if (!onEdit) return;
    if (key === 'jaw') {
      onEdit(moveJaw(pose, clampValue(pose.jaw + delta.y / 30)));
    } else if (key === 'lowerLip') {
      onEdit({
        ...pose,
        lowerLip: clampValue(pose.lowerLip - delta.y / 30),
      });
    } else {
      onEdit(
        constrain(
          pose,
          key,
          {
            x: pose.tongue[key].x + delta.x,
            y: pose.tongue[key].y + delta.y,
          },
          false,
        ),
      );
    }
  }
  return (
    <div
      className={
        'tract-wrap atlas-tract ' +
        (compact ? 'compact ' : '') +
        (animated ? '' : 'motion-still')
      }
    >
      <svg
        ref={ref}
        viewBox="-35 -18 890 1058"
        className="tract"
        data-interactive={display.points && onEdit ? 'true' : undefined}
        aria-label="依照教材参考图分层的发音器官矢状面，面向左侧"
        onPointerMove={(e) => {
          if (drag.current) return;
          const target = e.target as Element;
          setHover(
            target
              .closest('[data-anatomy-label]')
              ?.getAttribute('data-anatomy-label') || '',
          );
        }}
        onPointerLeave={() => setHover('')}
      >
        <defs>
          <linearGradient id={id + 'tissue'} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="light-dark(#eedbd0, #68544b)" />
            <stop offset="1" stopColor="light-dark(#d9b6a6, #493831)" />
          </linearGradient>
          <linearGradient id={id + 'muscle'} x1="0" y1="0" x2=".7" y2="1">
            <stop stopColor="light-dark(#d89888, #a57166)" />
            <stop offset="1" stopColor="light-dark(#bc776e, #714a46)" />
          </linearGradient>
          <linearGradient id={id + 'bone'}>
            <stop stopColor="light-dark(#faf4e7, #a09279)" />
            <stop offset="1" stopColor="light-dark(#e6d5bb, #77664e)" />
          </linearGradient>
          <pattern
            id={id + 'bonehatch'}
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(32)"
          >
            <path
              d="M0 0V10"
              stroke="light-dark(#bba687, #b9a284)"
              strokeWidth="1"
              opacity=".34"
            />
          </pattern>
          <clipPath id={id + 'bounds'}>
            <rect x="0" y="0" width="800" height="1000" rx="3" />
          </clipPath>
          <clipPath id={id + 'tongueclip'}>
            <path d={tonguePath(pose)} />
          </clipPath>
          <marker
            id={id + 'arrow'}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path
              d="M1 1L9 5L1 9"
              fill="none"
              stroke="light-dark(#4e91a7, #83bdd1)"
              strokeWidth="1.5"
            />
          </marker>
        </defs>
        <g
          clipPath={'url(#' + id + 'bounds)'}
          stroke="light-dark(#96776a, #b29484)"
          strokeWidth="2.4"
          strokeLinejoin="round"
          pointerEvents="none"
        >
          <rect
            x="0"
            y="0"
            width="800"
            height="1000"
            fill="light-dark(#faf8f2, #202722)"
            stroke="none"
          />
          {/* Cavity hit regions are beneath the anatomy: tissue, teeth and
              the moving tongue occlude them through normal SVG hit testing. */}
          <path
            {...meta('鼻腔 · Nasal cavity')}
            d="M 71 230 Q 83 154 171 62 Q 255 12 364 19 Q 465 54 535 66 Q 543 120 526 180 Q 534 220 605 249 L 610 327 Q 360 324 217 275 L 110 254 Z"
            fill="transparent"
            stroke="none"
          />
          <path
            {...meta('口腔 · Oral cavity')}
            d={oralCavity}
            fill="transparent"
            stroke="none"
          />
          <path
            {...meta('咽腔 · Pharyngeal cavity')}
            d="M 610 260 Q 674 280 674 343 L 667 469 C 671 577 706 683 743 785 L 750 890 L 757 932 L 637 976 L 600 910 L 568 828 L 610 740 Z"
            fill="transparent"
            stroke="none"
          />
          <path
            {...meta(
              '颅面组织与咽后壁 · Craniofacial tissue / posterior pharyngeal wall',
            )}
            d={paths.head}
            fill={'url(#' + id + 'tissue)'}
          />
          <path
            d="M205 0 C253 6 300 1 345 7 Q432 48 489 40 L510 56 Q460 60 420 53 Q325 21 299 31 Q215 45 177 76 L120 135"
            fill="none"
            stroke="light-dark(#f8f0e5, #8e7b69)"
            strokeWidth="16"
            opacity=".7"
          />
          <path
            d="M702 160 C736 257 734 370 731 457 Q735 600 779 736"
            fill="none"
            stroke="light-dark(#c29e8c, #a78672)"
            strokeWidth="2"
            opacity=".65"
          />
          <path
            d="M757 280 L793 277 M750 337 L793 335 M748 394 L793 391 M749 451 L793 451 M754 511 L793 513 M765 572 L796 580"
            stroke="light-dark(#bda28e, #927963)"
            opacity=".4"
            strokeWidth="8"
          />
          <g
            {...meta('鼻腔与鼻甲 · Nasal cavity / conchae')}
            fill="none"
            stroke="light-dark(#c6aa96, #947a65)"
            strokeWidth="5"
            strokeLinecap="round"
          >
            <path d="M123 193 C196 123 292 95 377 115 Q419 126 391 143 C366 157 275 143 248 163" />
            <path d="M154 217 C253 181 372 182 450 204 Q477 220 441 227 C368 235 297 217 256 227" />
            <path d="M329 71 Q385 71 414 95" strokeWidth="3" />
          </g>
          <path
            {...meta(
              '上颌、硬腭与齿龈 · Maxilla / hard palate / alveolar ridge',
            )}
            d={paths.palate}
            fill={'url(#' + id + 'tissue)'}
          />
          <path
            d="M190 299 C295 332 374 333 449 339 L526 350 L526 360 C457 347 393 350 344 341 Q291 326 265 350 L241 373 L197 382 Z"
            fill={'url(#' + id + 'bone)'}
            stroke="light-dark(#c9b89e, #b4a082)"
            strokeWidth="1.6"
          />
          <path
            d="M190 299 C295 332 374 333 449 339 L526 350 L526 360 C457 347 393 350 344 341 Q291 326 265 350 L241 373 L197 382 Z"
            fill={'url(#' + id + 'bonehatch)'}
            stroke="none"
          />
          <path
            {...meta('上门齿 · Upper incisor')}
            d={paths.upperTooth}
            fill="light-dark(#fffdf6, #d0c7b4)"
            stroke="light-dark(#a99e8c, #9f9179)"
            strokeWidth="2.6"
          />
          <path
            d="M178 366 Q159 396 154 416"
            fill="none"
            stroke="light-dark(#ddd0b9, #b5a286)"
            strokeWidth="2"
          />
          <path
            {...meta('软腭与小舌 · Velum / uvula')}
            d={velum
              .replace(
                '614 439',
                '' + (614 + pose.uvula * 10) + ' ' + (439 - pose.uvula * 14),
              )
              .replace('613 421', '' + (613 + pose.uvula * 7) + ' 421')}
            fill="light-dark(#d59b8a, #a87967)"
            stroke="light-dark(#a87869, #c1967e)"
          />
          <path
            d={
              nasal ? 'M552 349 Q619 357 623 405' : 'M552 349 Q614 343 647 348'
            }
            fill="none"
            stroke="light-dark(#ecc5b1, #ceaa90)"
            strokeWidth="3"
          />
          <g {...meta('下颌与口底 · Mandible / floor of mouth')}>
            <path
              d={jawPath(paths.floor, pose.jaw)}
              fill={'url(#' + id + 'tissue)'}
            />
            <path
              d={jawPath(
                'M159 757 Q217 820 306 828 Q382 832 433 860 C356 856 298 883 224 887 Q153 906 127 838 L126 786 Z',
                pose.jaw,
              )}
              fill={'url(#' + id + 'bone)'}
              stroke="light-dark(#beaa8d, #bca17d)"
            />
            <path
              d={jawPath(
                'M159 757 Q217 820 306 828 Q382 832 433 860 C356 856 298 883 224 887 Q153 906 127 838 L126 786 Z',
                pose.jaw,
              )}
              fill={'url(#' + id + 'bonehatch)'}
              stroke="none"
            />
            <path
              {...meta('下门齿 · Lower incisor')}
              d={jawPath(paths.lowerTooth, pose.jaw)}
              fill="light-dark(#fffdf6, #d0c7b4)"
              stroke="light-dark(#a99e8c, #9f9179)"
            />
            <path
              {...meta('下唇 · Lower lip')}
              d={
                'M ' +
                (lipBase.x - 8) +
                ' ' +
                (lipBase.y + 8) +
                ' C ' +
                (lip.x - 27) +
                ' ' +
                (lip.y + 36) +
                ' ' +
                (lip.x - 23) +
                ' ' +
                (lip.y + 6) +
                ' ' +
                lip.x +
                ' ' +
                lip.y +
                ' Q ' +
                (lip.x + 17) +
                ' ' +
                (lip.y + 3) +
                ' ' +
                (lip.x + 20) +
                ' ' +
                (lip.y + 29) +
                ' L ' +
                (lipBase.x + 35) +
                ' ' +
                (lipBase.y + 15) +
                ' Z'
              }
              fill="light-dark(#c88c7e, #9c6c5e)"
            />
          </g>
          <path
            {...meta('舌体：内在肌与外在肌协同形变 · Tongue')}
            d={tonguePath(pose)}
            fill={'url(#' + id + 'muscle)'}
            stroke="light-dark(#a2665e, #ce9686)"
            strokeWidth="3"
          />
          <g
            clipPath={'url(#' + id + 'tongueclip)'}
            pointerEvents="none"
            fill="none"
            stroke="light-dark(#9e645c, #e3b4a4)"
            opacity=".22"
            strokeWidth="1.7"
          >
            {top
              .filter((_, i) => i % 5 === 0)
              .map((p, i) => (
                <path
                  key={i}
                  d={
                    'M 234 761 Q ' +
                    (p.x * 0.7 + 90) +
                    ' ' +
                    (p.y * 0.4 + 425) +
                    ' ' +
                    p.x +
                    ' ' +
                    p.y
                  }
                />
              ))}
          </g>
          <path
            d={
              'M ' +
              (tip.x + 7) +
              ' ' +
              (tip.y + 20) +
              ' Q ' +
              pose.tongue.blade.x +
              ' ' +
              (pose.tongue.blade.y + 25) +
              ' ' +
              pose.tongue.front.x +
              ' ' +
              (pose.tongue.front.y + 23)
            }
            stroke="light-dark(#edbba8, #e1b19a)"
            strokeWidth="2"
            opacity=".55"
            fill="none"
          />
          {overlay && (
            <path
              d={tonguePath(overlay)}
              fill="light-dark(#4e91a710, #83bdd120)"
              stroke="light-dark(#4e91a7, #83bdd1)"
              strokeWidth="4"
              strokeDasharray="11 7"
            />
          )}
          <path
            {...meta('会厌 · Epiglottis')}
            transform={'rotate(' + pose.epiglottis * 43 + ' 568 828)'}
            d="M550 732 Q566 732 568 782 L568 828 Q556 811 558 790 Q561 766 550 745 Q545 735 550 732 Z"
            fill="light-dark(#d9b99d, #95816a)"
            stroke="light-dark(#ab9076, #b99a79)"
          />
          {pose.epiglottis > 0.1 && (
            <g
              {...meta('会厌区狭窄 · Epilaryngeal constriction (schematic)')}
              fill="light-dark(#d59b8a, #a87967)"
              stroke="light-dark(#a87869, #c1967e)"
            >
              <path
                d={
                  'M 622 837 Q ' +
                  (640 + pose.epiglottis * 35) +
                  ' 795 ' +
                  (649 + pose.epiglottis * 48) +
                  ' 799 L ' +
                  (645 + pose.epiglottis * 48) +
                  ' 815 Q 642 824 640 851 Z'
                }
              />
              <path
                d={
                  'M 740 787 Q ' +
                  (721 - pose.epiglottis * 25) +
                  ' 790 ' +
                  (711 - pose.epiglottis * 15) +
                  ' 803 L ' +
                  (714 - pose.epiglottis * 15) +
                  ' 816 Q 743 821 751 837 Z'
                }
              />
            </g>
          )}
          <path
            {...meta('舌骨 · Hyoid bone')}
            d="M514 838 Q533 827 555 835 L563 844 Q542 854 521 849 Z"
            fill="light-dark(#f3e6d0, #afa186)"
            stroke="light-dark(#b7a17f, #c1a27b)"
          />
          <g transform={`translate(0 ${pose.larynx * 25})`}>
            <path
              {...meta('喉部 · Larynx')}
              d={paths.posteriorLarynx}
              fill="light-dark(#dfbaa5, #816452)"
            />
            <path
              {...meta('声门 · Glottis')}
              d={paths.glottis}
              fill={
                pose.glottis < 0.05
                  ? 'light-dark(#c48d7c, #a97662)'
                  : 'light-dark(#fcf8ed, #202722)'
              }
              stroke="light-dark(#aa8c74, #bf9c7e)"
            />
            <path
              d="M658 959 Q706 943 740 941"
              stroke={
                pose.glottis < 0.05
                  ? 'light-dark(#8c6256, #ce9987)'
                  : 'light-dark(#73a0a9, #91bec7)'
              }
              strokeWidth={pose.glottis < 0.05 ? 3 : 1.5}
              fill="none"
            />
          </g>
        </g>
        {airstream !== 'pulmonic-egressive' && (
          <g
            pointerEvents="none"
            fill="light-dark(#4e91a7, #83bdd1)"
            fontSize="19"
          >
            <text
              x={airstream === 'click' ? 480 : 600}
              y={airstream === 'click' ? 315 : 890}
            >
              {airstream === 'click'
                ? '后部闭塞'
                : airstream === 'ejective'
                  ? '↑ 喉部上升'
                  : '↓ 喉部下降'}
            </text>
          </g>
        )}
        {pressure > 0 && (
          <ellipse
            pointerEvents="none"
            cx="441"
            cy="440"
            rx="98"
            ry="51"
            fill={
              airstream === 'implosive' || airstream === 'click'
                ? 'light-dark(#4e91a7, #83bdd1)'
                : 'light-dark(#cda759, #d5b66d)'
            }
            opacity={pressure * 0.18}
          />
        )}
        {display.airflow && flow !== 'off' && (
          <g
            fill="none"
            stroke="light-dark(#4e91a7, #83bdd1)"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity=".8"
            pointerEvents="none"
          >
            <path d={air} strokeWidth="3" markerEnd={'url(#' + id + 'arrow)'} />
            <path
              d={air}
              className="air-dashes"
              strokeWidth={flow === 'burst' ? 7 : 4}
              strokeDasharray="3 39"
            />
            {flow === 'turbulent' && airstream === 'pulmonic-egressive' && (
              <path
                className="turbulence"
                d={
                  place === 'glottal'
                    ? 'M696 957q-9-7 0-17t0-17'
                    : place === 'pharyngeal'
                      ? 'M689 694q-10-8 0-18t0-18'
                      : 'M130 ' + (tip.y - 14) + ' q-15-12-24 1t-23-2'
                }
                strokeWidth="2"
              />
            )}
          </g>
        )}
        {highlightContact && highlightActivePoint && highlightPassivePoint && (
          <g
            className="articulation-highlight"
            pointerEvents="none"
            aria-label={`${contact.active}接近${contact.passive}`}
          >
            <path
              d={`M${highlightActivePoint.x} ${highlightActivePoint.y} L${highlightPassivePoint.x} ${highlightPassivePoint.y}`}
              stroke="var(--tract-contact)"
              strokeWidth="3"
              strokeDasharray="5 7"
              fill="none"
            />
            <circle
              cx={highlightPassivePoint.x}
              cy={highlightPassivePoint.y}
              r="19"
              fill="none"
              stroke="var(--tract-contact)"
              strokeWidth="6"
            />
            <circle
              cx={highlightActivePoint.x}
              cy={highlightActivePoint.y}
              r="13"
              fill="var(--tract-active)"
              stroke="var(--tract-contact)"
              strokeWidth="3"
            />
          </g>
        )}
        {display.zones && place === 'alveolo-palatal' && (
          <path
            d="M290 354 Q350 343 410 350"
            fill="none"
            stroke="light-dark(#bc954f, #d9b975)"
            strokeWidth="18"
            opacity=".16"
            pointerEvents="none"
          />
        )}
        {display.zones &&
          zones
            .filter((z) => z.place !== 'retroflex')
            .map((z) => (
              <g key={z.place} pointerEvents="none">
                <circle
                  cx={z.point.x}
                  cy={z.point.y}
                  r={
                    (place === 'retroflex' ? 'postalveolar' : place) === z.place
                      ? 23
                      : 11
                  }
                  fill={
                    (place === 'retroflex' ? 'postalveolar' : place) === z.place
                      ? 'light-dark(#bc954f25, #d9b97535)'
                      : 'light-dark(#bc954f08, #d9b97510)'
                  }
                  stroke={
                    (place === 'retroflex' ? 'postalveolar' : place) === z.place
                      ? 'light-dark(#b38c3f, #e3c483)'
                      : 'light-dark(#bda977, #a99c77)'
                  }
                  strokeWidth="1.8"
                  strokeDasharray={
                    (place === 'retroflex' ? 'postalveolar' : place) === z.place
                      ? undefined
                      : '3 5'
                  }
                />
              </g>
            ))}
        {display.labels && !compact && (
          <g
            className="anatomy-callouts"
            pointerEvents="none"
            fontSize="20"
            fontFamily="Segoe UI,Microsoft YaHei,sans-serif"
            fill="light-dark(#817568, #dacbb5)"
            stroke="light-dark(#afa38d, #ad9e87)"
            strokeWidth="1.5"
          >
            <path
              d="M335 197L385 144H490 M360 335L397 280H480 M642 380L713 344H786 M421 648L356 684H279 M693 647L741 615H796 M564 799L647 794"
              fill="none"
            />
            <text x="385" y="133" stroke="none">
              鼻腔
            </text>
            <text x="399" y="271" stroke="none">
              硬腭
            </text>
            <text x="716" y="334" stroke="none">
              软腭
            </text>
            <text x="272" y="711" stroke="none">
              舌体
            </text>
            <text x="746" y="605" stroke="none">
              咽腔
            </text>
            <text x="648" y="787" stroke="none">
              会厌
            </text>
            <text
              x={airstream === 'pulmonic-egressive' ? 648 : 400}
              y="1025"
              stroke="none"
            >
              {airstream === 'pulmonic-egressive'
                ? '↑ 肺部呼气'
                : airstreamLabels[airstream]}
            </text>
          </g>
        )}
        {display.points &&
          onEdit &&
          tongueKeys.map((key) => (
            <circle
              key={key}
              role="slider"
              aria-label={tongueLabels[key]}
              data-anatomy-label={tongueLabels[key]}
              aria-valuemin={100}
              aria-valuemax={720}
              aria-valuenow={Math.round(pose.tongue[key].x)}
              aria-valuetext={
                '横向 ' +
                Math.round(pose.tongue[key].x) +
                '，纵向 ' +
                Math.round(pose.tongue[key].y)
              }
              tabIndex={0}
              className="tongue-control"
              cx={pose.tongue[key].x}
              cy={pose.tongue[key].y}
              r="10"
              fill="light-dark(#fff5dd, #443b29)"
              stroke="light-dark(#a98a47, #e3c483)"
              strokeWidth="3"
              onPointerDown={(e) => beginDrag(e, key, pose.tongue[key])}
              onPointerMove={(e) => moveDrag(e, key)}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
              onFocus={() => setHover(tongueLabels[key])}
              onBlur={() => setHover('')}
              onKeyDown={(e) => {
                const ds: Record<string, number[]> = {
                  ArrowLeft: [-5, 0],
                  ArrowRight: [5, 0],
                  ArrowUp: [0, -5],
                  ArrowDown: [0, 5],
                };
                const d = ds[e.key];
                if (d) {
                  e.preventDefault();
                  nudge(key, { x: d[0]!, y: d[1]! });
                }
              }}
            >
              <title>{tongueLabels[key] + ' · 拖动时其余舌体随之联动'}</title>
            </circle>
          ))}
        {display.points && onEdit && (
          <g className="organ-controls">
            <circle
              role="slider"
              aria-label="下唇闭合度 · Lower lip closure"
              data-anatomy-label="下唇闭合度 · Lower lip closure"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={pose.lowerLip}
              aria-valuetext={`下唇闭合度 ${Math.round(pose.lowerLip * 100)}%`}
              tabIndex={0}
              className="organ-control active-control"
              cx={lip.x}
              cy={lip.y}
              r="11"
              onPointerDown={(e) => beginDrag(e, 'lowerLip', lip)}
              onPointerMove={(e) => moveDrag(e, 'lowerLip')}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
              onFocus={() => setHover('下唇闭合度 · Lower lip closure')}
              onBlur={() => setHover('')}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  nudge('lowerLip', {
                    x: 0,
                    y: e.key === 'ArrowUp' ? -5 : 5,
                  });
                }
              }}
            >
              <title>下唇闭合度 · Lower lip closure</title>
            </circle>
            <circle
              role="slider"
              aria-label="下颌开度 · Jaw opening"
              data-anatomy-label="下颌开度 · Jaw opening"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={pose.jaw}
              aria-valuetext={`下颌开度 ${Math.round(pose.jaw * 100)}%`}
              tabIndex={0}
              className="organ-control active-control"
              cx={jawControl.x}
              cy={jawControl.y}
              r="11"
              onPointerDown={(e) => beginDrag(e, 'jaw', jawControl)}
              onPointerMove={(e) => moveDrag(e, 'jaw')}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onLostPointerCapture={endDrag}
              onFocus={() => setHover('下颌开度 · Jaw opening')}
              onBlur={() => setHover('')}
              onKeyDown={(e) => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                  e.preventDefault();
                  nudge('jaw', {
                    x: 0,
                    y: e.key === 'ArrowUp' ? -5 : 5,
                  });
                }
              }}
            >
              <title>下颌开度 · Jaw opening</title>
            </circle>
            <circle
              {...meta('上唇 · Upper lip')}
              className="organ-control passive-control"
              cx={upperLipPoint.x}
              cy={upperLipPoint.y}
              r="13"
              fill="none"
              stroke="var(--tract-passive)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
            <circle
              {...meta('上门齿 · Upper incisor')}
              className="organ-control passive-control"
              cx={upperIncisorPoint.x}
              cy={upperIncisorPoint.y}
              r="13"
              fill="none"
              stroke="var(--tract-passive)"
              strokeWidth="2.5"
              strokeDasharray="4 4"
            />
          </g>
        )}
      </svg>
      {label && (
        <div className="tract-label" style={{ pointerEvents: 'none' }}>
          {label}
          <span>
            {locked ? '点击或按 Enter 解锁' : '点击或按 Enter 固定标签'}
          </span>
        </div>
      )}
      {lateral && <div className="lateral-note">侧向通道请见俯视图</div>}
    </div>
  );
}
