'use client';
/* oxlint-disable jsx-a11y/media-has-caption -- Audio-only phonetic examples have visible IPA transcripts beside their playback controls. */
import { useEffect, useRef, useState } from 'react';
import { Popover } from '@base-ui/react/popover';
import { Volume2, X, Pause, Play, RotateCcw, AudioLines } from 'lucide-react';
import { markExplanations, referenceForMark } from '../data/ipa-mark-details';
import { ipaAudioSource } from '../data/ipa-reference-audio';
import { ipaReferenceLocalAudio } from '../data/ipa-reference-local';
import type { ReferenceClip } from '../data/ipa-reference-audio';
import { referencePreview, referenceFrame } from '../engine/reference-preview';
import type { ReferencePreviewModel } from '../engine/reference-preview';
import { VocalTract } from './vocal-tract/VocalTract';
import { Glottis, TongueInset } from './vocal-tract/Insets';
import { FrontMouth } from './vocal-tract/FrontMouth';
import { articulationContact } from '../engine/contact';
import { markEnglish } from '../data/ipa-mark-details';
import { resolveAudioUrl } from '../engine/audio';

function DetailAnimation({
  model,
  animate,
  paused,
}: {
  model: ReferencePreviewModel;
  animate: boolean;
  paused: boolean;
}) {
  const [progress, setProgress] = useState(animate ? 0 : 0.5);
  const elapsed = useRef(0);
  useEffect(() => {
    if (!animate || paused) return;
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let last = performance.now();
    function tick(now: number) {
      elapsed.current += now - last;
      last = now;
      const next = media.matches ? 0.5 : Math.min(1, elapsed.current / 2400);
      setProgress(next);
      if (!media.matches && next < 1) frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [animate, paused]);
  const frame = referenceFrame(model, progress);
  const contact = articulationContact(
    frame.pose,
    model.place,
    model.sound?.manner,
    model.sound,
  );
  return (
    <figure className="reference-animation">
      <VocalTract
        pose={frame.pose}
        place={model.place}
        display={{ labels: true, zones: true, points: false, airflow: true }}
        highlightContact
        flow={frame.flow}
        pressure={frame.pressure}
        lateral={model.lateral || frame.flow === 'lateral'}
        animated={!paused}
      />
      <div className="reference-phase">
        <AudioLines size={15} />
        {frame.phase}
      </div>
      <div className="reference-contact">
        <span>
          主动器官<strong>{contact.active}</strong>
        </span>
        <span>
          接触或接近<strong>{contact.passive}</strong>
        </span>
      </div>
      <div className="reference-insets">
        <Glottis
          voiced={model.sound?.voiced ?? true}
          openness={frame.pose.glottis}
          animated={animate && !paused && progress < 1}
        />
        {!model.lateral && (
          <FrontMouth
            rounding={frame.pose.rounding}
            openness={Math.max(0, Math.min(1, (frame.pose.jaw - 0.18) / 0.52))}
          />
        )}
        {model.lateral && (
          <TongueInset
            lateral
            airstream={model.sound?.airstream}
            animated={animate && !paused && progress < 1}
          />
        )}
      </div>
      <figcaption>{model.description}动画与录音不逐帧同步。</figcaption>
    </figure>
  );
}

export function IPAReferenceDetails({
  symbol,
  name,
  example,
}: {
  symbol: string;
  name: string;
  example: string;
}) {
  const reference = referenceForMark(symbol);
  const [clip, setClip] = useState<ReferenceClip | null>(null);
  const [error, setError] = useState('');
  const [replay, setReplay] = useState(0);
  const [animationPaused, setAnimationPaused] = useState(false);
  const [playback, setPlayback] = useState<
    'idle' | 'loading' | 'playing' | 'paused' | 'ended' | 'error'
  >('idle');
  const player = useRef<HTMLAudioElement>(null);
  const generation = useRef(0);
  useEffect(() => {
    const audio = player.current;
    const request = generation;
    return () => {
      request.current++;
      audio?.pause();
    };
  }, []);
  function play(next: ReferenceClip) {
    const audio = player.current;
    if (!audio) return;
    const token = ++generation.current;
    audio.pause();
    setClip(next);
    // Selecting a recording starts a fresh visual gesture alongside it. The
    // keyed animation remount also resets its timeline when the same example
    // is chosen again.
    setReplay((n) => n + 1);
    setAnimationPaused(false);
    setError('');
    setPlayback('loading');
    // Reference clips are cached under public/audio when available. Keep the
    // official URL as a transparent fallback for a partially populated cache.
    audio.src = resolveAudioUrl(ipaReferenceLocalAudio[next.url] ?? next.url);
    void audio.play().catch(() => {
      if (token === generation.current) {
        setError('示例暂未播放成功，请重试或打开 IPA 录音来源。');
        setPlayback('error');
      }
    });
  }
  const illustration =
    clip?.example || clip?.context[0] || example.split(/[ ·]/)[0];
  const model = illustration ? referencePreview(illustration) : null;
  return (
    <>
      <div className="mark-detail-heading">
        <Popover.Title>
          {symbol} · {name}
          <small>{markEnglish[name]}</small>
        </Popover.Title>
        <Popover.Close className="mark-close" aria-label="关闭符号详情">
          <X size={18} />
        </Popover.Close>
      </div>
      <div className="mark-detail-layout">
        <div className="mark-detail-copy">
          <h4>如何理解这个符号</h4>
          <Popover.Description>{markExplanations[name]}</Popover.Description>
          <p className="mark-detail-example">记音示例：{example}</p>
          <details className="mark-code">
            <summary>
              符号编码
              {reference.ipaNumber ? ` · IPA ${reference.ipaNumber}` : ''}
            </summary>
            <p>
              {Array.from(symbol.replace(/[◌ /]/g, ''))
                .map(
                  (c) =>
                    `${c} U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`,
                )
                .join(' · ')}
            </p>
          </details>
          <h4>示例发音</h4>
          {reference.clips.length ? (
            <>
              <div className="mark-recordings">
                {[...new Set(reference.clips.map((c) => c.speaker))].map(
                  (speaker) => (
                    <div key={speaker}>
                      <strong>{speaker}</strong>
                      <div>
                        {reference.clips
                          .filter((c) => c.speaker === speaker)
                          .map((recording, i) => (
                            <button
                              key={recording.url}
                              type="button"
                              onClick={() => play(recording)}
                              aria-pressed={clip?.url === recording.url}
                            >
                              <Volume2 size={15} />{' '}
                              {recording.example || `示例 ${i + 1}`}
                            </button>
                          ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
              <audio
                ref={player}
                hidden
                preload="none"
                aria-label="IPA 示例录音"
                onPlaying={() => {
                  setError('');
                  setPlayback('playing');
                  setAnimationPaused(false);
                  setReplay((n) => n || 1);
                }}
                onPause={() => {
                  setPlayback((state) =>
                    state === 'playing' ? 'paused' : state,
                  );
                  setAnimationPaused(true);
                }}
                onEnded={() => {
                  setPlayback('ended');
                  setAnimationPaused(false);
                }}
                onError={() => {
                  setPlayback('error');
                  setError('录音加载失败，请重试或打开 IPA 录音来源。');
                }}
              />
              {clip && (
                <div className="reference-audio-actions">
                  <button
                    className="text-button"
                    disabled={playback === 'loading'}
                    onClick={() => {
                      if (playback === 'playing') {
                        player.current?.pause();
                        return;
                      }
                      if (playback === 'paused') {
                        void player.current
                          ?.play()
                          .catch(() => setError('播放未成功，请重试。'));
                        return;
                      }
                      play(clip);
                    }}
                  >
                    {playback === 'playing' ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} />
                    )}
                    {playback === 'playing'
                      ? '暂停录音'
                      : playback === 'loading'
                        ? '正在加载'
                        : '播放录音'}
                  </button>
                  <button className="text-button" onClick={() => play(clip)}>
                    <RotateCcw size={16} />
                    重新试听
                  </button>
                </div>
              )}
              <output aria-live="polite">
                {error ||
                  (clip
                    ? `${clip.speaker} · ${clip.example || name}`
                    : '选择一位发音人的示例试听。')}
              </output>
              {clip && clip.context.length > 0 && (
                <p className="mark-animation-note">
                  原站所列记音例：{clip.context.join(' · ')}
                  。此录音未细分到单个例；剖面如有展示，以第一个记音例说明调音变化。
                </p>
              )}
            </>
          ) : (
            <p>原站未列出此记号的独立录音，可结合记音示例理解。</p>
          )}
          <a href={ipaAudioSource} target="_blank" rel="noreferrer">
            IPA 互动音标表 · 录音来源 ↗
          </a>
          <p className="mark-credit">
            录音由来源站提供，按发音人署名；不同发音人的实现可能存在差异。
          </p>
        </div>
        <div className="mark-detail-visual">
          <div className="reference-visual-heading">
            <h4>
              构形与气流<span>Articulation & airflow</span>
            </h4>
            {model && (
              <button
                className="text-button"
                onClick={() => {
                  setAnimationPaused(false);
                  setReplay((n) => n + 1);
                }}
                aria-label="重播剖面动画"
              >
                <RotateCcw size={16} />
                重播动画
              </button>
            )}
          </div>
          {model ? (
            <DetailAnimation
              key={`${illustration}-${replay}`}
              model={model}
              animate={replay > 0}
              paused={animationPaused}
            />
          ) : (
            <div className="reference-unmodeled">
              <AudioLines size={36} />
              <h4>从声音理解此记号</h4>
              <p>
                此例涉及当前剖面尚未建模的调音或韵律变化。请先选择左侧录音，结合说明比较声音；这些差异不能仅从舌头位置判断。
              </p>
              <p className="mark-detail-example">{example}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
