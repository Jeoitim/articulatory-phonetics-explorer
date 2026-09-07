'use client';
import { useState } from 'react';
import type { PointerEvent } from 'react';
import { Play, RotateCcw, Volume2 } from 'lucide-react';
import { useAudio } from '../engine/audio';
import { vowelAudio } from '../data/vowel-audio';
import { vowels, apicalVowels, vowelChartPoint } from '../data/vowels';
import type { Vowel } from '../data/vowels';
import { vowelPose } from '../engine/vowels';
import { rest } from '../engine/geometry';
import { useVowelMotion } from '../engine/vowel-motion';
import { VocalTract } from '../components/vocal-tract/VocalTract';
import { FrontMouth } from '../components/vocal-tract/FrontMouth';
import { Range } from '../components/Controls';

export function Vowels() {
  const audio = useAudio(vowelAudio);
  const [value, setValue] = useState<Vowel>(vowels[0]!);
  const [selected, setSelected] = useState<string | null>('i');
  const { pose, move } = useVowelMotion(() => vowelPose(vowels[0]!));
  function select(v: Vowel, playAudio = true) {
    setValue(v);
    setSelected(v.symbol);
    move(vowelPose(v));
    if (playAudio) void audio.play(v.symbol);
  }
  function adjust(key: 'height' | 'backness' | 'rounding', n: number) {
    audio.stop();
    setSelected(null);
    const next = {
      ...value,
      [key]: n,
      apical: key === 'rounding' ? value.apical : undefined,
    };
    setValue(next);
    move(vowelPose(next), true);
  }
  function chartMove(e: PointerEvent<SVGSVGElement>) {
    audio.stop();
    const box = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - box.left) * 520) / box.width,
      y = ((e.clientY - box.top) * 400) / box.height;
    const h = Math.max(0, Math.min(1, (y - 45) / 300));
    const left = 80 + 150 * h;
    const b = Math.max(0, Math.min(1, (x - left) / (440 - left)));
    setSelected(null);
    const next = { ...value, height: h, backness: b, apical: undefined };
    setValue(next);
    move(vowelPose(next), true);
  }
  const marker = vowelChartPoint(value.height, value.backness);
  return (
    <div className="vowel-lab lab-grid">
      <section className="vocal-panel">
        <div className="panel-heading">
          <h2>
            元音发音实验台 <span>Vowels</span>
          </h2>
          <div className="panel-actions">
            <button
              onClick={() => move(vowelPose(value), false, rest)}
              title="重播口型变化"
              aria-label="重播口型变化"
            >
              <Play size={16} />
            </button>
            <button
              onClick={() => select(vowels[0]!)}
              title="恢复 i"
              aria-label="恢复 i"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
        <div className="diagram-stage">
          <span className="orientation">前 ← → 后</span>
          <VocalTract
            pose={pose}
            place={
              value.apical === 'retroflex'
                ? 'retroflex'
                : value.apical === 'front'
                  ? 'alveolar'
                  : value.backness < 0.5
                    ? 'palatal'
                    : 'velar'
            }
            display={{
              labels: true,
              zones: false,
              points: false,
              airflow: true,
            }}
            flow="smooth"
          />
        </div>
        <div className="mouth-panel">
          <div>
            <h3>
              嘴部正面 <span>Front view</span>
            </h3>
            <p>
              {pose.rounding > 0.7
                ? '圆唇 · 嘴角收拢'
                : pose.rounding < 0.3
                  ? '不圆唇 · 放松展开'
                  : '圆唇过渡'}
            </p>
            <p>与侧面口型同步变化</p>
          </div>
          <FrontMouth
            rounding={pose.rounding}
            openness={Math.max(0, Math.min(1, (pose.jaw - 0.18) / 0.52))}
          />
        </div>
      </section>
      <div className="right-column vowel-controls">
        <section className="sound-card">
          <div className="vowel-heading">
            <div>
              <span className="eyebrow">VOWEL SPACE</span>
              <h2>元音舌位图</h2>
            </div>
            <span className={'vowel-symbol ' + (selected ? '' : 'custom')}>
              {selected ? `[${selected}]` : '自由舌位'}
            </span>
          </div>
          <p className="chart-note">
            点击符号，或拖动图内位置。成对符号左为不圆唇、右为圆唇。
          </p>
          <div className="vowel-chart">
            <svg
              viewBox="0 0 520 400"
              preserveAspectRatio="none"
              aria-label="元音空间，可用下方舌位滑块键盘调整"
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                chartMove(e);
              }}
              onPointerMove={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  chartMove(e);
              }}
              onPointerUp={(e) => {
                if (e.currentTarget.hasPointerCapture(e.pointerId))
                  e.currentTarget.releasePointerCapture(e.pointerId);
              }}
            >
              <path
                d="M80 45H440V345H230Z M130 145H440 M180 245H440 M260 45L335 345"
                fill="none"
                stroke="#c0c8b6"
                strokeWidth="1.4"
              />
              <g fill="#818975" fontSize="13">
                <text x="68" y="20">
                  前
                </text>
                <text x="250" y="20">
                  央
                </text>
                <text x="433" y="20">
                  后
                </text>
                <text x="10" y="50">
                  闭
                </text>
                <text x="10" y="150">
                  半闭
                </text>
                <text x="10" y="250">
                  半开
                </text>
                <text x="10" y="350">
                  开
                </text>
              </g>
              {!value.apical && (
                <circle
                  cx={marker.x}
                  cy={marker.y}
                  r="8"
                  fill="#c39b48"
                  stroke="#fff"
                  strokeWidth="2"
                />
              )}
            </svg>
            {vowels.map((v) => {
              const point = vowelChartPoint(v.height, v.backness);
              const paired = vowels.some(
                (w) =>
                  w !== v && w.height === v.height && w.backness === v.backness,
              );
              const x = point.x + (paired ? (v.rounding ? 17 : -17) : 0);
              return (
                <button
                  key={v.symbol}
                  className={
                    'vowel-key ' + (selected === v.symbol ? 'selected' : '')
                  }
                  style={{
                    left: `${(x / 520) * 100}%`,
                    top: `${(point.y / 400) * 100}%`,
                  }}
                  onPointerDown={(e) => {
                    if (e.button === 0) select(v, false);
                  }}
                  onClick={(e) => {
                    if (e.detail === 0) select(v);
                    else void audio.play(v.symbol);
                  }}
                  title={v.zh}
                  aria-label={`${v.symbol} ${v.zh}`}
                  aria-pressed={selected === v.symbol}
                >
                  {v.symbol}
                </button>
              );
            })}
          </div>
          <div className="vowel-audio">
            <button
              className="text-button"
              disabled={!selected || !vowelAudio[selected]}
              onClick={() => selected && void audio.play(selected)}
            >
              <Volume2 size={16} />
              {selected ? `播放 [${selected}]` : '自由构形'}
            </button>
            <output aria-live="polite">
              {!selected
                ? '自由构形没有对应的录音。'
                : value.apical
                  ? '舌尖元音暂未接入已核实录音。'
                  : audio.status || '点击音标即可听示例发音。'}
            </output>
            {selected && vowelAudio[selected] && (
              <details>
                <summary>录音来源与许可</summary>
                <a
                  href={vowelAudio[selected]!.source}
                  target="_blank"
                  rel="noreferrer"
                >
                  Wikimedia Commons ↗
                </a>
                <p>{vowelAudio[selected]!.attribution}</p>
                <a
                  href={vowelAudio[selected]!.licenseUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {vowelAudio[selected]!.license}
                </a>
              </details>
            )}
          </div>
          <h3 className="vowel-description">
            {selected
              ? value.zh
              : value.apical
                ? '舌尖构形 · 自定义圆唇'
                : '连续舌位 · 自定义元音'}
          </h3>
          <Range
            label="舌位高低 · 闭 → 开"
            value={value.height}
            onChange={(n) => adjust('height', n)}
          />
          <Range
            label="舌位前后 · 前 → 后"
            value={value.backness}
            onChange={(n) => adjust('backness', n)}
          />
          <Range
            label="圆唇度 · 展开 → 收圆"
            value={value.rounding}
            onChange={(n) => adjust('rounding', n)}
          />
          <p className="chart-note">
            舌位图是语音学坐标，不是舌头在口腔中的实际位置。口唇开度与圆唇分别变化；图中形状为教学近似。
          </p>
        </section>
        <section className="sound-card apical-card">
          <h2>普通话舌尖元音</h2>
          <div className="apical-options">
            {apicalVowels.map((v) => (
              <button
                key={v.symbol}
                className={
                  'extension-key ' + (selected === v.symbol ? 'selected' : '')
                }
                onClick={() => select(v)}
                aria-pressed={selected === v.symbol}
              >
                <b>{v.symbol}</b>
                <span>{v.zh}</span>
              </button>
            ))}
          </div>
          {value.apical ? (
            <>
              <p>{value.example}</p>
              <p>
                {value.apical === 'front'
                  ? '舌尖、舌叶接近齿龈，保持与前接咝音相近的舌前部姿态。'
                  : '舌尖后缩抬起，形成舌尖后的成音节构形；卷曲程度存在个体差异。'}{' '}
                保持浊音，不要求持续强摩擦。
              </p>
            </>
          ) : (
            <p>分别观察“资”的韵母和“知”的韵母，与普通 [i] 的舌面抬高作比较。</p>
          )}
          <p className="chart-note">
            [ɿ]、[ʅ] 是汉语语音学传统记号，不在现行 IPA
            元音表中；研究也将其分析为成音节近音（如
            [ɹ̩]、[ɻ̩]）。单列展示，不强行放入舌面元音四边形。
          </p>
          <div className="vowel-sources">
            <a
              href="https://www.internationalphoneticassociation.org/content/ipa-vowels"
              target="_blank"
              rel="noreferrer"
            >
              IPA 元音图 ↗
            </a>
            <a
              href="https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/abs/revisiting-mandarin-apical-vowels-an-articulatory-and-acoustic-study/DA325F52844304100950A8B4FEAF6240"
              target="_blank"
              rel="noreferrer"
            >
              舌尖元音研究 ↗
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
