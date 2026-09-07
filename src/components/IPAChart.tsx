import { useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { places } from '../domain/phonetics';
import { chartRows } from '../data/chart';
import { extendedConsonants } from '../data/additional-consonants';
import { consonants } from '../data/consonants';
import { airstreamLabels, nonPulmonicConsonants } from '../data/non-pulmonic';
import { placeLabels, mannerLabels, mannerEnglish } from '../data/labels';
import { IPAMarks } from './IPAMarks';
export function IPAChart({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (symbol: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  return (
    <section className="chart-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE SOUND ATLAS</span>
          <h2>
            探索辅音 <span>IPA consonants</span>
          </h2>
        </div>
        <label className="search">
          <Search size={15} />
          <input
            aria-label="搜索 IPA 符号或名称"
            placeholder="搜索音标或名称…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <kbd>IPA</kbd>
        </label>
      </div>
      <h3>
        辅音（肺部气流）
        <small className="term-english">Consonants (pulmonic)</small>
      </h3>
      <div className="chart-scroll">
        <table className="ipa-chart">
          <caption className="sr-only">
            肺部辅音表，每格左侧清音，右侧浊音
          </caption>
          <thead>
            <tr>
              <th scope="col">
                调音方法 <span>↓ Manner / Place →</span>
              </th>
              {places.map((p) => (
                <th key={p} scope="col">
                  {placeLabels[p]}
                  <span>{p}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chartRows.map((row) => (
              <tr key={row.manner}>
                <th scope="row">
                  {mannerLabels[row.manner]}
                  <span>{mannerEnglish[row.manner]}</span>
                </th>
                {row.cells.map((cell, i) => (
                  <td key={i} className={cell === '#' ? 'impossible' : ''}>
                    {cell === '#' ? (
                      <span title="官方 IPA 表阴影区域" aria-label="阴影区域" />
                    ) : (
                      cell.split(' ').map((symbol, j) => {
                        const s = consonants.find((s) => s.symbol === symbol);
                        const matches =
                          !query ||
                          `${symbol} ${s?.name ?? ''} ${s?.zh ?? ''}`
                            .toLowerCase()
                            .includes(query.toLowerCase());
                        return symbol === '-' ? (
                          <span key={j} className="empty-cell" />
                        ) : symbol === '#' ? (
                          <span key={j} className="half-impossible" />
                        ) : (
                          <button
                            key={j}
                            className={`ipa-key ${selected === symbol ? 'selected' : ''} ${!s ? 'unavailable' : ''} ${!matches ? 'dimmed' : ''}`}
                            title={
                              s
                                ? `${s.zh} · ${s.name}`
                                : `[${symbol}] · 后续扩展，暂无发音模型`
                            }
                            aria-pressed={selected === symbol}
                            onClick={() =>
                              s
                                ? onSelect(symbol)
                                : setNotice(
                                    `[${symbol}] 已列入完整 IPA 表，发音模型将在后续扩展。`,
                                  )
                            }
                          >
                            {symbol}
                          </button>
                        );
                      })
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <section className="alveolo-palatal-chart">
        <h3>
          龈腭辅音 <span>Alveolo-palatal</span>
        </h3>
        <p className="chart-note">
          舌叶后部与舌面前部共同抬高，狭窄区延伸至硬腭前部。与龈后 [ʃ ʒ]、硬腭
          [ç ʝ] 分开列示；[ɕ ʑ] 在官方 IPA 表中列于“其他符号”。
        </p>
        <div>
          {extendedConsonants
            .filter(
              (s) =>
                s.place === 'alveolo-palatal' &&
                (!query ||
                  `${s.symbol} ${s.name} ${s.zh}`
                    .toLowerCase()
                    .includes(query.toLowerCase())),
            )
            .map((s) => (
              <button
                key={s.symbol}
                className={
                  'extension-key ' + (selected === s.symbol ? 'selected' : '')
                }
                title={s.name}
                aria-pressed={selected === s.symbol}
                onClick={() => onSelect(s.symbol)}
              >
                <b>{s.symbol}</b>
                <span>
                  {s.zh}
                  <small className="term-english">{s.name}</small>
                </span>
              </button>
            ))}
        </div>
      </section>
      <div className="extension-chart">
        {[
          {
            heading: '其他符号 · 唇与舌的双重调音',
            en: 'Other symbols · Labial double articulations',
            symbols: ['ʍ', 'w', 'ɥ'],
          },
          {
            heading: '其他符号 · 会厌音',
            en: 'Other symbols · Epiglottals',
            symbols: ['ʜ', 'ʢ', 'ʡ'],
          },
          {
            heading: '其他符号 · 边闪音与同时调音',
            en: 'Other symbols · Lateral flap & simultaneous articulation',
            symbols: ['ɺ', 'ɧ'],
          },
          {
            heading: '次要调音 · 软腭化边音',
            en: 'Secondary articulation · Velarized lateral',
            symbols: ['ɫ'],
          },
          {
            heading: '常用塞擦音 · 齿龈、龈后与卷舌',
            en: 'Affricates · Alveolar, postalveolar & retroflex',
            symbols: ['t͡s', 'd͡z', 't͡ʃ', 'd͡ʒ', 'ʈ͡ʂ', 'ɖ͡ʐ'],
          },
        ].map(({ heading, en, symbols }) => (
          <section key={heading}>
            <h3>
              {heading}
              <small className="term-english">{en}</small>
            </h3>
            <div>
              {extendedConsonants
                .filter((s) => symbols.includes(s.symbol))
                .sort(
                  (a, b) =>
                    symbols.indexOf(a.symbol) - symbols.indexOf(b.symbol),
                )
                .filter(
                  (s) =>
                    !query ||
                    [s.symbol, s.name, s.zh]
                      .join(' ')
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                )
                .map((s) => (
                  <button
                    key={s.symbol}
                    title={s.name}
                    aria-pressed={selected === s.symbol}
                    className={
                      'extension-key ' +
                      (selected === s.symbol ? 'selected' : '')
                    }
                    onClick={() => onSelect(s.symbol)}
                  >
                    <b>{s.symbol}</b>
                    <span>
                      {s.zh}
                      <small className="term-english">{s.name}</small>
                    </span>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
      <div className="chart-footer">
        <span>
          <i className="legend-dot" /> 已支持 {consonants.length} 个音{' '}
          <span className="legend-muted">
            59 个肺部主表符号 + 19 个扩展 + 14 个非肺部条目
          </span>
        </span>
        <span>
          成对符号：左清 · 右浊{' '}
          <a
            href="https://www.internationalphoneticassociation.org/content/ipa-chart"
            target="_blank"
            rel="noreferrer"
            aria-label="查看官方 IPA 表"
          >
            <ArrowUpRight size={15} />
          </a>
        </span>
      </div>
      <h3>
        辅音（非肺部气流）
        <small className="term-english">Consonants (non-pulmonic)</small>
      </h3>
      <div className="extension-chart non-pulmonic-chart">
        {(['click', 'implosive', 'ejective'] as const).map((mechanism) => (
          <section key={mechanism}>
            <h3>
              {airstreamLabels[mechanism]}
              <small className="term-english">
                {
                  {
                    click: 'Clicks',
                    implosive: 'Voiced implosives',
                    ejective: 'Ejectives',
                  }[mechanism]
                }
              </small>
            </h3>
            <div>
              {nonPulmonicConsonants
                .filter(
                  (s) =>
                    s.airstream === mechanism &&
                    (!query ||
                      `${s.symbol} ${s.zh} ${s.name}`
                        .toLowerCase()
                        .includes(query.toLowerCase())),
                )
                .map((s) => (
                  <button
                    key={s.symbol}
                    className={
                      'extension-key ' +
                      (selected === s.symbol ? 'selected' : '')
                    }
                    aria-pressed={selected === s.symbol}
                    title={s.name}
                    onClick={() => onSelect(s.symbol)}
                  >
                    <b>{s.symbol}</b>
                    <span>
                      {s.zh}
                      <small className="term-english">{s.name}</small>
                    </span>
                  </button>
                ))}
            </div>
          </section>
        ))}
      </div>
      <p className="chart-note">
        非肺部辅音：覆盖官方表的搭嘴音与浊内爆音符号。ʼ
        是挤喉附加符号，列出官方四例；不代表穷尽所有附加符号组合。内爆音箭头表示喉部下降造成的局部内入趋势。
      </p>
      <p className="chart-note">
        齿、齿龈及齿龈后部分符号在官方表中跨列表示；此处居中放置。空白不代表不可发音，塞擦音及双重调音另列扩展。
      </p>
      <IPAMarks query={query} />
      {notice && (
        <output className="notice">
          {notice}
          <button onClick={() => setNotice('')} aria-label="关闭提示">
            ×
          </button>
        </output>
      )}
    </section>
  );
}
