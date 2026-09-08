# Articulatory Phonetics Explorer

交互式调音语音学实验室。使用 React、TypeScript strict 和可变形 SVG 展示调音部位、方法、声带、软腭与气流的共同作用。

## 启动与检查

```sh
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

## 部署文档

需要发布到 GitHub Pages、Cloudflare Pages、Netlify、Vercel 静态导出或反向代理子目录时，请先阅读[部署指南](docs/deployment.md)。指南提供构建命令、发布目录、`PAGES_BASE_PATH` 子路径配置、音频在线备用、静态产物检查和常见故障处理；GitHub Pages 的自动部署入口位于[工作流文件](.github/workflows/deploy-pages.yml)。

- [部署指南](docs/deployment.md)：跨平台构建、静态产物目录和音频故障排查。
- [架构说明](docs/architecture.md)：页面、数据、几何引擎和资源之间的关系。
- [语音学审计](docs/phonetic-audit.md)：辅音、元音和动画模型的范围与审阅记录。
- [验证记录](docs/validation.md)：提交前应运行的检查及其用途。

## 功能

- 共 92 个辅音条目：完整肺部辅音主表的 59 个符号、19 个常用扩展音，以及官方非肺部栏的 5 个搭嘴音、5 个内爆音和 4 个挤喉音示例。挤喉符号 ʼ 可与更多辅音组合，这里不穷尽所有附加符号组合。
- 元音模式包含 IPA 元音图的 28 个符号，可点击符号、拖动舌位空间，或用键盘滑块调整高低、前后和圆唇度。侧面舌形与嘴部正面 SVG 同步过渡，支持减少动态效果。
- 普通话舌尖前、舌尖后元音 [ɿ]、[ʅ] 单独展示，附“资、次、思”和“知、吃、诗、日”例字。它们是传统汉语语音学记号，也可分析为成音节近音，不在舌面元音四边形内强行定位。元音模块当前提供构形展示，不提供未核实的元音录音。
- Build、Explore、Vowels、Compare、Lessons 五种模式，双向选择、轮廓叠加、11 个教学单元。
- 龈腭辅音单列，独立区分 [s] → [ʃ] → [ɕ] → [ç] 的舌尖、舌叶与舌面联动，课程提供连续体滑块。24 个主动调音变体可直接选择，手动匹配用星号表示偏离教学预设；星号不表示语音实现错误。
- 基于用户提供参考 SVG 的分层解剖图；舌尖、舌叶、舌面前部、舌背、舌根采用连续曲面和联动拖动。
- 分区弹性联动、舌体跨度与弯折限制、宽厚连续舌腹、边界投影及自交检查；一次拖动以起始构形为基准，避免重复累积形变。下颌、下唇、唇齿接触、圆唇、软腭、声门及会厌区控制。
- 独立的清浊、方法、鼻咽通道与侧向气流参数；显示最近匹配，并拒绝不一致的构形。
- 区分闭塞、压力、释放、摩擦、单次接触及不同器官颤动的动画；声带和舌面俯视小图。
- 120 份具有来源与许可的录音记录（92 个辅音、28 个舌面元音）。播放优先使用本地缓存，资源缺失或格式不受支持时回退到对应的 Wikimedia Commons 在线媒体；未完成缓存的条目仍会明确提示来源。运行 `node scripts/check-audio-cache.mjs --require-complete` 核对是否全部就绪。不使用合成语音冒充录音；普通话舌尖元音仍需核实独立录音。
- 响应式布局、键盘调整、Shift 关闭辅助吸附、标签固定与 prefers-reduced-motion。

### GitHub Pages 音频策略

GitHub Pages 的项目站点运行在 `/articulatory-phonetics-explorer/` 子路径下，录音地址会依据当前页面目录解析，避免把 `/audio/` 错误请求到域名根目录。播放顺序为：先尝试仓库内的 120 份本地缓存；本地文件缺失、格式不受支持或加载失败时，自动使用录音来源页对应的 Wikimedia Commons `Special:FilePath` 在线媒体地址。在线备用播放会在状态提示中标明，来源与许可链接仍可从元音和辅音面板打开；无网络时则保留来源页入口并提示重试。

## 科学边界

这是一套定性教学模型，不是生物力学或声学求解器。联动约束可以排除明显的拉伸、自交和硬腭穿透，并不保证每一种连续形状均能由真实肌肉实现。二维面积约束不是三维体积守恒。

舌体的“相对刚性”实现为整体联动与抗折叠、抗过度伸缩；舌尖可局部弯曲，舌根活动受到舌体跨度约束。舌腹通过随下颌移动的宽附着区连接到自由舌尖，不再通过独立的舌叶偏移点拼接。舌背抬高伴随前舌释放，根部的垂直联动较小。所有数值是保留现有教学发音构形的几何参数，并非测得的弹性模量；面积范围用于排除塌陷和过度膨胀，未做 X 光或 MRI 的个体配准。

舌面曲线按相邻段长度归一化切线，抬高的舌面前部或后部形成宽冠，接近腭面时平滑调整方向；后缘通过圆弧过渡回到舌根附着区。硬腭、软腭和小舌预设同时调整邻近舌面点，分散抬高幅度，保持原调音目标。宽冠与后缘弧度有独立回归检查；这些外形改进仍是定性的教学近似。

软腭、小舌音保留前舌支撑与宽阔抬高区，不通过强压舌冠来满足过紧的二维面积目标。咽音的舌根后缩采用一段向下延续的后部轮廓，再平滑回到下方附着处，避免单点被拉成尖突。手动下颌移动带动游离前舌，对近腭接触区保留补偿；这些联动仍是几何近似。

默认软腭／小舌构形采用适度后收的前舌，不要求舌尖上翘或反卷；这是可编辑的展示姿态，不是脱离元音语境的唯一发音标准。

咽部形状参照 [Hermes 等（2017）的实时 MRI 与轮廓图，PDF 第 3 页](https://www.isca-archive.org/interspeech_2017/hermes17_interspeech.pdf#page=3)，以及 [Shar 与 Ingram（2011）的 MRI 测量图，PDF 第 2 页](https://www.internationalphoneticassociation.org/icphs-proceedings/ICPhS2011/OnlineProceedings/RegularSession/Shar/Shar.pdf#page=2)。参考文献与 SVG 许可列于 [anatomy.txt](public/attribution/anatomy.txt)，具体用途、修改依据和限制见[舌形校准记录](docs/laminal-shape-review.md)。文献图像未作为网站素材分发，也未进行影像轮廓配准。

生物力学依据：舌组织的近不可压缩性、非线性弹性及下颌/舌骨附着关系，参见 [Kajee 等，2013](https://doi.org/10.1002/cnm.2531) 和 [Subject-Specific Biomechanical Modelling of the Oropharynx](https://pmc.ncbi.nlm.nih.gov/articles/PMC5699225/)。本实现借鉴这些原则，不复现论文中的三维有限元求解器。

IPA 表示类别，而非唯一口型；预测只表示最近的教学构形。卷舌有多种实现，图中采用一种弯曲舌尖示意；[ɧ]、咽音和会厌音存在较大实现差异。喉入口图只说明狭窄关系，不能用于精确重建喉部生理。

左右不对称、舌沟、侧向形状和声带细节不能由单一矢状面充分表示。没有把 [ʃ]、[ʂ] 和 [ɕ] 简单等同。

非肺部辅音支持选择、对比、构形和分阶段动画。搭嘴音保留后部闭塞，前部释放时空气局部内入；挤喉音以声门闭合和喉部上升示意向外气流；内爆音显示喉部下降和局部内入趋势，实际浊内爆音可伴随肺部呼气维持声带振动，不能理解为吸气进入肺。箭头表示机制方向，不是流体计算结果。分类依据 [IPA 官方表](https://www.internationalphoneticassociation.org/content/ipa-chart)，机制参考 [UBC 非肺部辅音教学资料](https://enunciate.arts.ubc.ca/linguistics/world-sounds/consonants-non-pulmonic/)。

录音可能含元音上下文，不与慢动作逐帧同步；示例不代表唯一标准发音。

元音图依据 [IPA 元音表](https://www.internationalphoneticassociation.org/content/ipa-vowels)。元音坐标不是舌面实测坐标；侧面构形通过连续舌体模板插值生成，正面唇形将开口度与圆唇度分开控制，不声称还原唇突出量或声学共振峰。舌尖元音参考 [Lee-Kim，2014，Revisiting Mandarin ‘apical vowels’](https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/abs/revisiting-mandarin-apical-vowels-an-articulatory-and-acoustic-study/DA325F52844304100950A8B4FEAF6240)。

## 项目结构

符号与术语翻译参考[中国语言学会（2007）](https://www.cambridge.org/core/journals/journal-of-the-international-phonetic-association/article/abs/chart-of-the-international-phonetic-alphabet-in-chinese-2007/372C851EDD231F03709B56339F4DB400)：非肺部辅音、其他符号、31 项附加符号、超音段以及平调、非平调、调阶和语调。龈腭辅音保留独立分组。点击附加符号可打开详情气泡，查看中文科普、编码和不同发音人的录音。

新增参考录音来自 [IPA 互动音标表](https://www.internationalphoneticassociation.org/IPAcharts/IPA_charts_TI/IPA_charts_TI.html#eng)，按原站可用性映射与发音人署名在线播放；不覆盖原有本地音频。原站没有录音的条目明确说明。详情中的独立剖面只演示当前模型支持的舌位、圆唇、鼻化、齿化和清浊等相对构形变化，不模拟完整韵律，也不声称逐帧匹配录音。

详情采用桌面双栏、移动端竖排布局；录音使用自定义试听／暂停控件。支持的剖面示意包含气流、闭塞与释放阶段、主动与被动调音部位高亮、声门和唇形。组织、肌肉、骨骼、轮廓与气流具有保持色相的暗色配色。辅音与附加符号术语下方列英文名称，也可按英文检索。

所有滑条统一使用当前 Base UI 的 `data-orientation` 属性，并显式设置轨道、进度和手柄的尺寸；包括发音时间轴、对比、构音参数、元音参数和课程连续体。课程展示构形、答题与完成三个步骤，提供针对本课的操作提示及跟随演示的练习入口。观察型课程在播放演示后可完成观察步骤。

自由元音持续显示近似记音。以高低、前后和圆唇度选择邻近基本元音，在归一化坐标中分别使用 0.07、0.10、0.22 的容差，超出时附加偏高／偏低、偏前／偏后、更圆／略展符号。该范围是可调整的教学显示规则，不是声学分类或普遍音位边界；精确录音仍只对应选中的基本音标。舌尖元音保持传统记号，调整圆唇时也显示附加符号。

开央区域（高低坐标 ≥ 0.93，前后坐标 0.4–0.6）单独处理：不圆唇时优先 [ä]，并列 [ɑ̈]、[ɐ̞]，典型不圆唇范围同时提示中文语言学记号 [ᴀ]；说明文字为“开央”而不是从 [ɐ] 继承“次开”。圆唇时使用 [ɶ̈]／[ɒ̈]，圆唇过渡另外保留相对唇形修饰。

- `src/domain`：严格类型与独立语音学特征。
- `src/data`：辅音、主表、课程、解剖路径、动画阶段。
- `src/engine`：几何联动与约束、推断、动画和可替换音频接口。
- `src/components/vocal-tract`：SVG 解剖、声门与俯视小图。
- `src/features`：对比和教学模式。
- `tests`：模型、边界、动画与资源检查。
- `scripts/extract-anatomy.mjs`：从参考 SVG 提取可编辑图层。
- `scripts/render-atlas.mjs`：导出静态 SVG 联系表供检查。
- `scripts/fetch-audio.mjs --download`：可选缓存远程录音，遇到限流立即停止。
- `public/audio/manifest.json`：逐音录音、来源、署名和许可。

## 资料与许可

解剖轮廓改编自 [ish shwar / Rohieb 的参考图](https://commons.wikimedia.org/wiki/File:Places_of_articulation.svg)，原始 SVG 和本项目的解剖改编按 CC BY-SA 3.0 提供。改动包括分层、舌体替换、软腭和下颌变形、配色、双语标签与示意气流。

辅音主表布局依据 [International Phonetic Association 官方 IPA 表](https://www.internationalphoneticassociation.org/content/ipa-chart)，改编表按 CC BY-SA 4.0 提供。录音分别遵循其来源页许可，详见 `public/attribution`。

构音参数在 Build 模式中位于左侧发音实验台下方，匹配卡片位于右侧；发音过程、声学特征和语言实例采用三个等宽切换按钮。调音关系另列主动器官与被动部位，支持观察舌尖与舌叶在龈后构形中的区别。Lessons 课程控制采用图标与文字组合，并提供动画演示、暂停和本地示例录音播放；窄屏时控制自动排列为两列，课程列表可横向滑动。
