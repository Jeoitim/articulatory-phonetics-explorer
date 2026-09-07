/* oxlint-disable jsx-a11y/prefer-tag-over-role -- The accessible image is a live inline vector drawing. */
import { useId } from 'react';
import { mouthGeometry } from '../../engine/vowels';

export function FrontMouth({
  rounding,
  openness,
}: {
  rounding: number;
  openness: number;
}) {
  const id = 'mouth-' + useId().replaceAll(':', '');
  const {
    width: w,
    height: h,
    thickness: t,
  } = mouthGeometry(rounding, openness);
  const y = 112,
    l = 150 - w,
    r = 150 + w;
  const aperture = `M ${l} ${y} C ${l + 8} ${y - h * 0.7} ${150 - w * 0.45} ${y - h} 150 ${y - h * 0.85} C ${150 + w * 0.45} ${y - h} ${r - 8} ${y - h * 0.7} ${r} ${y} C ${r - 6} ${y + h * 0.65} ${150 + w * 0.46} ${y + h} 150 ${y + h} C ${150 - w * 0.46} ${y + h} ${l + 6} ${y + h * 0.65} ${l} ${y} Z`;
  const upper = `M ${l - 3} ${y + 1} C ${l - 1} ${y - h * 0.8} ${150 - w * 0.55} ${y - h - t * 0.85} ${150 - w * 0.2} ${y - h - t} C ${150 - w * 0.1} ${y - h - t * 1.02} ${150 - w * 0.09} ${y - h - t * 0.82} 150 ${y - h - t * 0.8} C ${150 + w * 0.09} ${y - h - t * 0.82} ${150 + w * 0.1} ${y - h - t * 1.02} ${150 + w * 0.2} ${y - h - t} C ${150 + w * 0.55} ${y - h - t * 0.85} ${r + 1} ${y - h * 0.8} ${r + 3} ${y + 1} L ${r} ${y} C ${r - 8} ${y - h * 0.7} ${150 + w * 0.45} ${y - h} 150 ${y - h * 0.85} C ${150 - w * 0.45} ${y - h} ${l + 8} ${y - h * 0.7} ${l} ${y} Z`;
  const lower = `M ${l - 3} ${y + 1} C ${l + 8} ${y + h + t * 0.65} ${150 - w * 0.43} ${y + h + t * 1.14} 150 ${y + h + t} C ${150 + w * 0.43} ${y + h + t * 1.14} ${r - 8} ${y + h + t * 0.65} ${r + 3} ${y + 1} L ${r} ${y} C ${r - 6} ${y + h * 0.65} ${150 + w * 0.46} ${y + h} 150 ${y + h} C ${150 - w * 0.46} ${y + h} ${l + 6} ${y + h * 0.65} ${l} ${y} Z`;
  const url = (name: string) => `url(#${id}-${name})`;
  return (
    <svg
      className="front-mouth"
      viewBox="0 0 300 230"
      role="img"
      aria-label={`嘴部正面：圆唇度 ${Math.round(rounding * 100)}%，开口度 ${Math.round(openness * 100)}%`}
    >
      <title>嘴部正面 · 唇峰、唇珠与口腔深度示意</title>
      <defs>
        <radialGradient id={`${id}-skin`}>
          <stop stopColor="#ebd0bc" stopOpacity=".55" />
          <stop offset=".72" stopColor="#eed9c8" stopOpacity=".2" />
          <stop offset="1" stopColor="#eed9c8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${id}-lip-light`}>
          <stop stopColor="#ffe1ca" stopOpacity=".36" />
          <stop offset="1" stopColor="#ffe1ca" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-upper`} x2=".15" y2="1">
          <stop stopColor="#d1a18e" />
          <stop offset=".38" stopColor="#b87669" />
          <stop offset=".88" stopColor="#99574f" />
          <stop offset="1" stopColor="#76453f" />
        </linearGradient>
        <linearGradient id={`${id}-lower`} x2="0" y2="1">
          <stop stopColor="#92524e" />
          <stop offset=".36" stopColor="#c58a7e" />
          <stop offset=".68" stopColor="#d8a798" />
          <stop offset="1" stopColor="#b37c6d" />
        </linearGradient>
        <radialGradient id={`${id}-cavity`} cx="50%" cy="75%">
          <stop stopColor="#653e3d" />
          <stop offset=".65" stopColor="#382424" />
          <stop offset="1" stopColor="#241b1c" />
        </radialGradient>
        <linearGradient id={`${id}-teeth`} x2="0" y2="1">
          <stop stopColor="#bfae99" />
          <stop offset=".5" stopColor="#ece3d2" />
          <stop offset="1" stopColor="#d6cbbb" />
        </linearGradient>
        <radialGradient id={`${id}-tongue`}>
          <stop stopColor="#b77976" />
          <stop offset="1" stopColor="#754745" />
        </radialGradient>
        <clipPath id={`${id}-opening`}>
          <path d={aperture} />
        </clipPath>
      </defs>
      <ellipse cx="150" cy="113" rx="125" ry="96" fill={url('skin')} />
      <path
        d="M136 31Q132 39 139 40 M164 31Q168 39 161 40 M141 41Q150 44 159 41"
        fill="none"
        stroke="#b89681"
        strokeWidth="1.3"
        opacity=".55"
        strokeLinecap="round"
      />
      <path
        d={`M143 46 Q145 ${y - h - t - 14} 140 ${y - h - t - 5} M157 46 Q155 ${y - h - t - 14} 160 ${y - h - t - 5}`}
        fill="none"
        stroke="#ba9785"
        strokeWidth="1"
        opacity=".22"
      />
      <ellipse
        cx="150"
        cy={y + h + t + 9}
        rx={w * 0.7}
        ry={5 + rounding * 3}
        fill="#956f5e"
        opacity={0.07 + rounding * 0.07}
      />
      <path d={aperture} fill={url('cavity')} />
      <g clipPath={url('opening')}>
        <path
          d={`M ${l + 7} ${y - h - 3} Q150 ${y - h * 0.55} ${r - 7} ${y - h - 3} L ${r - 9} ${y - h * 0.45} Q150 ${y - h * 0.18} ${l + 9} ${y - h * 0.45} Z`}
          fill={url('teeth')}
          opacity={1 - rounding * 0.85}
        />
        {[-0.5, -0.25, 0, 0.25, 0.5].map((k) => (
          <path
            key={k}
            d={`M ${150 + k * w} ${y - h} l ${k * 2} ${h * 0.65}`}
            stroke="#9a8978"
            strokeWidth=".6"
            opacity=".34"
          />
        ))}
        <ellipse
          cx="150"
          cy={y + h * 0.94 + 9}
          rx={w * 0.65}
          ry={Math.max(8, h * 0.48)}
          fill={url('tongue')}
        />
        <path
          d={`M150 ${y + h * 0.75}v${h * 0.3}`}
          stroke="#724946"
          opacity=".35"
          fill="none"
        />
      </g>
      <path d={upper} fill={url('upper')} stroke="#a66f61" strokeWidth=".6" />
      <path d={lower} fill={url('lower')} stroke="#b17f70" strokeWidth=".6" />
      <ellipse
        cx="150"
        cy={y - h - t * 0.5}
        rx={w * 0.65}
        ry={t * 0.4}
        fill={url('lip-light')}
        opacity={rounding}
      />
      <ellipse
        cx="150"
        cy={y + h + t * 0.6}
        rx={w * 0.65}
        ry={t * 0.35}
        fill={url('lip-light')}
        opacity={rounding}
      />
      <path
        d={`M ${150 - w * 0.44} ${y + h + t * 0.61} Q150 ${y + h + t * 0.95} ${150 + w * 0.43} ${y + h + t * 0.82}`}
        fill="none"
        stroke="#efc8b5"
        strokeWidth="1.8"
        opacity=".48"
        strokeLinecap="round"
      />
      <path
        d={`M ${150 - w * 0.22} ${y - h - t * 0.85} Q ${150 - w * 0.1} ${y - h - t * 0.8} 150 ${y - h - t * 0.8} Q ${150 + w * 0.1} ${y - h - t * 0.8} ${150 + w * 0.22} ${y - h - t * 0.85}`}
        fill="none"
        stroke="#e2b5a2"
        strokeWidth="1"
        opacity=".55"
      />
      {[-0.65, -0.42, -0.2, 0, 0.2, 0.42, 0.65].map((k) => (
        <path
          key={k}
          d={`M ${150 + k * w} ${y + h + t * 0.28} q ${k * 2} ${t * 0.28} ${k * 3} ${t * 0.47}`}
          fill="none"
          stroke="#8f584f"
          strokeWidth=".65"
          opacity=".16"
        />
      ))}
      <path
        d={`M ${l - 5} ${y}q3 3 7 1 M ${r + 5} ${y}q-3 3-7 1`}
        fill="none"
        stroke="#8c6355"
        strokeWidth="1.4"
        opacity=".55"
        strokeLinecap="round"
      />
      <text x="150" y="217" textAnchor="middle" fill="#7f806f" fontSize="12">
        {rounding > 0.65
          ? '收拢 · 圆唇'
          : rounding < 0.3
            ? '展开 · 不圆唇'
            : '圆唇过渡'}
      </text>
    </svg>
  );
}
