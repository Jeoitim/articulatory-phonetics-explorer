import './compile-model.mjs';
import { mkdir, writeFile } from 'node:fs/promises';
const { consonants } = await import('../work/verify/src/data/consonants.js');
const { preset, isPlausible } =
  await import('../work/verify/src/engine/geometry.js');
const { infer } = await import('../work/verify/src/engine/inference.js');
const { articulatoryVariants } =
  await import('../work/verify/src/engine/variants.js');
const { placeLabels } = await import('../work/verify/src/data/labels.js');
const rows = consonants.map((s) => {
  const p = preset(s),
    m = infer(p, s),
    variants = articulatoryVariants(s);
  if (
    !isPlausible(p) ||
    m.candidates[0].sound.symbol !== s.symbol ||
    m.place !== s.place ||
    m.status === 'none'
  )
    throw Error('Preset inconsistency: ' + s.symbol);
  return `| ${s.symbol} | ${placeLabels[s.place]} (${s.place}) | ${m.contact.active} | ${m.contact.passive} | ${variants.map((v) => v.label + ' *').join('、') || '未提供独立变体'} | ${m.status === 'canonical' ? '预设一致' : '仅作近似'} |`;
});
await mkdir('docs', { recursive: true });
await writeFile(
  'docs/phonetic-audit.md',
  `# 辅音模型核对记录

覆盖 ${consonants.length} 个辅音条目。运行 node scripts/audit-phonetics.mjs 可重新生成本表。

本次检查覆盖 IPA 类别、主动与被动调音器官、附加调音、预设推断一致性、轮廓自交及已提供的变体。下表从实现导出，说明每个条目实际展示什么；自动通过不等于获得语音实验或生物力学验证。

## 修正及解释

- [ʃ ʒ] 采用舌叶型龈后预设；舌尖型匹配保留原符号，另标星号。不能单凭舌尖或舌叶靠近龈后就判为 [ɕ]。
- [ɕ ʑ t͡ɕ d͡ʑ] 使用独立 alveolo-palatal 部位。识别需要舌叶后部及舌面前部共同抬高；在图中展示延伸至硬腭前部的狭窄区，不只是另一个孤立接触点。
- [ç ʝ] 的主要器官为舌面前部；[s] 可有舌尖型或舌叶型。[s ʃ ɕ] 的咝声涉及三维舌沟、齿前喷流和声学特性，当前二维图不计算这些量。
- [w ʍ ɥ] 同时列出双唇和舌部；[ɫ] 同时列出前部接触及后舌参与；搭嘴音列出前后两处闭塞。
- 边音的舌侧通道、颤音与闪音的时间行为、声门音受相邻元音影响的口腔形状，以及咽/会厌区的三维活动，不能仅凭一张矢状面确定。[ɧ] 明确保留为近似模型。
- 24 个可选变体覆盖齿龈舌叶型、龈后舌尖型和较弱反卷。星号仅表示不同于本项目教学预设，不是 IPA 附加符号，也不是“不可发音”或“不合语法”的标记。其他条目未提供变体，不表示现实中不存在变体。
- 连续体 s → ʃ → ɕ → ç 的图形参数、分类阈值是教学选择，不能当成实测的连续语音音类边界。课程中的端点是预设，中间位置只作过渡。

## 依据

- [国际语音协会官方 IPA 表](https://www.internationalphoneticassociation.org/content/ipa-chart)：主表分类以及“其他符号”中的 [ɕ ʑ]。
- [Ersu，JIPA](https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/ersu/C91C8AD692A11052A92B6C9FB4267F72)：龈腭构形的舌叶及舌体共同参与。
- [Shanghai Chinese，JIPA](https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/shanghai-chinese/E58F14205E5EFF63067C6A180DB7AEEA)：舌叶/舌尖与舌面前部抬高的描述。
- [The Xiangxiang dialect of Chinese，JIPA](https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/xiangxiang-dialect-of-chinese/75F1E69ACCC8AC46EED81F8EE1B1CB85)：舌尖、舌叶与不同卷舌实现的区别。

## 逐音核对

| 音标 | 部位 | 主动器官 | 被动部位 | 可选变体 | 构形匹配 |
| --- | --- | --- | --- | --- | --- |
${rows.join('\n')}
`,
);
console.log(
  'Audited ' +
    consonants.length +
    ' consonant presets; wrote docs/phonetic-audit.md',
);
