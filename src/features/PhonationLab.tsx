'use client';
/* oxlint-disable jsx-a11y/media-has-caption -- Audio-only phonetic examples are transcribed and attributed next to each player. */
import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { Pause, Play, Volume2, LoaderCircle } from 'lucide-react';
import { VocalFolds } from '../components/vocal-tract/VocalFolds';
import { Range } from '../components/Controls';
import {
  phonationLabels,
  phonationPresets,
  phonationGroups,
  phonationContinuum,
  samplePhonationContinuum,
  phonationControlFrame,
} from '../engine/phonation';
import type { Phonation, PhonationControls } from '../engine/phonation';
import { ipaReferenceAudio, ipaAudioSource } from '../data/ipa-reference-audio';
import { ipaReferenceLocalAudio } from '../data/ipa-reference-local';
import { resolveAudioUrl } from '../engine/audio';
import { vowelAudio } from '../data/vowel-audio';

const dimensions: {
  key: keyof PhonationControls;
  label: string;
  hint: string;
}[] = [
  {
    key: 'adduction',
    label: '韧带声门内收 · 开放 → 压紧',
    hint: '调前部开合与开放期，不等于纵向张力。',
  },
  {
    key: 'posteriorOpening',
    label: '软骨声门 · 闭合 → 后部开口',
    hint: '独立观察耳语型后部气流通道。',
  },
  {
    key: 'tension',
    label: '纵向张力 · 松短厚 → 拉长变薄',
    hint: '仅示意形态，不换算实际音高。',
  },
  {
    key: 'drive',
    label: '气流驱动 · 弱 → 强',
    hint: '示意能否维持振动与噪声，无真实压力单位。',
  },
  {
    key: 'irregularity',
    label: '脉冲模式 · 规则 → 不均匀',
    hint: '展示一种嘎裂型脉冲，不覆盖全部嘎裂亚型。',
  },
  {
    key: 'edgeOnly',
    label: '振动部位 · 较厚组织 → 薄边缘',
    hint: '与张力配合观察假声型构形。',
  },
];

