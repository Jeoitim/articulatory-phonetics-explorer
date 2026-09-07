import { useState } from 'react';
import { Play, Pause, Volume2, ArrowRightLeft } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { consonants, soundBySymbol } from '../data/consonants';
import { placeLabels, mannerLabels } from '../data/labels';
import { useArticulation, sampleAnimation } from '../engine/animation';
import { preset } from '../engine/geometry';
import { VocalTract } from '../components/vocal-tract/VocalTract';
import { Glottis, TongueInset } from '../components/vocal-tract/Insets';
import { Range, Toggle } from '../components/Controls';
export function Compare({ onAudio }: { onAudio: (symbol: string) => void }) {
  const [a, setA] = useState('s'),
    [b, setB] = useState('ʃ'),
    [overlay, setOverlay] = useState(false);
  const sa = soundBySymbol(a),
    sb = soundBySymbol(b);
  const anim = useArticulation(sa);
  function pair(a: string, b: string) {
    setA(a);
    setB(b);
    anim.select(soundBySymbol(a));
  }
  return (
    <section className="compare-section">
      <div className="compare-intro">
        <div>
          <span className="eyebrow">LISTEN TO THE DIFFERENCE</span>
          <h2>一个变化，两种声音。</h2>
          <p>对齐发音阶段，观察器官构形与气流如何改变。</p>
        </div>
        <Toggle label="轮廓叠加" checked={overlay} onChange={setOverlay} />
      </div>
      <div className="pair-shortcuts">
        典型对比
        {[
          ['s', 'ʃ'],
          ['t', 'ʈ'],
          ['x', 'ç'],
          ['t', 'd'],
          ['n', 'ŋ'],
          ['l', 'ɹ'],
          ['r', 'ɾ'],
        ].map(([x, y]) => (
          <button
            key={x}
            onClick={() => pair(x!, y!)}
            className={a === x && b === y ? 'active' : ''}
          >
            [{x}] <span>vs</span> [{y}]
          </button>
        ))}
      </div>
      <div className="compare-grid">
        {[sa, sb].map((s, i) => {
          const sampled = sampleAnimation(s, anim.progress);
          return (
            <article
              className={`vocal-panel compare-card ${i ? 'comparison-b' : ''}`}
              key={i}
            >
              <div className="compare-title">
                <span className="comparison-letter">{i ? 'B' : 'A'}</span>
                <Select
                  value={s.symbol}
                  onValueChange={(v) => {
                    if (v) pair(i ? a : String(v), i ? String(v) : b);
                  }}
                >
                  <SelectTrigger aria-label={`选择声音 ${i ? 'B' : 'A'}`}>
                    <SelectValue>
                      [{s.symbol}] · {s.zh}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {consonants.map((c) => (
                      <SelectItem value={c.symbol} key={c.symbol}>
                        [{c.symbol}] {c.zh}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  className="icon-button"
                  onClick={() => onAudio(s.symbol)}
                  aria-label={`播放 ${s.symbol}`}
                >
                  <Volume2 size={18} />
                </button>
              </div>
              <VocalTract
                airstream={s.airstream}
                compact
                lateral={s.airflow === 'lateral'}
                pose={anim.presentation ? sampled.pose : preset(s)}
                overlay={
                  overlay
                    ? anim.presentation
                      ? sampleAnimation(i ? sa : sb, anim.progress).pose
                      : preset(i ? sa : sb)
                    : undefined
                }
                place={s.place}
                display={{
                  labels: false,
                  zones: true,
                  points: false,
                  airflow: true,
                }}
                flow={
                  anim.presentation
                    ? sampled.flow
                    : s.manner === 'plosive'
                      ? 'off'
                      : 'smooth'
                }
                pressure={anim.presentation ? sampled.pressure : 0}
                animated={!anim.reduced}
              />
              <div className="insets">
                <Glottis
                  openness={
                    (anim.presentation ? sampled.pose : preset(s)).glottis
                  }
                  voiced={s.voiced}
                  animated={!anim.reduced}
                />
                <TongueInset
                  lateral={s.airflow === 'lateral'}
                  airstream={s.airstream}
                />
              </div>
            </article>
          );
        })}
      </div>
      <div className="compare-play">
        <button
          className="play-button"
          onClick={anim.play}
          aria-label="同步播放对比动画"
        >
          {anim.playing ? <Pause size={16} /> : <Play size={16} />}
        </button>
        <Range
          label="同步发音阶段"
          value={anim.progress}
          onChange={anim.scrub}
        />
        <button className="text-button" onClick={() => pair(b, a)}>
          <ArrowRightLeft size={14} />
          交换 A / B
        </button>
      </div>
      <div className="difference-card">
        <span className="eyebrow">WHAT CHANGED?</span>
        <h3>变化在哪里？</h3>
        <div className="difference-grid">
          {[
            [
              '调音部位',
              placeLabels[sa.place] +
                (sa.secondaryPlace
                  ? ' + ' + placeLabels[sa.secondaryPlace]
                  : ''),
              placeLabels[sb.place] +
                (sb.secondaryPlace
                  ? ' + ' + placeLabels[sb.secondaryPlace]
                  : ''),
            ],
            [
              '唇形',
              preset(sa).rounding > 0.5 ? '圆唇' : '不要求圆唇',
              preset(sb).rounding > 0.5 ? '圆唇' : '不要求圆唇',
            ],
            [
              '通道',
              sa.airflow === 'lateral' ? '边侧' : '中央',
              sb.airflow === 'lateral' ? '边侧' : '中央',
            ],
            ['调音方法', mannerLabels[sa.manner], mannerLabels[sb.manner]],
            [
              '声带',
              sa.voiced ? '振动' : '不振动',
              sb.voiced ? '振动' : '不振动',
            ],
            [
              '软腭',
              sa.velum === 'raised' ? '升起' : '降低',
              sb.velum === 'raised' ? '升起' : '降低',
            ],
          ].map(([label, x, y]) => (
            <div key={label} className={x !== y ? 'changed' : ''}>
              <span>{label}</span>
              <p>
                {x}
                <b> → </b>
                {y}
              </p>
            </div>
          ))}
        </div>
        <p className="comparison-explanation">
          {a === 's' && b === 'ʃ'
            ? '舌叶向后移动，前腔变长。[ʃ] 可伴随一定唇形变化，但圆唇程度依语言和说话人而异。'
            : '观察高亮参数的变化。相同部位不意味着相同声音；接触时序、声带与通道共同参与发音。'}
        </p>
      </div>
    </section>
  );
}
