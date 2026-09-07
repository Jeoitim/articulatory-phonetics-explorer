import type { Airstream } from '../../domain/phonetics';
export function Glottis({
  voiced,
  animated,
  openness = 1,
}: {
  voiced: boolean;
  openness?: number;
  animated: boolean;
}) {
  return (
    <div className="inset">
      <svg
        viewBox="0 0 120 58"
        aria-label={
          openness < 0.05
            ? '声门闭塞'
            : voiced
              ? '声带周期性开闭示意'
              : '声门相对开放'
        }
      >
        <path
          d="M 59 8 C 25 15 27 51 59 51 C 91 51 94 15 59 8"
          fill="light-dark(#efdad1, #68544b)"
          stroke="light-dark(#c89b89, #bd9580)"
        />
        <path
          className={openness >= 0.05 && voiced && animated ? 'vocal-fold' : ''}
          d={
            openness < 0.05
              ? 'M59 13L59 46'
              : voiced
                ? 'M 59 13 Q 51 29 59 46 Q 67 29 59 13'
                : 'M 59 13 L 46 42 Q 59 51 73 42 Z'
          }
          fill="light-dark(#676256, #262422)"
          stroke="light-dark(#b37366, #c18a77)"
        />
      </svg>
      <div>
        <strong>
          声带 <span>Vocal folds</span>
        </strong>
        <p>
          {openness < 0.05
            ? '闭塞 · Closure'
            : voiced
              ? '振动 · Voiced'
              : '开放 · Voiceless'}
        </p>
      </div>
      <i className={voiced ? 'status-dot on' : 'status-dot'} />
    </div>
  );
}
export function TongueInset({
  lateral,
  airstream = 'pulmonic-egressive',
}: {
  lateral: boolean;
  airstream?: Airstream;
}) {
  const inward = airstream === 'click' || airstream === 'implosive';
  return (
    <div className="inset">
      <svg
        viewBox="0 0 120 58"
        aria-label={lateral ? '俯视图：气流绕过舌头两侧' : '俯视图：中央气流'}
      >
        <path
          d="M 32 51 V 27 Q 60 -8 88 27 V 51"
          fill="light-dark(#f2e8dc, #665c4d)"
          stroke="light-dark(#c2b49a, #b5a081)"
        />
        <path
          d="M 43 52 V 28 Q 60 8 77 28 V 52"
          fill="light-dark(#cc8e80, #9c6c60)"
        />
        {lateral ? (
          <path
            d={
              inward
                ? 'M36 18V42l-4-6m4 6l4-6 M84 18V42l-4-6m4 6l4-6'
                : 'M 36 48 V 26 l -4 6 m 4 -6 l 4 6 M 84 48 V 26 l -4 6 m 4 -6 l 4 6'
            }
            fill="none"
            stroke="#5898ad"
            strokeWidth="2"
          />
        ) : (
          <path
            d={
              inward
                ? 'M60 14V43l-4-7m4 7l4-7'
                : 'M 60 48 V 14 l -4 7 m 4 -7 l 4 7'
            }
            fill="none"
            stroke="#5898ad"
            strokeWidth="2"
          />
        )}
      </svg>
      <div>
        <strong>
          舌面俯视 <span>Top view</span>
        </strong>
        <p>
          {lateral ? '边侧' : '中央'}气流 · {inward ? '局部向内' : '向外'}
        </p>
      </div>
    </div>
  );
}
