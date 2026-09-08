# 辅音模型核对记录

覆盖 92 个辅音条目。运行 node scripts/audit-phonetics.mjs 可重新生成本表。

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

| 音标 | 部位                   | 主动器官                     | 被动部位         | 可选变体       | 构形匹配 |
| ---- | ---------------------- | ---------------------------- | ---------------- | -------------- | -------- |
| p    | 双唇 (bilabial)        | 下唇                         | 上唇             | 未提供独立变体 | 预设一致 |
| b    | 双唇 (bilabial)        | 下唇                         | 上唇             | 未提供独立变体 | 预设一致 |
| m    | 双唇 (bilabial)        | 下唇                         | 上唇             | 未提供独立变体 | 预设一致 |
| t    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 舌叶型 *       | 预设一致 |
| d    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 舌叶型 *       | 预设一致 |
| n    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 舌叶型 *       | 预设一致 |
| s    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 舌叶型 *       | 预设一致 |
| z    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 舌叶型 *       | 预设一致 |
| l    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 舌叶型 *       | 预设一致 |
| ɹ    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 未提供独立变体 | 预设一致 |
| ʃ    | 齿龈后 (postalveolar)  | 舌叶（舌尖后方）             | 龈后             | 舌尖型 *       | 预设一致 |
| ʒ    | 齿龈后 (postalveolar)  | 舌叶（舌尖后方）             | 龈后             | 舌尖型 *       | 预设一致 |
| ɾ    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 未提供独立变体 | 预设一致 |
| r    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 未提供独立变体 | 预设一致 |
| j    | 硬腭 (palatal)         | 舌面前部                     | 硬腭             | 未提供独立变体 | 预设一致 |
| k    | 软腭 (velar)           | 舌面后部                     | 软腭             | 未提供独立变体 | 预设一致 |
| ɡ    | 软腭 (velar)           | 舌面后部                     | 软腭             | 未提供独立变体 | 预设一致 |
| ŋ    | 软腭 (velar)           | 舌面后部                     | 软腭             | 未提供独立变体 | 预设一致 |
| x    | 软腭 (velar)           | 舌面后部                     | 软腭             | 未提供独立变体 | 预设一致 |
| f    | 唇齿 (labiodental)     | 下唇                         | 上门齿           | 未提供独立变体 | 预设一致 |
| v    | 唇齿 (labiodental)     | 下唇                         | 上门齿           | 未提供独立变体 | 预设一致 |
| θ    | 齿 (dental)            | 舌尖前端                     | 上齿             | 未提供独立变体 | 预设一致 |
| ð    | 齿 (dental)            | 舌尖前端                     | 上齿             | 未提供独立变体 | 预设一致 |
| h    | 声门 (glottal)         | 声带                         | 对侧声带／声门   | 未提供独立变体 | 仅作近似 |
| ʈ    | 卷舌 (retroflex)       | 反卷舌尖／舌尖下表面         | 龈后／硬腭前缘   | 较弱反卷 *     | 预设一致 |
| ɖ    | 卷舌 (retroflex)       | 反卷舌尖／舌尖下表面         | 龈后／硬腭前缘   | 较弱反卷 *     | 预设一致 |
| c    | 硬腭 (palatal)         | 舌面前部                     | 硬腭             | 未提供独立变体 | 预设一致 |
| ɟ    | 硬腭 (palatal)         | 舌面前部                     | 硬腭             | 未提供独立变体 | 预设一致 |
| q    | 小舌 (uvular)          | 舌面后部                     | 小舌区           | 未提供独立变体 | 预设一致 |
| ɢ    | 小舌 (uvular)          | 舌面后部                     | 小舌区           | 未提供独立变体 | 预设一致 |
| ʔ    | 声门 (glottal)         | 声带                         | 对侧声带／声门   | 未提供独立变体 | 仅作近似 |
| ɱ    | 唇齿 (labiodental)     | 下唇                         | 上门齿           | 未提供独立变体 | 预设一致 |
| ɳ    | 卷舌 (retroflex)       | 反卷舌尖／舌尖下表面         | 龈后／硬腭前缘   | 较弱反卷 *     | 预设一致 |
| ɲ    | 硬腭 (palatal)         | 舌面前部                     | 硬腭             | 未提供独立变体 | 预设一致 |
| ɴ    | 小舌 (uvular)          | 舌面后部                     | 小舌区           | 未提供独立变体 | 预设一致 |
| ʙ    | 双唇 (bilabial)        | 下唇                         | 上唇             | 未提供独立变体 | 预设一致 |
| ʀ    | 小舌 (uvular)          | 小舌                         | 舌面后部         | 未提供独立变体 | 预设一致 |
| ⱱ    | 唇齿 (labiodental)     | 下唇                         | 上门齿           | 未提供独立变体 | 预设一致 |
| ɽ    | 卷舌 (retroflex)       | 反卷舌尖／舌尖下表面         | 龈后／硬腭前缘   | 较弱反卷 *     | 预设一致 |
| ɸ    | 双唇 (bilabial)        | 下唇                         | 上唇             | 未提供独立变体 | 预设一致 |
| β    | 双唇 (bilabial)        | 下唇                         | 上唇             | 未提供独立变体 | 预设一致 |
| ʂ    | 卷舌 (retroflex)       | 反卷舌尖／舌尖下表面         | 龈后／硬腭前缘   | 较弱反卷 *     | 预设一致 |
| ʐ    | 卷舌 (retroflex)       | 反卷舌尖／舌尖下表面         | 龈后／硬腭前缘   | 较弱反卷 *     | 预设一致 |
| ç    | 硬腭 (palatal)         | 舌面前部                     | 硬腭             | 未提供独立变体 | 预设一致 |
| ʝ    | 硬腭 (palatal)         | 舌面前部                     | 硬腭             | 未提供独立变体 | 预设一致 |
| ɣ    | 软腭 (velar)           | 舌面后部                     | 软腭             | 未提供独立变体 | 预设一致 |
| χ    | 小舌 (uvular)          | 舌面后部                     | 小舌区           | 未提供独立变体 | 预设一致 |
| ʁ    | 小舌 (uvular)          | 舌面后部                     | 小舌区           | 未提供独立变体 | 预设一致 |
| ħ    | 咽 (pharyngeal)        | 舌根                         | 咽后壁           | 未提供独立变体 | 预设一致 |
| ʕ    | 咽 (pharyngeal)        | 舌根                         | 咽后壁           | 未提供独立变体 | 预设一致 |
| ɦ    | 声门 (glottal)         | 声带                         | 对侧声带／声门   | 未提供独立变体 | 仅作近似 |
| ɬ    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 舌叶型 *       | 预设一致 |
| ɮ    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 舌叶型 *       | 预设一致 |
| ʋ    | 唇齿 (labiodental)     | 下唇                         | 上门齿           | 未提供独立变体 | 预设一致 |
| ɻ    | 卷舌 (retroflex)       | 反卷舌尖／舌尖下表面         | 龈后／硬腭前缘   | 未提供独立变体 | 预设一致 |
| ɰ    | 软腭 (velar)           | 舌面后部                     | 软腭             | 未提供独立变体 | 预设一致 |
| ɭ    | 卷舌 (retroflex)       | 反卷舌尖／舌尖下表面         | 龈后／硬腭前缘   | 较弱反卷 *     | 预设一致 |
| ʎ    | 硬腭 (palatal)         | 舌面前部                     | 硬腭             | 未提供独立变体 | 预设一致 |
| ʟ    | 软腭 (velar)           | 舌面后部                     | 软腭             | 未提供独立变体 | 预设一致 |
| ɧ    | 齿龈后 (postalveolar)  | 舌叶与舌背（本示意）         | 龈后与后部狭窄区 | 未提供独立变体 | 仅作近似 |
| w    | 软腭 (velar)           | 双唇 ＋ 舌面后部             | 唇间 ＋ 软腭     | 未提供独立变体 | 预设一致 |
| ʍ    | 软腭 (velar)           | 双唇 ＋ 舌面后部             | 唇间 ＋ 软腭     | 未提供独立变体 | 预设一致 |
| ɥ    | 硬腭 (palatal)         | 双唇 ＋ 舌面前部             | 唇间 ＋ 硬腭     | 未提供独立变体 | 预设一致 |
| ɕ    | 龈腭 (alveolo-palatal) | 舌叶后部与舌面前部           | 龈后至硬腭前部   | 未提供独立变体 | 预设一致 |
| ʑ    | 龈腭 (alveolo-palatal) | 舌叶后部与舌面前部           | 龈后至硬腭前部   | 未提供独立变体 | 预设一致 |
| ɫ    | 齿龈 (alveolar)        | 舌尖前端 ＋ 舌面后部         | 齿龈 ＋ 软腭区   | 舌叶型 *       | 预设一致 |
| ɺ    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 未提供独立变体 | 预设一致 |
| ʜ    | 咽 (pharyngeal)        | 会厌与杓会厌区               | 喉入口           | 未提供独立变体 | 预设一致 |
| ʢ    | 咽 (pharyngeal)        | 会厌与杓会厌区               | 喉入口           | 未提供独立变体 | 预设一致 |
| ʡ    | 咽 (pharyngeal)        | 会厌与杓会厌区               | 喉入口           | 未提供独立变体 | 预设一致 |
| t͡s   | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 舌叶型 *       | 预设一致 |
| d͡z   | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 舌叶型 *       | 预设一致 |
| t͡ʃ   | 齿龈后 (postalveolar)  | 舌叶（舌尖后方）             | 龈后             | 舌尖型 *       | 预设一致 |
| d͡ʒ   | 齿龈后 (postalveolar)  | 舌叶（舌尖后方）             | 龈后             | 舌尖型 *       | 预设一致 |
| t͡ɕ   | 龈腭 (alveolo-palatal) | 舌叶后部与舌面前部           | 龈后至硬腭前部   | 未提供独立变体 | 预设一致 |
| d͡ʑ   | 龈腭 (alveolo-palatal) | 舌叶后部与舌面前部           | 龈后至硬腭前部   | 未提供独立变体 | 预设一致 |
| ʈ͡ʂ   | 卷舌 (retroflex)       | 反卷舌尖／舌尖下表面         | 龈后／硬腭前缘   | 较弱反卷 *     | 预设一致 |
| ɖ͡ʐ   | 卷舌 (retroflex)       | 反卷舌尖／舌尖下表面         | 龈后／硬腭前缘   | 较弱反卷 *     | 预设一致 |
| ʘ    | 双唇 (bilabial)        | 下唇 ＋ 舌面后部             | 上唇 ＋ 软腭     | 未提供独立变体 | 预设一致 |
| ǀ    | 齿 (dental)            | 舌尖前端 ＋ 舌面后部         | 上齿 ＋ 软腭     | 未提供独立变体 | 预设一致 |
| ǃ    | 齿龈 (alveolar)        | 舌尖前端 ＋ 舌面后部         | 齿龈 ＋ 软腭     | 未提供独立变体 | 预设一致 |
| ǂ    | 齿龈后 (postalveolar)  | 舌叶（舌尖后方） ＋ 舌面后部 | 龈后 ＋ 软腭     | 未提供独立变体 | 预设一致 |
| ǁ    | 齿龈 (alveolar)        | 舌尖前端 ＋ 舌面后部         | 齿龈 ＋ 软腭     | 未提供独立变体 | 预设一致 |
| ɓ    | 双唇 (bilabial)        | 下唇                         | 上唇             | 未提供独立变体 | 预设一致 |
| ɗ    | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 未提供独立变体 | 预设一致 |
| ʄ    | 硬腭 (palatal)         | 舌面前部                     | 硬腭             | 未提供独立变体 | 预设一致 |
| ɠ    | 软腭 (velar)           | 舌面后部                     | 软腭             | 未提供独立变体 | 预设一致 |
| ʛ    | 小舌 (uvular)          | 舌面后部                     | 小舌区           | 未提供独立变体 | 预设一致 |
| pʼ   | 双唇 (bilabial)        | 下唇                         | 上唇             | 未提供独立变体 | 预设一致 |
| tʼ   | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 未提供独立变体 | 预设一致 |
| kʼ   | 软腭 (velar)           | 舌面后部                     | 软腭             | 未提供独立变体 | 预设一致 |
| sʼ   | 齿龈 (alveolar)        | 舌尖前端                     | 齿龈             | 未提供独立变体 | 预设一致 |


