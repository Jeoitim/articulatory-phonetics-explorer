import { VocalFolds } from './VocalFolds';
import { phonationLabels } from '../../engine/phonation';
import type { Phonation } from '../../engine/phonation';
import type { Airstream } from '../../domain/phonetics';
export function Glottis({
  voiced,
  animated,
  openness = 1,
  phonation = 'modal',
}: {
  voiced: boolean;
  openness?: number;
  phonation?: Phonation;
  animated: boolean;
}) {
  return (
    <div className="inset">
      <VocalFolds
        mode={phonation}
        tension={phonation === 'creaky' ? 0.2 : 0.5}
        animated={animated}
        open={!voiced}
        closed={openness < 0.05}
      />
      <div>
        <strong>
          声带 <span>Vocal folds</span>
        </strong>
        <p>
          {openness < 0.05 ? (
            <>
              闭塞 <span>Closure</span>
            </>
          ) : voiced ? (
            phonationLabels[phonation]
          ) : (
            <>
              开放 <span>Voiceless</span>
            </>
          )}
        </p>
      </div>
      <i className={voiced ? 'status-dot on' : 'status-dot'} />
    </div>
  );
}
export function TongueInset({
  lateral,
  airstream = 'pulmonic-egressive',
  animated = true,
}: {
  lateral: boolean;
  airstream?: Airstream;
  animated?: boolean;
}) {
  const inward = airstream === 'click' || airstream === 'implosive';
  return (
    <div className={'inset' + (animated ? '' : ' motion-still')}>
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
            className={animated ? 'air-dashes' : undefined}
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
            className={animated ? 'air-dashes' : undefined}
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
