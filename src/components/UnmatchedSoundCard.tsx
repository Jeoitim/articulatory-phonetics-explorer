import type { Features, Match } from '../domain/phonetics';
import { mannerLabels, placeLabels } from '../data/labels';
import { airstreamLabels } from '../data/non-pulmonic';

export function UnmatchedSoundCard({
  match,
  features,
}: {
  match: Match;
  features: Features;
}) {
  return (
    <aside className="sound-card unmatched-card">
      <div className="sound-summary">
        <span className="eyebrow">CURRENT CONFIGURATION</span>
        <h2>暂无对应音标</h2>
        <p className="english-name">No exact IPA match</p>
        <output className="match-explanation" aria-live="polite">
          {match.explanation}
        </output>
        <p className="chart-note">
          继续调整构形或发音条件，满足匹配条件后再显示音标。
        </p>
      </div>
      <div className="sound-detail">
        <div className="contact-pair">
          <span>
            当前主动器官 <i>→</i> 接近部位
          </span>
          <strong>
            {match.contact.active}
            <i> — </i>
            {match.contact.passive}
          </strong>
        </div>
        <dl className="features">
          <div>
            <dt>接近区域</dt>
            <dd>{placeLabels[match.place]}</dd>
          </div>
          <div>
            <dt>所选方法</dt>
            <dd>{mannerLabels[features.manner]}</dd>
          </div>
          <div>
            <dt>声带</dt>
            <dd>{features.voiced ? '振动' : '不振动'}</dd>
          </div>
          <div>
            <dt>鼻咽通道</dt>
            <dd>{features.velum === 'lowered' ? '开放' : '关闭'}</dd>
          </div>
          <div>
            <dt>气流</dt>
            <dd>
              {features.airflow === 'lateral' ? '边侧' : '中央'} ·{' '}
              {airstreamLabels[features.airstream]}
            </dd>
          </div>
        </dl>
      </div>
    </aside>
  );
}
