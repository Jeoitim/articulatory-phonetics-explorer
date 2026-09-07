import { useState } from 'react';
import { Check, ArrowRight, Play } from 'lucide-react';
import type { Features, Pose } from '../domain/phonetics';
import { lessons } from '../data/lessons';
import { soundBySymbol } from '../data/consonants';
import { infer } from '../engine/inference';
import { useArticulation } from '../engine/animation';
import { VocalTract } from '../components/vocal-tract/VocalTract';
import { Controls } from '../components/Controls';
export function Lessons() {
  const [index, setIndex] = useState(0),
    [answer, setAnswer] = useState<number | null>(null),
    [completed, setCompleted] = useState<number[]>([]),
    [edited, setEdited] = useState(false);
  const lesson = lessons[index]!;
  const [f, setF] = useState<Features>(soundBySymbol('t'));
  const anim = useArticulation(soundBySymbol('t'));
  const match = infer(anim.pose, f);
  const achieved =
    edited &&
    lesson.target !== null &&
    match.candidates[0]?.sound.symbol === lesson.target &&
    (match.status === 'canonical' || match.status === 'closest');
  function edit(p: Pose) {
    setEdited(true);
    anim.edit(p);
  }
  function change(i: number) {
    setIndex(i);
    setAnswer(null);
    setEdited(false);
    const s = soundBySymbol(lessons[i]!.start);
    setF(s);
    anim.select(s);
  }
  return (
    <section className="lessons-layout">
      <nav aria-label="课程列表" className="lesson-list">
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
          LESSON {String(index + 1).padStart(2, '0')} / 10
        </span>
        <h2>{lesson.title}</h2>
        <p>{lesson.explanation}</p>
        <div className="lesson-task">
          <strong>动手试一试 {lesson.target && `[${lesson.target}]`}</strong>
          <p>{lesson.instruction}</p>
        </div>
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
                />
                <button
                  className="text-button"
                  onClick={() => {
                    const target = soundBySymbol(lesson.target!);
                    setF(target);
                    anim.select(target, true);
                    setEdited(false);
                  }}
                >
                  <Play size={14} />
                  准备目标音演示
                </button>
                <button className="text-button" onClick={anim.play}>
                  播放 / 暂停
                </button>
                <button className="text-button" onClick={() => change(index)}>
                  重新练习
                </button>
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
                  ? match.explanation
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
              if (index < 9) change(index + 1);
            }}
          >
            完成本课{index < 9 ? '，继续下一课' : ''}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
