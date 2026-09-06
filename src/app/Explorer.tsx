'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  AudioLines,
  Compass,
  SlidersHorizontal,
  GitCompareArrows,
  BookOpen,
  RotateCcw,
  Play,
  Pause,
  StepForward,
  ArrowUpRight,
  MousePointer2,
  Settings2,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Features, Mode, Pose } from '../domain/phonetics';
import { soundBySymbol } from '../data/consonants';
import { infer } from '../engine/inference';
import { useArticulation } from '../engine/animation';
import { VocalTract, type Display } from '../components/vocal-tract/VocalTract';
import { Glottis, TongueInset } from '../components/vocal-tract/Insets';
import { IPAChart } from '../components/IPAChart';
import { SoundCard } from '../components/SoundCard';
import { Controls, Range, Toggle } from '../components/Controls';
import { Compare } from '../features/Compare';
import { Lessons } from '../features/Lessons';
import { useExplorerTool } from '../engine/webmcp';
import { useAudio } from '../engine/audio';
const initial = soundBySymbol('ʃ');
export default function Explorer() {
  const [mode, setMode] = useState<Mode>('explore');
  const [selected, setSelected] = useState(initial);
  const [features, setFeatures] = useState<Features>(initial);
  const [display, setDisplay] = useState<Display>({
    labels: true,
    zones: true,
    points: true,
    airflow: true,
  });
  const [settings, setSettings] = useState(false);
  const animation = useArticulation(initial);
  const audio = useAudio();
  const match = useMemo(
    () => infer(animation.pose, features),
    [animation.pose, features],
  );
  const active = mode === 'build' ? match.candidates[0]!.sound : selected;
  function edit(p: Pose) {
    audio.stop();
    setMode('build');
    animation.edit(p);
  }
  function changeFeatures(f: Features) {
    setFeatures(f);
    animation.edit({
      ...animation.pose,
      velum: f.velum === 'lowered' ? 1 : 0,
      glottis: f.voiced ? 0.16 : 1,
    });
  }
  function select(symbol: string) {
    setMode('explore');
    const s = soundBySymbol(symbol);
    setSelected(s);
    setFeatures(s);
    animation.select(s, true);
    void audio.play(symbol);
  }
  useExplorerTool((symbol) => {
    const s = soundBySymbol(symbol);
    setMode('explore');
    setSelected(s);
    setFeatures(s);
    animation.select(s);
    audio.stop();
  });
  return (
    <>
      <header className="site-header">
        <Link href="/" className="brand">
          <span className="brand-mark">
            <AudioLines size={24} />
          </span>
          <div>
            Articulatory<span>PHONETICS EXPLORER</span>
          </div>
        </Link>
        <div className="header-right">
          <span className="edition">AN INTERACTIVE PHONETICS LAB</span>
          <span className="language">
            中文 <span>/ EN 术语</span>
          </span>
          <a
            href="https://www.internationalphoneticassociation.org/content/ipa-chart"
            target="_blank"
            rel="noreferrer"
            aria-label="国际语音协会"
          >
            IPA <ArrowUpRight size={14} />
          </a>
        </div>
      </header>
      <main>
        <div className="page-intro">
          <div>
            <span className="eyebrow">OBSERVE. EXPERIMENT. UNDERSTAND.</span>
            <h1>
              看见声音，如何发生<span>。</span>
            </h1>
            <p>
              交互式调音语音学实验室{' '}
              <span>探索发音器官、气流与声音之间的联系。</span>
            </p>
          </div>
          <div className="intro-note">
            <span className="status-dot on" /> 肺部呼气音
            <span>78 个辅音 · 一个连续的调音空间</span>
          </div>
        </div>
        <Tabs
          value={mode}
          onValueChange={(v) => {
            setMode(v as Mode);
            animation.edit(animation.pose);
            audio.stop();
          }}
          className="mode-tabs"
        >
          <TabsList variant="line" aria-label="实验模式">
            <TabsTrigger value="explore">
              <Compass />
              探索 IPA <span>Explore</span>
            </TabsTrigger>
            <TabsTrigger value="build">
              <SlidersHorizontal />
              构造声音 <span>Build</span>
            </TabsTrigger>
            <TabsTrigger value="compare">
              <GitCompareArrows />
              对比 <span>Compare</span>
            </TabsTrigger>
            <TabsTrigger value="lessons">
              <BookOpen />
              引导课程 <span>Lessons</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        {mode === 'compare' ? (
          <Compare onAudio={audio.play} />
        ) : mode === 'lessons' ? (
          <Lessons />
        ) : (
          <div className="lab-grid">
            <section className="vocal-panel">
              <div className="panel-heading">
                <div>
                  <span className="section-index">01</span>
                  <h2>
                    发音实验台 <span>Vocal tract</span>
                  </h2>
                </div>
                <div className="panel-actions">
                  <button
                    onClick={() => select(selected.symbol)}
                    title="恢复当前音的教学姿态"
                    aria-label="重置姿态"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    onClick={() => setSettings(!settings)}
                    aria-expanded={settings}
                    aria-label="显示设置"
                  >
                    <Settings2 size={17} />
                  </button>
                </div>
              </div>
              {settings && (
                <div className="display-settings">
                  {(['labels', 'airflow', 'zones', 'points'] as const).map(
                    (key, i) => (
                      <Toggle
                        key={key}
                        label={
                          ['解剖标签', '气流', '调音区域', '舌头控制点'][i]!
                        }
                        checked={display[key]}
                        onChange={(v) => setDisplay({ ...display, [key]: v })}
                      />
                    ),
                  )}
                </div>
              )}
              <div className="diagram-stage">
                <span className="view-tag">
                  SAGITTAL VIEW <span>矢状面</span>
                </span>
                <span className="orientation">前 ← → 后</span>
                <VocalTract
                  pose={animation.pose}
                  place={mode === 'build' ? match.place : selected.place}
                  display={display}
                  onEdit={edit}
                  flow={
                    animation.presentation
                      ? animation.frame.flow
                      : features.manner === 'nasal'
                        ? 'nasal'
                        : features.manner === 'fricative'
                          ? 'turbulent'
                          : features.manner === 'plosive'
                            ? 'off'
                            : 'smooth'
                  }
                  pressure={
                    animation.presentation ? animation.frame.pressure : 0
                  }
                  lateral={features.airflow === 'lateral'}
                  animated={!animation.reduced}
                />
                <div className="diagram-hint">
                  <MousePointer2 size={14} />
                  拖动金色控制点，探索调音空间<span>Shift 关闭吸附</span>
                </div>
              </div>
              <div className="insets">
                <Glottis
                  openness={animation.pose.glottis}
                  voiced={features.voiced}
                  animated={!animation.reduced}
                />
                <TongueInset lateral={features.airflow === 'lateral'} />
              </div>
              <div className="playback">
                <button
                  className="play-button"
                  onClick={() =>
                    mode === 'build' ? select(active.symbol) : animation.play()
                  }
                  aria-label={animation.playing ? '暂停动画' : '播放发音动画'}
                >
                  {animation.playing ? (
                    <Pause size={16} />
                  ) : (
                    <Play size={16} fill="currentColor" />
                  )}
                </button>
                <div className="timeline">
                  <div>
                    <strong>
                      {animation.playing ? animation.frame.phase : '发音过程'}
                    </strong>
                    <span>
                      {animation.reduced
                        ? '减少动态 · 单步模式'
                        : '慢动作教学示意'}
                    </span>
                  </div>
                  <Range
                    label="发音时间轴"
                    value={animation.progress}
                    onChange={animation.scrub}
                  />
                </div>
                <button
                  className="speed-button"
                  onClick={() =>
                    animation.setSpeed(
                      animation.speed === 0.5
                        ? 1
                        : animation.speed === 1
                          ? 0.25
                          : 0.5,
                    )
                  }
                  aria-label="切换播放速度"
                >
                  {animation.speed}×
                </button>
                <button
                  className="icon-button"
                  aria-label="下一发音阶段"
                  onClick={() =>
                    animation.scrub(
                      animation.progress >= 0.99
                        ? 0
                        : Math.min(1, animation.progress + 0.2),
                    )
                  }
                >
                  <StepForward size={16} />
                </button>
              </div>
            </section>
            <div className="right-column">
              {mode === 'build' && (
                <Controls
                  features={features}
                  pose={animation.pose}
                  onFeatures={changeFeatures}
                  onPose={edit}
                />
              )}
              <SoundCard
                sound={active}
                features={features}
                match={mode === 'build' ? match : undefined}
                onAudio={() => audio.play(active.symbol)}
                audioStatus={audio.status}
                audio={audio.manifest[active.symbol]}
              />
            </div>
          </div>
        )}
        <IPAChart selected={active.symbol} onSelect={select} />
        <footer>
          <span className="footer-brand">
            <AudioLines size={17} /> Articulatory Phonetics Explorer
          </span>
          <span>声音是连续的，符号是理解它的起点。</span>
          <a href="/attribution/anatomy.txt" target="_blank" rel="noreferrer">
            解剖参考与署名 ↗
          </a>
        </footer>
      </main>
    </>
  );
}
