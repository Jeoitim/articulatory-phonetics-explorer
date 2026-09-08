import { limitLowerLip, moveJaw } from '../engine/geometry';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import type { Airstream, Features, Pose, Manner } from '../domain/phonetics';
import { airstreamLabels } from '../data/non-pulmonic';
import { mannerLabels, mannerEnglish } from '../data/labels';
export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </label>
  );
}
export function Range({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="range">
      <label>{label}</label>
      <Slider
        aria-label={label}
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(v) => onChange(Array.isArray(v) ? v[0]! : v)}
      />
    </div>
  );
}
export function Controls({
  features,
  pose,
  onFeatures,
  onPose,
}: {
  features: Features;
  pose: Pose;
  onFeatures: (f: Features) => void;
  onPose: (p: Pose) => void;
}) {
  return (
    <div className="build-controls">
      <div className="control-heading">
        构音参数 <span>改变一个条件，观察变化</span>
      </div>
      <Select
        value={features.manner}
        onValueChange={(v) =>
          v && onFeatures({ ...features, manner: v as Manner })
        }
      >
        <SelectTrigger aria-label="调音方法">
          <SelectValue>
            {mannerLabels[features.manner]} · {mannerEnglish[features.manner]}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {(
            [
              'plosive',
              'nasal',
              'fricative',
              'approximant',
              'lateral-approximant',
              'trill',
              'tap',
              'lateral-fricative',
              'affricate',
            ] as Manner[]
          ).map((m) => (
            <SelectItem value={m} key={m}>
              {mannerLabels[m]} · {mannerEnglish[m]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Toggle
        label="声带振动 · Voiced"
        checked={features.voiced}
        onChange={(voiced) => onFeatures({ ...features, voiced })}
      />
      <Select
        value={features.airstream}
        onValueChange={(v) =>
          v && onFeatures({ ...features, airstream: v as Airstream })
        }
      >
        <SelectTrigger aria-label="气流机制">
          <SelectValue>{airstreamLabels[features.airstream]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.entries(airstreamLabels).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {features.airstream !== 'pulmonic-egressive' &&
        features.airstream !== 'click' && (
          <Range
            label="喉部位置 · 上升 − / 下降 +"
            min={-1}
            max={1}
            value={pose.larynx}
            onChange={(larynx) => onPose({ ...pose, larynx })}
          />
        )}
      <Toggle
        label="鼻咽通道开放 · Nasal"
        checked={features.velum === 'lowered'}
        onChange={(lowered) =>
          onFeatures({ ...features, velum: lowered ? 'lowered' : 'raised' })
        }
      />
      <Toggle
        label="边侧气流 · Lateral"
        checked={features.airflow === 'lateral'}
        onChange={(lateral) =>
          onFeatures({ ...features, airflow: lateral ? 'lateral' : 'central' })
        }
      />
      <Range
        label="下唇闭合度"
        value={pose.lowerLip}
        onChange={(lowerLip) => onPose(limitLowerLip({ ...pose, lowerLip }))}
      />
      <Range
        label="下颌开度"
        value={pose.jaw}
        onChange={(jaw) => onPose(moveJaw(pose, jaw))}
      />
      <Toggle
        label="下唇接近上齿 · 唇齿"
        checked={pose.dentalContact > 0.5}
        onChange={(v) => onPose({ ...pose, dentalContact: v ? 1 : 0 })}
      />
      <Range
        label="圆唇程度"
        value={pose.rounding}
        onChange={(rounding) => onPose({ ...pose, rounding })}
      />
      <Range
        label="声门开放度"
        value={pose.glottis}
        onChange={(glottis) => onPose({ ...pose, glottis })}
      />
      <Range
        label="会厌区狭窄 · 喉入口"
        value={pose.epiglottis}
        onChange={(epiglottis) => onPose({ ...pose, epiglottis })}
      />
      <p className="chart-note">
        会厌下部有组织附着，上部为游离缘，与舌根之间留有会厌谷；并非整片贴在舌面，也不是悬空的软骨。
      </p>
      <p className="chart-note">
        杓会厌区向前上方收拢，接近会厌喉面；会厌随舌根及喉部位移，并非主动翻盖。咽化保留前部主调音，后部狭窄位置因语言和说话者而异。二维图为教学简化。
      </p>
      <a
        className="chart-note"
        href="https://www.mcgill.ca/mcgwpl/files/mcgwpl/moisik2012.pdf"
        target="_blank"
        rel="noreferrer"
      >
        会厌区调音研究 ↗
      </a>
      <a
        className="chart-note"
        href="https://www.phonetik.uni-muenchen.de/~hoole/kurse/movies/eslingmovies/esling_demomovie.html"
        target="_blank"
        rel="noreferrer"
      >
        杓会厌机制喉镜示例 ↗
      </a>
      <a
        className="chart-note"
        href="https://www.isca-archive.org/interspeech_2017/hermes17_interspeech.html"
        target="_blank"
        rel="noreferrer"
      >
        咽音与咽化的实时 MRI 对照 ↗
      </a>
    </div>
  );
}
