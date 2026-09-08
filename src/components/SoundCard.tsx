import { articulationContact } from '../engine/contact';
import { airstreamLabels } from '../data/non-pulmonic';
import { preset } from '../engine/geometry';
import { articulatoryVariants } from '../engine/variants';
import type { Pose, VariantMark } from '../domain/phonetics';
import { useState } from 'react';
import { Volume2, ArrowUpRight, Info } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type {
  AudioExample,
  Consonant,
  Features,
  Match,
} from '../domain/phonetics';
import {
  placeLabels,
  mannerLabels,
  variantPrefixLabels,
  variantEnglishPrefixLabels,
} from '../data/labels';
import { UnmatchedSoundCard } from './UnmatchedSoundCard';
import { IPAToken } from './IPAToken';
export function SoundCard({
  sound,
  features,
  match,
  onAudio,
  audioStatus,
  audio,
  onVariant,
  onReset,
}: {
  sound: Consonant;
  features: Features;
  match?: Match;
  onAudio: () => void;
  audioStatus: string;
  audio?: AudioExample;
  onVariant?: (pose: Pose, mark?: VariantMark) => void;
  onReset?: () => void;
}) {
  const [tab, setTab] = useState('articulation');
  if (match?.status === 'none' || match?.status === 'unsupported')
    return <UnmatchedSoundCard match={match} features={features} />;
  const contact =
    match?.contact ??
    articulationContact(preset(sound), sound.place, sound.manner, sound);
  const variants = articulatoryVariants(sound);
  const variantMark = match?.variantMark;
  const specificVariant = Boolean(match?.nonTypical && variantMark);
  const displayedSymbol =
    sound.symbol + (specificVariant && variantMark ? variantMark : '');
  const title =
    specificVariant && variantMark
      ? `${variantPrefixLabels[variantMark] ?? ''}${sound.zh}`
      : sound.zh;
  const englishName =
    specificVariant && variantMark
      ? `${variantEnglishPrefixLabels[variantMark] ?? 'Modified'} ${
          sound.name.length > 0
            ? sound.name[0]!.toLowerCase() + sound.name.slice(1)
            : sound.name
        }`
      : sound.name;
  // A marked realization is only playable when its exact local reference clip
  // exists. Never silently substitute the unmarked consonant recording.
  const canPlayAudio = !specificVariant || Boolean(audio);
  return (
    <aside className="sound-card">
      <div className="sound-summary">
        <div className="sound-top">
          <span className="eyebrow">
            {match ? 'CLOSEST MATCH' : 'SOUND PROFILE'}
          </span>
          <span className="sound-number">{sound.unicode.join(' · ')}</span>
        </div>
        <div className="symbol-row">
          <div className="big-ipa">
            <span className="ipa-bracket">[</span>
            <IPAToken
              symbol={sound.symbol}
              mark={specificVariant ? variantMark : undefined}
            />
            <span className="ipa-bracket">]</span>
          </div>
          {canPlayAudio && (
            <button
              className="audio-button"
              onClick={onAudio}
              aria-label={`播放 ${displayedSymbol} 示例发音`}
            >
              <Volume2 size={22} />
            </button>
          )}
        </div>
        <h2>{title}</h2>
        <p className="english-name">{englishName}</p>
        <div className="match-badge">
          <i />
          {match?.nonTypical ? '主动调音变体' : '最近的典型构形'}{' '}
          <span>· 教学示意</span>
        </div>
        {match && (
          <output className="match-explanation">{match.explanation}</output>
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
        {onVariant && variants.length > 0 && (
          <div className="realization-options">
            <span>主动调音变体</span>
            <div>
              <button
                onClick={() =>
                  onReset ? onReset() : onVariant(preset(sound))
                }
              >
                教学预设
              </button>
              {variants.map((v) => (
                <button key={v.label} onClick={() => onVariant(v.pose, v.mark)}>
                  {v.label}
                  {v.mark ? ` · [${sound.symbol}${v.mark}]` : ''}
                </button>
              ))}
            </div>
            <p>
              齿化、舌唇、舌尖性、舌叶性、腭化、软腭化、咽化、唇化、送气与清浊化均直接使用
              IPA 附加符号标示。只有存在同一变体的本地录音时才提供播放入口。
            </p>
          </div>
        )}
      </div>
      <div className="sound-detail">
        <dl className="features">
          <div>
            <dt>
              调音部位 <span>Place</span>
            </dt>
            <dd>
              {sound.variant === 'epiglottal'
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
              <span>· {airstreamLabels[features.airstream]}</span>
            </dd>
          </div>
        </dl>
        <div className="sound-extra">
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
          {canPlayAudio && (
            <>
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
            </>
          )}
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
        </div>
        <div className="model-note">
          <Info size={15} />
          <span>
            IPA
            表示调音类别，真实语音存在连续变化。此图不能完整表现舌沟、侧向形状或喉部细节。
          </span>
        </div>
      </div>
    </aside>
  );
}
