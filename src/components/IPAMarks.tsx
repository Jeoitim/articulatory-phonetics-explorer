import { ipaMarkGroups } from '../data/ipa-marks';

export function IPAMarks({ query }: { query: string }) {
  const needle = query.trim().normalize('NFD').toLowerCase();
  return (
    <section className="ipa-reference" aria-label="IPA 附加符号、超音段和声调">
      <h3>附加符号、超音段与声调</h3>
      <p className="chart-note">
        按所提供中文 IPA
        图整理。虚线圆圈仅表示符号附着的位置；有下伸部分的音标可将部分附加符号写在上方，如
        [ŋ̊]。这些记号描述音质、时长或韵律，不各自对应一个独立辅音。
      </p>
      <div className="ipa-reference-grid">
        {ipaMarkGroups.map((group) => {
          const entries = group.entries.filter(
            (entry) =>
              !needle ||
              `${group.title} ${entry.join(' ')}`
                .normalize('NFD')
                .toLowerCase()
                .includes(needle),
          );
          return (
            entries.length > 0 && (
              <section key={group.title}>
                <h4>{group.title}</h4>
                <table>
                  <thead>
                    <tr>
                      <th scope="col">符号</th>
                      <th scope="col">含义</th>
                      <th scope="col">示例</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map(([symbol, name, example]) => (
                      <tr key={name}>
                        <td className="ipa-mark">{symbol}</td>
                        <th scope="row">{name}</th>
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