export function PhonationLab({
  onPlayRecording,
  player,
}: {
  onPlayRecording: () => void;
  player: RefObject<HTMLAudioElement | null>;
}) {
  const [mode, setMode] = useState<Phonation | null>('modal');
  const [controls, setControls] = useState<PhonationControls>(
    phonationPresets.modal.controls,
  );
  const [continuum, setContinuum] = useState(2);
  const [onPath, setOnPath] = useState(true);
  const [paused, setPaused] = useState(false);
  const [error, setError] = useState('');
  const mark = mode === 'breathy' ? '̤' : '̰';
  const recordings = (ipaReferenceAudio[mark]?.clips ?? []).filter(
    (c) => c.example === `a${mark}`,
  );
  const request = useRef(0);
  const [activeRecording, setActiveRecording] = useState<string | null>(null);
  const [playback, setPlayback] = useState<
    'idle' | 'loading' | 'playing' | 'paused' | 'ended'
  >('idle');
  const availableRecordings =
    mode === 'modal'
      ? [
          {
            url: vowelAudio.a!.audioUrl,
            label: '[a] 常态浊声',
            speaker: 'Wikimedia Commons',
          },
        ]
      : mode === 'breathy' || mode === 'creaky'
        ? recordings.map((c) => ({
            url: ipaReferenceLocalAudio[c.url] ?? c.url,
            label: `[${c.example}]`,
            speaker: c.speaker,
          }))
        : [];
  useEffect(() => {
    const audio = player.current;
    const generation = request;
    return () => {
      generation.current++;
      audio?.pause();
    };
  }, [player]);
  function stopRecording() {
    request.current++;
    player.current?.pause();
    setActiveRecording(null);
    setPlayback('idle');
  }
  async function playRecording(url: string) {
    const audio = player.current;
    if (!audio) return;
    if (activeRecording === url && playback === 'playing') {
      request.current++;
      audio.pause();
      setPlayback('paused');
      return;
    }
    const token = ++request.current;
    audio.pause();
    setActiveRecording(url);
    setPlayback('loading');
    setError('');
    audio.setAttribute('src', resolveAudioUrl(url));
    audio.load();
    try {
      await audio.play();
      if (request.current === token) setPlayback('playing');
    } catch {
      if (request.current === token) {
        setPlayback('idle');
        setError('录音暂时无法播放，请重试或打开来源试听。');
      }
    }
  }
  function change(next: Phonation) {
    stopRecording();
    setMode(next);
    setControls({ ...phonationPresets[next].controls });
    const index = phonationContinuum.indexOf(next);
    setOnPath(index >= 0);
    if (index >= 0) setContinuum(index);
    setError('');
  }
  function slide(value: number) {
    stopRecording();
    setContinuum(value);
    setOnPath(true);
    setControls(samplePhonationContinuum(value));
    setMode(Number.isInteger(value) ? phonationContinuum[value]! : null);
    setError('');
  }
  function adjust(key: keyof PhonationControls, value: number) {
    stopRecording();
    setControls((p) => ({ ...p, [key]: value }));
    setMode(null);
    setOnPath(false);
    setError('');
  }
  const label = mode
    ? phonationLabels[mode]
    : onPath
      ? `${phonationLabels[phonationContinuum[Math.floor(continuum)]!]} → ${phonationLabels[phonationContinuum[Math.ceil(continuum)]!]}`
      : '自由组合 · 不自动判定发声态';
  const frame = phonationControlFrame(controls, 0.25);
  const trace = Array.from({ length: 121 }, (_, i) => {
    const f = phonationControlFrame(controls, i / 120);
    return `${i * 2.5},${53 - (f.gap + f.posteriorGap * 0.4) * 0.9}`;
  }).join(' ');
  return (
    <section className="sound-card phonation-lab">
      <div className="phonation-heading">
        <div>
          <span className="eyebrow">LARYNGEAL VIEW</span>
          <h2>喉部特征 · 声带俯视</h2>
        </div>
        <button
          className="text-button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? '继续声带动画' : '暂停声带动画'}
        >
          {paused ? <Play size={17} /> : <Pause size={17} />}
          {paused ? '继续' : '暂停'}
        </button>
      </div>
      <div className="phonation-workspace">
        <div className="phonation-observation">
          <div className="phonation-figure">
            <div className="phonation-current" aria-live="polite">
              <strong>{label}</strong>
              <span>
                {mode ? phonationPresets[mode].english : '教学插值，无标准音值'}
              </span>
            </div>
            <VocalFolds
              controls={controls}
              description={label}
              animated={!paused}
              detailed
            />
            <p>
              {mode
                ? phonationPresets[mode].description
                : '当前由多个参数共同决定构形。过渡位置或自由组合没有经过实测验证，不能据此认定某个语言中的标准发声态。'}
            </p>
          </div>
          <div className="phonation-trace">
            <div>
              <strong>声门开口变化示意</strong>
              <span>
                {frame.vibration > 0.05 ? '含周期／脉冲振动' : '无持续周期振动'}{' '}
                ·{' '}
                {frame.turbulence > 0.05
                  ? '含气流噪声条件'
                  : '漏气噪声较弱／无'}
              </span>
            </div>
            <svg
              viewBox="0 0 310 64"
              aria-label="慢速示意周期内的声门开口变化，不是声学波形"
            >
              <path d="M0 53H310" stroke="currentColor" opacity=".3" />
              <polyline
                points={trace}
                fill="none"
                stroke="#ba9951"
                strokeWidth="2"
              />
            </svg>
            <small>
              横轴：示意周期；纵轴：相对开口。不是声波、声谱、EGG 或测量结果。
            </small>
          </div>
          <div className="phonation-recording">
            <h3>公开录音 · 固定 [a] 比较音质</h3>
            <audio
              ref={player}
              hidden
              preload="none"
              aria-label="发声态示例录音"
              onPlay={onPlayRecording}
              onPause={() =>
                setPlayback((p) => (p === 'playing' ? 'paused' : p))
              }
              onEnded={() => setPlayback('ended')}
              onError={() => {
                setPlayback('idle');
                setError('录音暂时无法播放，请重试或打开来源试听。');
              }}
            />
            {availableRecordings.length ? (
              <>
                <div className="phonation-play-buttons">
                  {availableRecordings.map((recording) => {
                    const active = activeRecording === recording.url;
                    const playing = active && playback === 'playing';
                    const loading = active && playback === 'loading';
                    return (
                      <button
                        key={recording.url}
                        type="button"
                        onClick={() => void playRecording(recording.url)}
                        disabled={loading}
                        aria-pressed={playing}
                        aria-label={`${playing ? '暂停' : '播放'} ${recording.label} · ${recording.speaker}`}
                      >
                        {loading ? (
                          <LoaderCircle
                            size={17}
                            className="recording-loading"
                          />
                        ) : playing ? (
                          <Pause size={17} />
                        ) : (
                          <Volume2 size={17} />
                        )}
                        <span>
                          <strong>{recording.label}</strong>
                          <small>{recording.speaker}</small>
                        </span>
                      </button>
                    );
                  })}
                </div>
                <output aria-live="polite">
                  {error ||
                    (playback === 'loading'
                      ? '正在加载…'
                      : playback === 'playing'
                        ? '正在播放 · 再次点击暂停'
                        : playback === 'paused'
                          ? '已暂停 · 点击重新播放'
                          : playback === 'ended'
                            ? '播放结束 · 可再次点击'
                            : '点击示例即可播放')}
                  {mode === 'modal' && ' · 不同发音人，仅作听感参照'}
                </output>
              </>
            ) : (
              <p>
                {mode
                  ? '该预设暂未接入已核实的独立录音。'
                  : '当前是教学过渡／自由组合，没有对应的标准录音。'}
                可切换到常态浊声、气声或嘎裂声，听已有的 [a] 参照。
              </p>
            )}
            <details>
              <summary>来源、署名与更多语言示例</summary>
              <p>
                <a href={ipaAudioSource} target="_blank" rel="noreferrer">
                  IPA 官方交互音表 ↗
                </a>
                ：气声、嘎裂声录音来自 J. Esling 与 P.
                Ladefoged；公开试听不等于开放许可，权利归原作者，沿用项目现有缓存。
              </p>
              <p>
                <a href={vowelAudio.a!.source} target="_blank" rel="noreferrer">
                  常态 [a]：Wikimedia Commons ↗
                </a>{' '}
                · {vowelAudio.a!.attribution} ·{' '}
                <a
                  href={vowelAudio.a!.licenseUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {vowelAudio.a!.license}
                </a>
              </p>
              <p>
                <a
                  href="https://www.phonetik.uni-muenchen.de/~hoole/kurse/phil_demos/language_demos/voice_quality_contrasts.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  LMU / UCLA：古吉拉特语气声、Mazatec 常态／嘎裂／气声词例 ↗
                </a>
              </p>
              <p>
                <a
                  href="https://www.phonetics.ucla.edu/voiceproject/Publications/kuang_keating_90314.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  张力、松紧与声带振动研究 ↗
                </a>
              </p>
            </details>
          </div>
        </div>
        <div className="phonation-settings">
          <h3 className="phonation-section-title">
            发声态预设 <span>选择并观察</span>
          </h3>
          <div className="phonation-options" aria-label="常见基本发声态">
            {phonationGroups[0]!.modes.map((m) => (
              <button
                key={m}
                aria-pressed={m === mode}
                onClick={() => change(m)}
                title={phonationPresets[m].english}
              >
                {phonationLabels[m]}
              </button>
            ))}
          </div>
          <details className="phonation-composites">
            <summary>耳语与假声的复合态 · 5 种</summary>
            <div className="phonation-options" aria-label="复合发声态">
              {phonationGroups[1]!.modes.map((m) => (
                <button
                  key={m}
                  aria-pressed={m === mode}
                  onClick={() => change(m)}
                  title={phonationPresets[m].english}
                >
                  {phonationLabels[m]}
                </button>
              ))}
            </div>
          </details>
          <div className="phonation-continuum">
            <Range
              label="教学路径 · 气声 → 弛声 → 常态浊声 → 紧声 → 嘎裂声"
              value={continuum}
              min={0}
              max={4}
              step={0.01}
              onChange={slide}
            />
            <div className="phonation-path-stops">
              {phonationContinuum.map((m, i) => (
                <button
                  key={m}
                  onClick={() => slide(i)}
                  aria-pressed={onPath && continuum === i}
                >
                  {['气声', '弛声', '常态浊声', '紧声', '嘎裂声'][i]}
                </button>
              ))}
            </div>
            {!onPath && (
              <p className="chart-note">
                当前已离开这条预设路径；拖动路径滑块会重新载入路径参数。
              </p>
            )}
            <p className="chart-note">
              这是一条人为选定的多参数教学路径，不是标准示范或等距生理尺度。沿途内收增强，但纵向张力不单调上升；进入本页的嘎裂预设时反而降低。假声、耳语及其组合不在这条单轴路径上。
            </p>
          </div>
          <div className="phonation-dimensions" aria-label="独立喉部参数">
            {dimensions.map((d) => (
              <div key={d.key}>
                <Range
                  label={d.label}
                  value={controls[d.key]}
                  onChange={(v) => adjust(d.key, v)}
                />
                <small>{d.hint}</small>
              </div>
            ))}
          </div>
        </div>
      </div>
      <footer className="phonation-footer">
        <p className="chart-note">
          慢放教学示意 · 参数不对应真实生理刻度 · 录音不随调节合成
        </p>
        <details className="phonation-scope">
          <summary>分类依据、术语差异与模型范围</summary>
          <p className="chart-note">
            常见基本态与复合态。中文译名并非完全统一；这里用“弛声（松声）”，并把无周期振动的耳语声与耳语浊声分开。
          </p>
          <p className="chart-note">
            绘图省略声带上方遮挡结构，动画大幅慢放；参数为归一化的显示控制，不模拟肌肉、真实压力阈值、黏膜波或音高。与录音不逐帧同步，也不合成当前参数的声音。
          </p>
          <p>
            “紧声／僵声”与“挤喉发声”的用法有重叠，此处分别展示较轻与较强内收；不是宣称二者具有跨语言通用边界。气声和耳语浊声也有不同的命名传统。
          </p>
          <p>
            对照参考表：无声态、呼气声、呼气浊声、耳语声、耳语浊声、常态浊声、嘎裂声、假声及耳语／嘎裂／假声的组合，已纳入本面板。发声和湍流阈值受多种条件影响，不采用通用的固定气压数值。
          </p>
          <p>
            糙声（harsh voice）、室襞性发声（ventricular
            phonation）和杓状会厌襞性发声（aryepiglottic
            phonation）涉及声门以上结构；不能用本图的真声带松紧代替。这里提供分类入口与文献，不伪装成已模拟这些机制。病理性发声与电子喉等不列入普通发音练习。
          </p>
          <ul>
            <li>
              <a
                href="https://doi.org/10.1006/jpho.2001.0147"
                target="_blank"
                rel="noreferrer"
              >
                Gordon & Ladefoged（2001）：发声态跨语言综述
              </a>
            </li>
            <li>
              <a
                href="https://www.reed.edu/linguistics/khan/assets/Esposito%20Khan%202020%20The%20cross-linguistic%20patterns%20of%20phonation%20types.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Esposito & Khan（2020）：发声态是多维空间
              </a>
            </li>
            <li>
              <a
                href="https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/abs/revisions-to-the-voqs-system-for-the-transcription-of-voice-quality/67662EA00A0B1D77136AF8514B6F230B"
                target="_blank"
                rel="noreferrer"
              >
                Ball、Esling & Dickson：VoQS 修订与复合发声态
              </a>
            </li>
            <li>
              <a
                href="https://phesoca.com/aws/305/"
                target="_blank"
                rel="noreferrer"
              >
                VoQS 中英对照译表（2020，非官方中文术语标准）
              </a>
            </li>
            <li>
              <a
                href="https://pdf.hanspub.org/ml20230700000_92348037.pdf"
                target="_blank"
                rel="noreferrer"
              >
                中文发声态讨论：西双版纳版纳傣语语音系统及发声态探究（2023）
              </a>
            </li>
          </ul>
        </details>
      </footer>
    </section>
  );
}
