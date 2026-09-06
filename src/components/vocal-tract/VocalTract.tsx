'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- SVG control circles are two-dimensional sliders with keyboard handlers; HTML inputs cannot occupy an SVG path layer. */
import { articulationContact } from '../../engine/contact';
import { useId, useRef, useState } from 'react';
import type { PointerEvent, KeyboardEvent } from 'react';
import type { Pose, Place, TongueKey, Point } from '../../domain/phonetics';
import {
  tonguePath,
  tongueKeys,
  tongueLabels,
  zones,
  constrain,
  surface,
  jawPoint,
  jawPath,
} from '../../engine/geometry';
import { anatomyPaths as paths } from '../../data/anatomy-paths';
import { placeLabels } from '../../data/labels';
export interface Display {
  labels: boolean;
  zones: boolean;
  points: boolean;
  airflow: boolean;
}
interface Props {
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
}
export function VocalTract({
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
}: Props) {
  const id = useId().replaceAll(':', ''),
    ref = useRef<SVGSVGElement>(null),
    [hover, setHover] = useState(''),
    [locked, setLocked] = useState('');
  const drag = useRef<{ key: TongueKey; offset: Point } | null>(null);
  const label = locked || hover;
  const contact = articulationContact(pose, place);
  const meta = (name: string) => ({
    role: 'button' as const,
    tabIndex: 0,
    'aria-label': name,
    'aria-pressed': locked === name,
    onFocus: () => setHover(name),
    onBlur: () => setHover(''),
    onPointerEnter: () => setHover(name),
    onPointerLeave: () => setHover(''),
    onClick: () => setLocked(locked === name ? '' : name),
    onKeyDown: (e: KeyboardEvent<SVGElement>) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setLocked(locked === name ? '' : name);
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
  const oral =
    'M 699 973 C 704 896 688 823 655 757 Q 638 675 ' +
    (top[top.length - 1]!.x + 35) +
    ' ' +
    (top[top.length - 1]!.y - 10) +
    ' L ' +
    [...top]
      .reverse()
      .filter((_, i) => i % 4 === 0)
      .map((p) => p.x + 3 + ' ' + (p.y - 11))
      .join(' L ') +
    ' Q 143 ' +
    (422 + lip.y) / 2 +
    ' 62 ' +
    (422 + lip.y) / 2;
  const air = nasal
    ? 'M 699 973 C 703 821 663 705 655 560 L 650 374 Q 650 285 563 260 C 387 230 234 220 71 223'
    : oral;
  const velum = nasal
    ? 'M 526 337 C 588 331 628 339 640 376 C 651 409 638 461 624 501 Q 624 535 612 536 Q 598 535 606 491 C 596 427 578 389 550 373 L 526 361 Z'
    : 'M 526 337 C 572 333 621 319 667 334 L 667 365 C 643 379 640 407 626 428 Q 622 443 614 439 Q 607 435 613 421 C 610 392 580 375 550 369 L 526 361 Z';
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
        aria-label="依照教材参考图分层的发音器官矢状面，面向左侧"
      >
        <defs>
          <linearGradient id={id + 'tissue'} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#eedbd0" />
            <stop offset="1" stopColor="#d9b6a6" />
          </linearGradient>
          <linearGradient id={id + 'muscle'} x1="0" y1="0" x2=".7" y2="1">
            <stop stopColor="#d89888" />
            <stop offset="1" stopColor="#bc776e" />
          </linearGradient>
          <linearGradient id={id + 'bone'}>
            <stop stopColor="#faf4e7" />
            <stop offset="1" stopColor="#e6d5bb" />
          </linearGradient>
          <pattern
            id={id + 'bonehatch'}
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(32)"
          >
            <path d="M0 0V10" stroke="#bba687" strokeWidth="1" opacity=".34" />
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
              stroke="#4e91a7"
              strokeWidth="1.5"
            />
          </marker>
        </defs>
        <g
          clipPath={'url(#' + id + 'bounds)'}
          stroke="#96776a"
          strokeWidth="2.4"
          strokeLinejoin="round"
        >
          <rect
            x="0"
            y="0"
            width="800"
            height="1000"
            fill="#faf8f2"
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
            stroke="#f8f0e5"
            strokeWidth="16"
            opacity=".7"
          />
          <path
            d="M702 160 C736 257 734 370 731 457 Q735 600 779 736"
            fill="none"
            stroke="#c29e8c"
            strokeWidth="2"
            opacity=".65"
          />
          <path
            d="M757 280 L793 277 M750 337 L793 335 M748 394 L793 391 M749 451 L793 451 M754 511 L793 513 M765 572 L796 580"
            stroke="#bda28e"
            opacity=".4"
            strokeWidth="8"
          />
          <g
            {...meta('鼻腔与鼻甲 · Nasal cavity / conchae')}
            fill="none"
            stroke="#c6aa96"
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
            stroke="#c9b89e"
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
            fill="#fffdf6"
            stroke="#a99e8c"
            strokeWidth="2.6"
          />
          <path
            d="M178 366 Q159 396 154 416"
            fill="none"
            stroke="#ddd0b9"
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
            fill="#d59b8a"
            stroke="#a87869"
          />
          <path
            d={
              nasal ? 'M552 349 Q619 357 623 405' : 'M552 349 Q614 343 647 348'
            }
            fill="none"
            stroke="#ecc5b1"
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
              stroke="#beaa8d"
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
              fill="#fffdf6"
              stroke="#a99e8c"
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
              fill="#c88c7e"
            />
          </g>
          <path
            {...meta('舌体：内在肌与外在肌协同形变 · Tongue')}
            d={tonguePath(pose)}
            fill={'url(#' + id + 'muscle)'}
            stroke="#a2665e"
            strokeWidth="3"
          />
          <g
            clipPath={'url(#' + id + 'tongueclip)'}
            fill="none"
            stroke="#9e645c"
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
            stroke="#edbba8"
            strokeWidth="2"
            opacity=".55"
            fill="none"
          />
          {overlay && (
            <path
              d={tonguePath(overlay)}
              fill="#4e91a710"
              stroke="#4e91a7"
              strokeWidth="4"
              strokeDasharray="11 7"
            />
          )}
          <path
            {...meta('会厌 · Epiglottis')}
            transform={'rotate(' + pose.epiglottis * 43 + ' 568 828)'}
            d="M550 732 Q566 732 568 782 L568 828 Q556 811 558 790 Q561 766 550 745 Q545 735 550 732 Z"
            fill="#d9b99d"
            stroke="#ab9076"
          />
          {pose.epiglottis > 0.1 && (
            <g
              {...meta('会厌区狭窄 · Epilaryngeal constriction (schematic)')}
              fill="#d59b8a"
              stroke="#a87869"
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
            fill="#f3e6d0"
            stroke="#b7a17f"
          />
          <path
            {...meta('喉部 · Larynx')}
            d={paths.posteriorLarynx}
            fill="#dfbaa5"
          />
          <path
            {...meta('声门 · Glottis')}
            d={paths.glottis}
            fill={pose.glottis < 0.05 ? '#c48d7c' : '#fcf8ed'}
            stroke="#aa8c74"
          />
          <path
            d="M658 959 Q706 943 740 941"
            stroke={pose.glottis < 0.05 ? '#8c6256' : '#73a0a9'}
            strokeWidth={pose.glottis < 0.05 ? 3 : 1.5}
            fill="none"
          />
        </g>
        {pressure > 0 && (
          <ellipse
            cx="441"
            cy="440"
            rx="98"
            ry="51"
            fill="#cda759"
            opacity={pressure * 0.18}
          />
        )}
        {display.airflow && flow !== 'off' && (
          <g fill="none" stroke="#4e91a7" strokeLinecap="round" opacity=".8">
            <path d={air} strokeWidth="3" markerEnd={'url(#' + id + 'arrow)'} />
            <path
              d={air}
              className="air-dashes"
              strokeWidth={flow === 'burst' ? 7 : 4}
              strokeDasharray="3 39"
            />
            {flow === 'turbulent' && (
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
        {display.zones &&
          zones
            .filter((z) => z.place !== 'retroflex')
            .map((z) => (
              <g
                key={z.place}
                {...meta(placeLabels[z.place] + ' · ' + z.place)}
              >
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
                      ? '#bc954f25'
                      : '#bc954f08'
                  }
                  stroke={
                    (place === 'retroflex' ? 'postalveolar' : place) === z.place
                      ? '#b38c3f'
                      : '#bda977'
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
            fontSize="20"
            fontFamily="Segoe UI,Microsoft YaHei,sans-serif"
            fill="#817568"
            stroke="#afa38d"
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
            <text x="648" y="1025" stroke="none">
              ↑ 肺部呼气
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
              fill="#fff5dd"
              stroke="#a98a47"
              strokeWidth="3"
              onPointerDown={(e) => {
                e.preventDefault();
                e.currentTarget.setPointerCapture(e.pointerId);
                const p = position(e);
                drag.current = {
                  key,
                  offset: {
                    x: p.x - pose.tongue[key].x,
                    y: p.y - pose.tongue[key].y,
                  },
                };
                setHover(tongueLabels[key]);
              }}
              onPointerMove={(e) => {
                if (!drag.current || drag.current.key !== key) return;
                const p = position(e);
                onEdit(
                  constrain(
                    pose,
                    key,
                    {
                      x: p.x - drag.current.offset.x,
                      y: p.y - drag.current.offset.y,
                    },
                    !e.shiftKey,
                  ),
                );
              }}
              onPointerUp={() => {
                drag.current = null;
                setHover('');
              }}
              onPointerCancel={() => {
                drag.current = null;
              }}
              onLostPointerCapture={() => {
                drag.current = null;
              }}
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
                  onEdit(
                    constrain(
                      pose,
                      key,
                      {
                        x: pose.tongue[key].x + d[0]!,
                        y: pose.tongue[key].y + d[1]!,
                      },
                      !e.shiftKey,
                    ),
                  );
                }
              }}
            >
              <title>{tongueLabels[key] + ' · 拖动时其余舌体随之联动'}</title>
            </circle>
          ))}
      </svg>
      <div className="tract-label">
        {label || contact.active + ' — ' + contact.passive}
        {label && (
          <span>
            {locked ? '点击或按 Enter 解锁' : '点击或按 Enter 固定标签'}
          </span>
        )}
      </div>
      {lateral && <div className="lateral-note">侧向通道请见俯视图</div>}
    </div>
  );
}
