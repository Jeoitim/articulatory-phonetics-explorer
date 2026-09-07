import { ipaMarkGroups } from '../data/ipa-marks';
import { useState } from 'react';
import { Popover } from '@base-ui/react/popover';
import {
  chineseIPAReference,
  markEnglish,
  markGroupEnglish,
} from '../data/ipa-mark-details';
import { IPAReferenceDetails } from './IPAReferenceDetails';

export function IPAMarks({ query }: { query: string }) {
  const [active, setActive] = useState<string | null>(null);
  const needle = query.trim().normalize('NFD').toLowerCase();
  return (
    <section className="ipa-reference" aria-label="IPA 附加符号、超音段和声调">
      <h3>
        附加符号、超音段与声调
        <small className="term-english">
          Diacritics, suprasegmentals & tones
        </small>
      </h3>
      <p className="chart-note">
        符号与术语翻译参考
        <a href={chineseIPAReference} target="_blank" rel="noreferrer">
          中国语言学会（2007）
        </a>
        。
        点击符号可查看说明和示例发音。虚线圆圈仅表示符号附着的位置；有下伸部分的音标可将部分附加符号写在上方，如
        [ŋ̊]。这些记号描述音质、时长或韵律，不各自对应一个独立辅音。
      </p>
      <div className="ipa-reference-grid">
        {ipaMarkGroups.map((group) => {
          const entries = group.entries.filter(
            (entry) =>
              !needle ||
              `${group.title} ${entry.join(' ')} ${markEnglish[entry[1]]} ${markGroupEnglish[group.title]}`
                .normalize('NFD')
                .toLowerCase()
                .includes(needle),
          );
          return (
            entries.length > 0 && (
              <section key={group.title}>
                <h4>
                  {group.title}
                  <small className="term-english">
                    {markGroupEnglish[group.title]}
                  </small>
                </h4>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">
                        符号<small className="term-english">Symbol</small>
                      </th>
                      <th scope="col">
                        含义<small className="term-english">Description</small>
                      </th>
                      <th scope="col">
                        示例<small className="term-english">Examples</small>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(([symbol, name, example]) => (
                      <tr key={name}>
                        <td className="ipa-mark">
                          <Popover.Root
                            open={active === name}
                            onOpenChange={(open) =>
                              setActive(open ? name : null)
                            }
                          >
                            <Popover.Trigger
                              className="mark-trigger"
                              aria-label={`${name}：查看说明与示例发音`}
                            >
                              {symbol}
                            </Popover.Trigger>
                            {active === name && (
                              <Popover.Portal>
                                <Popover.Positioner
                                  side="bottom"
                                  align="start"
                                  sideOffset={8}
                                  className="mark-popover-positioner"
                                >
                                  <Popover.Popup className="mark-popover">
                                    <IPAReferenceDetails
                                      symbol={symbol}
                                      name={name}
                                      example={example}
                                    />
                                  </Popover.Popup>
                                </Popover.Positioner>
                              </Popover.Portal>
                            )}
                          </Popover.Root>
                        </td>
                        <th scope="row">
                          {name}
                          <small className="term-english">
                            {markEnglish[name]}
                          </small>
                        </th>
                        <td className="ipa-example">{example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )
          );
        })}
      </div>
      <p className="chart-note">
        平调与非平调并列展示附加调号和五度制调符；升阶、降阶表示相对于前一调域的变化。
        <a
          href="https://www.internationalphoneticassociation.org/content/ipa-chart"
          target="_blank"
          rel="noreferrer"
        >
          国际语音学会 IPA 表 ↗
        </a>
      </p>
    </section>
  );
}
