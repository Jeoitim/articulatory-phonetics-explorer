'use client';
/* oxlint-disable jsx-a11y/prefer-tag-over-role -- Inline SVG is an accessible dynamic anatomical diagram, not an external image. */
import { useEffect, useId, useState } from 'react';
import {
  phonationFrame,
  phonationControlFrame,
  phonationLabels,
} from '../../engine/phonation';
import type { Phonation, PhonationControls } from '../../engine/phonation';

export function VocalFolds({
  mode = 'modal',
  animated = true,
  tension,
  controls,
  description,
  open = false,
  closed = false,
  detailed = false,
}: {
  mode?: Phonation;
  animated?: boolean;
  tension?: number;
  controls?: PhonationControls;
  description?: string;
  open?: boolean;
  closed?: boolean;
  detailed?: boolean;
}) {
  const id = useId().replaceAll(':', '');
  const [phase, setPhase] = useState(0.25);
  useEffect(() => {
    if (!animated || open || closed) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let handle = 0;
    const tick = (now: number) => {
      setPhase((now % 2000) / 2000);
      handle = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(handle);
      if (!media.matches) handle = requestAnimationFrame(tick);
    };
    update();
    media.addEventListener('change', update);
    return () => {
      cancelAnimationFrame(handle);
      media.removeEventListener('change', update);
    };
  }, [animated, open, closed]);
  const f = controls
    ? phonationControlFrame(controls, phase)
    : phonationFrame(mode, phase, tension);
  const gap = closed ? 0 : open ? 37 : f.gap;
  const back = closed ? 0 : open ? 28 : f.posteriorGap;
  const vocalProcessGap = gap * 0.25 + back * 0.08;
  const top = 94 - (f.length - 160) / 2;
  const bottom = top + f.length;
  const width = f.thickness;
  const label = closed
    ? '声门闭塞'
    : open
      ? '声门开放'
      : (description ?? phonationLabels[mode]);
  return (
    <svg
      className={detailed ? 'vocal-folds-large' : 'vocal-folds-small'}
      viewBox="0 0 400 350"
      role="img"
      aria-label={`声带俯视图：${label}；前端在上，后端在下；慢速教学示意`}
      data-phonation={controls ? 'custom' : mode}
    >
      <defs>
        <radialGradient id={`${id}tissue`}>
          <stop stopColor="#e8ad9d" />
          <stop offset=".68" stopColor="#b96e68" />
          <stop offset="1" stopColor="#643c3d" />
        </radialGradient>
        <linearGradient id={`${id}fold`}>
          <stop stopColor="#ccaaa0" />
          <stop offset=".55" stopColor="#fff1da" />
          <stop offset="1" stopColor="#d2b9a1" />
        </linearGradient>
      </defs>
      <path
        d="M200 37 C109 40 66 139 84 247 Q100 320 200 315 Q300 320 316 247 C334 139 291 40 200 37Z"
        fill={`url(#${id}tissue)`}
        stroke="#9d6b60"
        strokeWidth="2"
      />
      <path
        d="M200 67 C145 94 123 205 142 269 Q200 303 258 269 C277 205 255 94 200 67Z"
        fill="#301e22"
      />
      <path
        d={`M200 ${top} C${169 - width} 125 ${158 - width} 212 ${182 - back - width} ${bottom + 8} Q${190 - back} ${bottom + 20} ${200 - back} ${bottom} L${200 - vocalProcessGap} ${bottom - 28} Q${200 - gap * 2} ${top + f.length * 0.52} 200 ${top}Z`}
        fill={`url(#${id}fold)`}
        stroke="#ae8275"
        strokeWidth="1.5"
      />
      <path
        d={`M200 ${top} C${231 + width} 125 ${242 + width} 212 ${218 + back + width} ${bottom + 8} Q${210 + back} ${bottom + 20} ${200 + back} ${bottom} L${200 + vocalProcessGap} ${bottom - 28} Q${200 + gap * 2} ${top + f.length * 0.52} 200 ${top}Z`}
        fill={`url(#${id}fold)`}
        stroke="#ae8275"
        strokeWidth="1.5"
      />
      <path
        d={`M${200 - back} ${bottom} Q200 ${bottom + 6} ${200 + back} ${bottom} L270 ${bottom + 42} L130 ${bottom + 42}Z`}
        fill={`url(#${id}tissue)`}
      />
      <ellipse
        cx={174 - back}
        cy={bottom + 19}
        rx="18"
        ry="15"
        fill="#be8a7d"
        stroke="#dfaf99"
      />
      <ellipse
        cx={226 + back}
        cy={bottom + 19}
        rx="18"
        ry="15"
        fill="#be8a7d"
        stroke="#dfaf99"
      />
      {f.turbulence > 0.05 && !open && !closed && (
        <path
          d={`M200 ${bottom + 10}v-24m-4 5l4-5 4 5`}
          stroke="#82cce0"
          strokeWidth="2"
          fill="none"
        />
      )}
      {detailed && (
        <g
          fill="currentColor"
          fontSize="14"
          fontFamily="Segoe UI, Microsoft YaHei, sans-serif"
        >
          <text x="200" y="23" textAnchor="middle">
            前 · 甲状软骨侧
          </text>
          <text x="200" y="340" textAnchor="middle">
            后 · 杓状软骨侧
          </text>
          <path
            d="M110 154H40 M210 182H345"
            stroke="currentColor"
            opacity=".65"
          />
          <text x="26" y="145">
            韧带部
          </text>
          <text x="307" y="174">
            前部声门
          </text>
          <path
            d={`M204 ${bottom - 10}L305 288H370`}
            stroke="currentColor"
            fill="none"
            opacity=".65"
          />
          <text x="302" y="310">
            软骨声门
          </text>
        </g>
      )}
    </svg>
  );
}