## 2026-09-08：会厌、喉部音质与咝音教学修订

- 会厌区滑块保留一片有固定附着点的会厌，删除阈值触发的两块悬空组织；后方杓会厌区作为有连续附着的侧向结构投影，标注跟随原会厌。这里示意喉入口狭窄，不是吞咽时会厌翻转；也不能用是否贴住咽后壁判定喉入口狭窄。[Moisik、Czaykowska-Higgins 与 Esling](https://www.mcgill.ca/mcgwpl/files/mcgwpl/moisik2012.pdf)。
- 四擦音连续构形加入普通话“三、西”、英语 see/ship/she、德语 ich、日语ひ词例；不把现代粤语的 /s/ 一概写成 [ʃ]。粤语腭化及后移受口音和语境影响，研究也使用 [ɕ] 描写部分变体。[香港中文大学研究介绍](https://ling.cuhk.edu.hk/files/seminar/1st_2324/Poster_20231114.pdf)、[日语腭化研究](https://www2.ninjal.ac.jp/yutanaka/papers_cv/Tanaka2023_ICPhS2023.pdf)。
- 声带俯视图为可变形教学示意，省略遮挡声带的上方结构，不是医学影像。气声表现不完全闭合和漏气，嘎裂声表现长闭合期及不均匀脉冲；紧喉发声独立列出，纵向张力独立示意长薄/短厚变化，不生成音高。嘎裂声包含不同亚型，本图不声称覆盖全部。[Kuang 与 Keating](https://www.phonetics.ucla.edu/voiceproject/Publications/kuang_keating_90314.pdf)。
- 元音面板复用已缓存 IPA 官方 [a̤] / [a̰] 录音（J. Esling、P. Ladefoged）；常态 [a] 为 Commons 录音，不同发音人仅作听感参照。动画大幅慢放，不与录音逐帧同步；紧喉发声没有已核实的独立录音。[IPA 官方音表](https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html)、[LMU / UCLA 词例](https://www.phonetik.uni-muenchen.de/~hoole/kurse/phil_demos/language_demos/voice_quality_contrasts.html)。
- 辅音表的“擦音/咝音”信息按钮说明子类关系、集中的气流束与牙齿障碍物声源，同时标明二维动画不能模拟三维湍流及声谱。[USC：Constriction Location and Constrictor Orientation](https://sail.usc.edu/~lgoldste/General_Phonetics/Constriction_Location/fricatives.html)。

验证：新增发声模式闭合/漏气周期、带气声/嘎裂声附加符号的预览及会厌数量回归检查；共 48 项测试通过。未进行浏览器交互或截图验证，仍需观察真实播放、移动端排版及极端构形的视觉效果。


### 喉部面板第二轮：多维发声态（2026-09-08）

声带面板移到元音页左列，位于矢状图与嘴部正面图下方。扩展为 11 个基本/边界状态和 5 个复合态：无声态、喉开态（呼气声）、耳语声、气声（呼气浊声）、弛声（松声）、常态浊声、紧声（僵声）、挤喉发声、嘎裂声、假声、喉闭态，以及耳语浊声、耳语嘎裂声、嘎裂假声、耳语假声、耳语嘎裂假声。

术语依据：用户提供的中文表格只作参考，不视为规范或指令。正文采用“弛”而非“驰”；whisper / whispery voice 以“耳语声／耳语浊声”消歧。中英译表对 whispery voice 也作“耳语声”，并将 pressed / tight 对译为“挤喉发声／紧声”，因此界面明示名称有重叠。没有单一教材通用且穷尽的发声态清单，不能把这里的 16 项说成所有发声态。

- Gordon & Ladefoged（2001），Journal of Phonetics 29:383–406：[DOI](https://doi.org/10.1006/jpho.2001.0147)。
- Esposito & Khan（2020），The cross-linguistic patterns of phonation types：[作者托管全文](https://www.reed.edu/linguistics/khan/assets/Esposito%20Khan%202020%20The%20cross-linguistic%20patterns%20of%20phonation%20types.pdf)。图 3 的松紧排列是粗略约定，不是生理分界；假声、糙声、复合态不能放入一条声门宽度轴。
- Ball、Esling & Dickson，Revisions to the VoQS system for the transcription of voice quality：[JIPA](https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/abs/revisions-to-the-voqs-system-for-the-transcription-of-voice-quality/67662EA00A0B1D77136AF8514B6F230B)。[2020 中英译表](https://phesoca.com/aws/305/)用作译名对照，并非官方中文术语标准。

实现边界：六项归一化教学参数分别控制韧带声门内收、后部软骨声门开口、纵向张力、气流驱动、脉冲不均匀程度及边缘振动比例。“气声—弛声—常态浊声—紧声—嘎裂声”是对这些参数的分段连续插值。内收沿路径增强，纵向张力在所选嘎裂预设下降低。所有数值与振动启停阈值都是显示参数，不是实测数据、真实压力阈值或生物力学解。

前后声门独立绘制，耳语预设无周期振动而保留后部通道；喉闭预设无通流、无振动；无声预设无气流噪声。假声以高纵向张力、变薄和边缘参与示意，不推算音高。开口曲线不是声波、EGG 或声谱。任意组合不自动命名，只有精确常态/气声/嘎裂预设提供现有录音；自由参数不冒用标准音示例。

糙声、室襞性发声和杓状会厌襞性发声只在范围说明中解释及链接文献；当前真声带模型不能替代这些声门以上机制。未扩展到病理性或电子喉发声。
