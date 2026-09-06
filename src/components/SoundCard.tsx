import { articulationContact } from '../engine/contact';
import { preset } from '../engine/geometry';
import { useState } from 'react';
import { Volume2, ArrowUpRight, Info } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type {
  AudioExample,
  Consonant,
  Features,
  Match,
} from '../domain/phonetics';
import { placeLabels, mannerLabels } from '../data/labels';
export function SoundCard({
  sound,
  features,
  match,
  onAudio,
  audioStatus,
  audio,
}: {
  sound: Consonant;
  features: Features;
  match?: Match;
  onAudio: () => void;
  audioStatus: string;
  audio?: AudioExample;
}) {
  const [tab, setTab] = useState('articulation');
  const contact =
    match?.contact ??
    articulationContact(preset(sound), sound.place, sound.manner);
  return (
    <aside className="sound-card">
      <div className="sound-top">
        <span className="eyebrow">
          {match ? 'CLOSEST MATCH' : 'SOUND PROFILE'}
        </span>
        <span className="sound-number">{sound.unicode.join(' · ')}</span>
      </div>
      <div className="symbol-row">
        <div className="big-ipa">
          <span>[</span>
          {sound.symbol}
          <span>]</span>
        </div>
        <button
          className="audio-button"
          onClick={onAudio}
          aria-label={`播放 ${sound.symbol} 示例发音`}
        >
          <Volume2 size={22} />
        </button>
      </div>
      <h2>{sound.zh}</h2>
      <p className="english-name">{sound.name}</p>
      <div
        className={`match-badge ${match?.status === 'none' ? 'warning' : ''}`}
      >
        <i />
        {match?.status === 'none'
          ? 'No exact IPA match'
          : '最近的典型构形'}{' '}
        <span>· 教学示意</span>
      </div>
      {match && (
        <output className="match-explanation">
          {match.explanation}
        </output>
      )}
      <div className="contact-pair">
        <span>
          主动器官 <i>→</i> 被动部位
        </span>
        <strong>
          {contact.active}
          <i> — </i>
          {contact.passive}
        </strong>
        {contact.note && <p>{contact.note}</p>}
      </div>
      <dl className="features">
        <div>
          <dt>
            调音部位 <span>Place</span>
          </dt>
          <dd>
            {sound.variant === 'alveolo-palatal'
              ? '龈腭'
              : sound.variant === 'epiglottal'
                ? '会厌'
                : placeLabels[match?.place ?? sound.place]}
            {sound.secondaryPlace
              ? ' + ' + placeLabels[sound.secondaryPlace]
              : ''}{' '}
            <span>{match?.place ?? sound.place}</span>
          </dd>
        </div>
        <div>
          <dt>
            调音方法 <span>Manner</span>
          </dt>
          <dd>
            {mannerLabels[features.manner]}{' '}
            <span>{features.manner.replaceAll('-', ' ')}</span>
          </dd>
        </div>
        <div>
          <dt>
            声带状态 <span>Voicing</span>
          </dt>
          <dd>
            {features.voiced ? '浊音' : '清音'}{' '}
            <span>{features.voiced ? 'voiced' : 'voiceless'}</span>
          </dd>
        </div>
        <div>
          <dt>
            软腭 <span>Velum</span>
          </dt>
          <dd>
            {features.velum === 'raised'
              ? '升起 · 鼻腔关闭'
              : '降低 · 鼻腔开放'}
          </dd>
        </div>
        <div>
          <dt>
            气流 <span>Airflow</span>
          </dt>
          <dd>
            {features.airflow === 'central' ? '中央' : '边侧'}{' '}
            <span>· 肺部呼气</span>
          </dd>
        </div>
      </dl>
      <Tabs
        value={tab}
        onValueChange={(v) => setTab(String(v))}
        className="info-tabs"
      >
        <TabsList variant="line">
          <TabsTrigger value="articulation">发音过程</TabsTrigger>
          <TabsTrigger value="acoustics">声学特征</TabsTrigger>
          <TabsTrigger value="examples">语言实例</TabsTrigger>
        </TabsList>
        <TabsContent value="articulation">
          <p>{sound.articulation}</p>
        </TabsContent>
        <TabsContent value="acoustics">
          <p>{sound.acoustics}</p>
        </TabsContent>
        <TabsContent value="examples">
          {sound.examples.map((e) => (
            <p key={e}>{e}</p>
          ))}
        </TabsContent>
      </Tabs>
      {match?.status === 'none' && (
        <div className="candidates">
          附近候选
          {match.candidates.map((c) => (
            <p key={c.sound.symbol}>
              <b>[{c.sound.symbol}]</b>{' '}
              {c.differences.join('；') || '需要调整接触程度'}
            </p>
          ))}
        </div>
      )}
      <div className="audio-caption">
        <Volume2 size={14} />
        <span>{audioStatus || 'Example pronunciation · 示例发音'}</span>
      </div>
      <a
        className="source-link"
        href={
          audio?.source ??
          `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(sound.audioFile.replaceAll(' ', '_'))}`
        }
        target="_blank"
        rel="noreferrer"
      >
        录音来源与许可 <ArrowUpRight size={13} />
      </a>
      {audio && (
        <details className="audio-attribution">
          <summary>
            {audio.speaker} · {audio.license}
          </summary>
          <p>
            示例不代表唯一标准实现；录音可能含元音上下文，与慢动作示意不逐帧同步。
          </p>
          <a href={audio.licenseUrl} target="_blank" rel="noreferrer">
            许可详情 ↗
          </a>
          <p>署名：{audio.attribution} · 原录音未修改</p>
        </details>
      )}
      <div className="model-note">
        <Info size={15} />
        <span>
          IPA
          表示调音类别，真实语音存在连续变化。此图不能完整表现舌沟、侧向形状或喉部细节。
        </span>
      </div>
    </aside>
  );
}
