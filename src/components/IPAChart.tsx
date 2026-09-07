import { useState } from 'react';
import { Search, ArrowUpRight } from 'lucide-react';
import { places } from '../domain/phonetics';
import { chartRows } from '../data/chart';
import { extendedConsonants } from '../data/additional-consonants';
import { consonants } from '../data/consonants';
import { airstreamLabels, nonPulmonicConsonants } from '../data/non-pulmonic';
import { placeLabels, mannerLabels, mannerEnglish } from '../data/labels';
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
      <div className="extension-chart">
        {['其他肺部辅音与次要调音', '常用塞擦音'].map((heading, i) => (
          <section key={heading}>
            <h3>{heading}</h3>
            <div>
              {extendedConsonants
                .filter((s) => (s.manner === 'affricate') === (i === 1))
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
                    <span>{s.zh}</span>
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
      <div className="extension-chart non-pulmonic-chart">
        {(['click', 'implosive', 'ejective'] as const).map((mechanism) => (
          <section key={mechanism}>
            <h3>{airstreamLabels[mechanism]}</h3>
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
                    <span>{s.zh}</span>
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
