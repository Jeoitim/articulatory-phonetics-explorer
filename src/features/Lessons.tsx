import { useEffect, useRef, useState } from 'react';
import {
  Check,
  ArrowRight,
  ChevronDown,
  Play,
  Pause,
  RotateCcw,
  Presentation,
  Volume2,
  Lightbulb,
  MoveHorizontal,
} from 'lucide-react';
import type { Features, Pose } from '../domain/phonetics';
import { lessons } from '../data/lessons';
import { soundBySymbol } from '../data/consonants';
import { infer } from '../engine/inference';
import { useArticulation } from '../engine/animation';
import { VocalTract } from '../components/vocal-tract/VocalTract';
import { Controls, Range } from '../components/Controls';
import {
  fricativeContinuum,
  sampleFricativeContinuum,
} from '../engine/fricative-continuum';
import { useAudio } from '../engine/audio';
export function Lessons() {
  const [index, setIndex] = useState(0),
    [answer, setAnswer] = useState<number | null>(null),
    [completed, setCompleted] = useState<number[]>([]),
    [edited, setEdited] = useState(false),
    [demonstrated, setDemonstrated] = useState(false),
    [observed, setObserved] = useState(false);
  const lesson = lessons[index]!;
  const [continuum, setContinuum] = useState(0);
  const [f, setF] = useState<Features>(soundBySymbol('t'));
  const anim = useArticulation(soundBySymbol('t'));
  const audio = useAudio();
  const actionsRef = useRef<HTMLDivElement>(null);
  const [wrapActions, setWrapActions] = useState(false);

  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;
    const checkOverflow = () => {
      const isNarrow = el.clientWidth < 540;
      const hasOverflow = Array.from(el.children).some(
        (child) =>
          (child as HTMLElement).scrollWidth > (child as HTMLElement).clientWidth,
      );
      setWrapActions(isNarrow || hasOverflow);
    };
    checkOverflow();
    const ro = new ResizeObserver(checkOverflow);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const match = infer(anim.pose, f);
  const achieved =
    (lesson.start === lesson.target && observed) ||
    (edited &&
      lesson.target !== null &&
      match.candidates[0]?.sound.symbol === lesson.target &&
      (match.status === 'canonical' || match.status === 'closest'));
  function edit(p: Pose) {
    setEdited(true);
    anim.edit(p);
  }
  function change(i: number) {
    audio.stop();
    setIndex(i);
    setContinuum(0);
    setAnswer(null);
    setEdited(false);
    setDemonstrated(false);
    setObserved(false);
    const s = soundBySymbol(lessons[i]!.start);
    setF(s);
    anim.select(s);
  }
  return (
    <section className="lessons-layout">
      <nav aria-label="课程列表" className="lesson-list">
        <div className="lesson-mobile-picker">
          <label htmlFor="lesson-picker">选择课程</label>
          <div className="lesson-picker-control">
            <select
              id="lesson-picker"
              value={index}
              onChange={(event) => change(Number(event.target.value))}
            >
              {lessons.map((lessonOption, lessonIndex) => (
                <option key={lessonOption.en} value={lessonIndex}>
                  {String(lessonIndex + 1).padStart(2, '0')} ·{' '}
                  {lessonOption.title}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" />
          </div>
          <span className="lesson-picker-count" aria-hidden="true">
            {String(index + 1).padStart(2, '0')} / {lessons.length}
          </span>
        </div>
        <span className="eyebrow">LEARN BY DOING</span>
        <h2>从观察到理解</h2>
        {lessons.map((l, i) => (
          <button
            key={l.en}
            className={i === index ? 'active' : ''}
            onClick={() => change(i)}
          >
            <span>
              {completed.includes(i) ? (
                <Check size={14} />
              ) : (
                String(i + 1).padStart(2, '0')
              )}
            </span>
            <div>
              {l.title}
              <small>{l.en}</small>
            </div>
          </button>
        ))}
      </nav>
      <div className="lesson-content">
        <span className="eyebrow">
          LESSON {String(index + 1).padStart(2, '0')} / {lessons.length}
        </span>
        <h2>{lesson.title}</h2>
        <p>{lesson.explanation}</p>
        <div className="lesson-task">
          <strong>动手试一试 {lesson.target && `[${lesson.target}]`}</strong>
          <p>{lesson.instruction}</p>
        </div>
        <ol className="lesson-progress" aria-label="本课完成步骤">
          <li className={achieved ? 'done' : 'current'}>
            {achieved ? '✓' : '1'}{' '}
            {lesson.start === lesson.target ? '观察发音过程' : '完成目标构形'}
          </li>
          <li
            className={
              answer === lesson.answer ? 'done' : achieved ? 'current' : ''
            }
          >
            {answer === lesson.answer ? '✓' : '2'} 回答小测试
          </li>
          <li className={achieved && answer === lesson.answer ? 'current' : ''}>
            3 完成本课
          </li>
        </ol>
        <details className="lesson-help" key={index}>
          <summary>
            <Lightbulb size={16} /> 不知道下一步？查看操作提示
          </summary>
          <p>{lesson.hint}</p>
          {lesson.target && (
            <button
              className="text-button"
              onClick={() => {
                const target = soundBySymbol(lesson.target!);
                setF(target);
                anim.select(target, true);
                setEdited(false);
                setDemonstrated(true);
                if (lesson.start === lesson.target) setObserved(true);
              }}
            >
              先看一次目标演示 <Presentation size={15} />
            </button>
          )}
          {demonstrated && lesson.target && (
            <button
              className="text-button"
              onClick={() => {
                const target = soundBySymbol(lesson.target!);
                setF(target);
                anim.select(target);
                setEdited(true);
                if (lesson.continuum) setContinuum(3);
              }}
            >
              跟随演示练习 · 保持目标构形 <Check size={15} />
            </button>
          )}
        </details>
        {lesson.continuum && (
          <div className="continuum-panel">
            <div className="continuum-heading">
              <MoveHorizontal size={18} />
              <strong>拖动滑块，连续改变调音构形</strong>
            </div>
            <p className="continuum-help">
              鼠标拖动或手指滑动；键盘可用方向键微调，End 到达
              [ç]。也可点击下方音标。
            </p>
            <Range
              label="连续构形 · s → ʃ → ɕ → ç"
              min={0}
              max={3}
              step={0.01}
              value={continuum}
              onChange={(t) => {
                setContinuum(t);
                setF(soundBySymbol('s'));
                edit(sampleFricativeContinuum(t));
              }}
            />
            <div className="continuum-scale" aria-hidden="true">
              <span>s</span>
              <span>ʃ</span>
              <span>ɕ</span>
              <span>ç</span>
            </div>
            <output className="continuum-position" aria-live="polite">
              当前位置：
              {Number.isInteger(continuum)
                ? `[${fricativeContinuum[continuum]!.symbol}]`
                : `[${fricativeContinuum[Math.floor(continuum)]!.symbol}] → [${fricativeContinuum[Math.ceil(continuum)]!.symbol}]`}
            </output>
            <div className="continuum-stops">
              {fricativeContinuum.map((step, i) => (
                <button
                  key={step.symbol}
                  aria-pressed={continuum === i}
                  onClick={() => {
                    setContinuum(i);
                    setF(soundBySymbol(step.symbol));
                    edit(sampleFricativeContinuum(i));
                  }}
                >
                  <b>[{step.symbol}]</b>
                  <span>{step.active}</span>
                  <small>{step.passive}</small>
                </button>
              ))}
            </div>
            <p>{fricativeContinuum[Math.round(continuum)]!.note}</p>
            <div className="continuum-examples" aria-label="四种擦音的语言例子">
              {fricativeContinuum.map((step) => (
                <p key={step.symbol}>
                  <b>[{step.symbol}]</b> {step.example}
                </p>
              ))}
              <a
                href="https://ling.cuhk.edu.hk/files/seminar/1st_2324/Poster_20231114.pdf"
                target="_blank"
                rel="noreferrer"
              >
                粤语咝音变体：香港中文大学研究介绍 ↗
              </a>
            </div>
            <p className="chart-note">
              整数节点为教学预设；节点之间是连续过渡，不保证每个中间位置都有唯一
              IPA 对应。
            </p>
          </div>
        )}
        {lesson.target && (
          <>
            <div className="lesson-experiment">
              <div className="vocal-panel">
                <VocalTract
                  airstream={f.airstream}
                  pose={anim.pose}
                  place={match.place}
                  display={{
                    labels: true,
                    zones: true,
                    points: true,
                    airflow: true,
                  }}
                  onEdit={edit}
                  flow={
                    anim.playing
                      ? anim.frame.flow
                      : f.manner === 'plosive'
                        ? 'off'
                        : 'smooth'
                  }
                  animated={!anim.reduced}
                  onAnatomyClick={(name) => {
                    if (!name.includes('软腭')) return;
                    const lowered = anim.pose.velum <= 0.5;
                    const next = {
                      ...f,
                      velum: lowered
                        ? ('lowered' as const)
                        : ('raised' as const),
                    };
                    setF(next);
                    edit({ ...anim.pose, velum: lowered ? 1 : 0 });
                  }}
                />
                <div
                  ref={actionsRef}
                  className={`lesson-actions${wrapActions ? ' actions-wrap' : ''}`}
                  aria-label="课程演示控制"
                >
                  <button
                    className="text-button"
                    onClick={() => {
                      const target = soundBySymbol(lesson.target!);
                      setF(target);
                      anim.select(target, true);
                      setEdited(false);
                      setDemonstrated(true);
                      if (lesson.start === lesson.target) setObserved(true);
                    }}
                  >
                    <Presentation size={15} />
                    <span>演示目标音</span>
                  </button>
                  <button
                    className="text-button"
                    onClick={() => {
                      anim.play();
                      if (lesson.start === lesson.target) setObserved(true);
                    }}
                  >
                    {anim.playing ? <Pause size={15} /> : <Play size={15} />}
                    <span>{anim.playing ? '暂停动画' : '播放动画'}</span>
                  </button>
                  <button
                    className="text-button"
                    onClick={() => {
                      void audio.play(lesson.target!);
                    }}
                  >
                    <Volume2 size={15} />
                    <span>听示例音</span>
                  </button>
                  <button className="text-button" onClick={() => change(index)}>
                    <RotateCcw size={15} />
                    <span>重新练习</span>
                  </button>
                </div>
                <output className="lesson-audio-status" aria-live="polite">
                  {audio.status}
                </output>
              </div>
              <Controls
                features={f}
                pose={anim.pose}
                onPose={edit}
                onFeatures={(next) => {
                  setF(next);
                  edit({
                    ...anim.pose,
                    velum: next.velum === 'lowered' ? 1 : 0,
                    glottis: next.voiced ? 0.16 : 1,
                  });
                }}
              />
            </div>
            <output
              className={
                achieved ? 'lesson-feedback correct' : 'lesson-feedback'
              }
            >
              {achieved
                ? '✓ 与目标教学构形一致。请完成下面的小测试。'
                : edited
                  ? match.status === 'none' || match.status === 'unsupported'
                    ? match.explanation
                    : match.nonTypical
                      ? match.explanation
                      : `[${match.candidates[0]?.sound.symbol ?? ''}] ${match.explanation}`
                  : '提示：拖动控制点或调整参数，系统将根据构形与特征共同判断。'}
            </output>
          </>
        )}
        <div className="quiz">
          <span className="eyebrow">CHECK YOUR UNDERSTANDING</span>
          <h3>{lesson.question}</h3>
          {lesson.options.map((o, i) => (
            <button
              className={
                answer === i
                  ? i === lesson.answer
                    ? 'correct'
                    : 'incorrect'
                  : ''
              }
              key={o}
              onClick={() => setAnswer(i)}
            >
              {o}
            </button>
          ))}
          {answer !== null && (
            <output>
              {answer === lesson.answer
                ? '✓ 回答正确。'
                : '再想一想，回顾上面的气流与器官关系。'}
            </output>
          )}
          <button
            disabled={
              answer !== lesson.answer || (lesson.target !== null && !achieved)
            }
            className="next-lesson"
            onClick={() => {
              setCompleted([...new Set([...completed, index])]);
              if (index < lessons.length - 1) change(index + 1);
            }}
          >
            完成本课{index < lessons.length - 1 ? '，继续下一课' : ''}
            <ArrowRight size={14} />
          </button>
          <p className="lesson-next-hint" aria-live="polite">
            {completed.includes(index)
              ? '本课已完成。可以重新练习或从课程列表选择其他课程。'
              : !achieved && lesson.target
                ? `下一步：先完成上方${lesson.start === lesson.target ? '动画观察' : '目标构形'}；卡住时展开操作提示。`
                : answer !== lesson.answer
                  ? '下一步：回答上面的小测试，答对后即可完成本课。'
                  : '已准备好，点击“完成本课”继续。'}
          </p>
        </div>
      </div>
    </section>
  );
}
