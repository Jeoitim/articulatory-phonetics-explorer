# 舌形与声道构形校准与解剖综述（2026-09-08）

采用接近解剖实际的连续轮廓，用接近部位和主动舌部的标注辅助教学，不以夸张弯折增加区分度。

## 一、舌叶构形校准

### 1.1 参考与适用范围
- [Tavin 的 /ʃ/ 矢状面图](https://commons.wikimedia.org/wiki/File:Fricatives-sch.svg)：用户提供的圆拱轮廓参照。舌叶之后由舌面承托，不是孤立尖峰。
- [Tavin 的 /s z/ 图](https://commons.wikimedia.org/wiki/File:Fricatives-s-z.svg)：用于比较前部狭窄与 /ʃ/ 的较后狭窄。
- [Wright / McCloy 的舌叶 /ʃ/ 图](https://commons.wikimedia.org/wiki/File:IPA_%CA%83_laminal_Sagittal_Section.svg)与[舌叶 /s/ 图](https://commons.wikimedia.org/wiki/File:IPA_s_laminal_Sagittal_Section.svg)：补充构形参照；[原作者教学素材](https://github.com/drammock/phonetics-teaching-assets)明确属于教学图，并非个体 MRI 测量。
- [舌叶音（Laminal consonant）](https://en.wikipedia.org/wiki/Laminal_consonant)：舌叶是舌尖之后的前部表面；舌叶性不规定唯一的舌尖高度。
- [齿龈腭擦音 /ɕ/](https://en.wikipedia.org/wiki/Voiceless_alveolo-palatal_fricative)：保留舌面前部的较广泛抬高，以免把 /ʃ/ 与 /ɕ/ 简化为舌尖位置的区别。

### 1.2 实现要点
1. **齿龈后基础构形**：舌尖稍前移，舌面前部和后部共同承托舌叶，减轻前舌的尖峰。共享于清浊音、塞擦音和从基础构形产生的次要调音变体。
2. **齿龈舌叶变体**：减小尖叶高差，扩大前后跨度，同时抬高相邻舌面。保留擦音间隙和塞音闭塞。
3. **齿龈后舌尖型**：减少舌尖之后的陡降，仍以舌尖形成主要狭窄；不把舌尖性画成反卷。
4. **齿龈腭型**：减小不必要的舌尖下压，保留舌叶与舌面前部共同抬高。
5. **共享轮廓**：前向舌尖之后的抬高舌叶使用圆拱切线；手动编辑也受益。反向卷舌切线保持独立。瑞典语 /ɧ/ 双部位教学示意单独保留组织空间。

---

## 二、后舌（软腭／小舌）、舌根与咽部音构形

### 2.1 软腭与小舌后缩
软腭和小舌构形采用有支撑的前舌与宽阔的抬高舌体，避免把舌冠强压向口底。下颌适度收小开度，小舌附近不把软腭陡降的斜率直接当作舌面圆拱的切线。二维面积约为静息态的 1.53 倍（/k/）和 1.50 倍（/q/），不能用这些数值推断体积膨胀。

默认软腭／小舌姿态采用适度后收的舌尖和舌叶（`tip: [260, 470]`, `blade: [320, 440]`, `front: [420, 400]`），相邻前舌一起承托后舌隆起，主要后部接触位置保持不变。没有把后收等同于舌尖上翘或反卷。

### 2.2 咽部音预设与舌前部内收
咽部音（如清咽擦音 `/ħ/`、浊咽擦音 `/ʕ/`、会厌音等）的主要狭窄位于下咽部或咽腔下段。在真实的生理肌协同中，当舌根强力后缩推向咽后壁时，舌冠与舌尖随肌肉水力静力学（muscular hydrostat）整体向后收缩（retraction），而非僵硬地伸在最前齿龈处。
- **构形更新**：
  - `tip`: `[255, 520]`（向内后收）
  - `blade`: `[330, 495]`
  - `front`: `[430, 485]`
  - `dorsum`: `[550, 535]`
  - `root`: `[wallX(645) - gap - 7, 645]`
- **生理几何合理性**：二维面积比例保持在 1.477（健康处于 0.82–1.66 阈值内），舌前部自然内敛，咽部狭窄明确，解剖上避免了舌冠前凸与舌根极端拉伸的脱节假象。

### 2.3 参考文献
- [Wright / McCloy 的 /k/ 图](https://commons.wikimedia.org/wiki/File:IPA_k_Sagittal_Section.svg)：后舌闭塞的补充参照。
- [咽部音及不同调音实现](https://en.wikipedia.org/wiki/Pharyngeal_consonant)：咽部音不应全部简化为舌背抬高；喉入口构形仍由原有独立模型处理。
- [Variability in muscle activation of simple speech motions](https://pmc.ncbi.nlm.nih.gov/articles/PMC6909993/)：舌与下颌的协同及说话者差异。
- [Velar–vowel coarticulation in a virtual target model of stop production](https://pmc.ncbi.nlm.nih.gov/articles/PMC4805126/)：元音语境影响软腭闭塞位置，不能给每个音规定唯一的下颌角度或接触形状。
- [Hermes 等，2017，阿拉伯语咽音与咽化音的实时 MRI 研究](https://www.isca-archive.org/interspeech_2017/hermes17_interspeech.pdf#page=3)：实时 MRI 和舌面、舌根、咽后壁轮廓。
- [Shar 与 Ingram，2011，MRI Investigation of Arabic Gutturals](https://www.internationalphoneticassociation.org/icphs-proceedings/ICPhS2011/OnlineProceedings/RegularSession/Shar/Shar.pdf#page=2)：区分舌根层面、会厌层面的咽宽和喉位测量。

---

## 三、会厌与舌体层级关系（解剖遮挡校准）

### 3.1 解剖实际
会厌（Epiglottis）位于舌根之后、喉入口前方，附着于甲状软骨内面，前方经会厌正中襞与会厌谷（vallecula）同舌根相连。
在矢状投影中，舌根与舌体肌肉位于会厌的前上方与深面。

### 3.2 渲染层次修复
在原渲染中，SVG 将会厌路径置于舌体之后（渲染层级在上方），且舌腹轮廓向后延展并包络至舌骨，导致在咽部音及舌根后缩姿态下，会厌基底被画在舌体肌肉的正中央，视觉上如同“一把刀直接穿透并切断了舌体肌肉”。

**修复方案**：
调整 SVG 元素渲染顺序，将会厌（Epiglottis）置于深层（舌体图层之前渲染），下颌口底与舌骨保持在正常层级。舌体肌肉（Tongue Muscle）正常覆盖在会厌基部与会厌前间隙前方，彻底消除会厌穿透切裂舌体的视觉缺陷，同时保持了独立的会厌旋转与解剖标注高亮。

---

## 四、搭嘴音（Clicks）文献验证与构形科学化

### 4.1 语音学文献依据
搭嘴音（吸气闭塞音，[Clicks](https://en.wikipedia.org/wiki/Click_consonant)）利用吸气气流机制（lingual ingressive / velaric airstream mechanism）。
- **核心文献与影像参照**：
  - [Ladefoged, P. & Maddieson, I. (1996). *The Sounds of the World's Languages*, 第 8 章 "Clicks"（第 246–280 页）](https://archive.org/details/soundsofworldsla0000lade/page/246/mode/2up)：详细论述了搭嘴音的双重闭塞形成（anterior + velar/uvular closures）、舌体中部凹陷形成的稀疏腔（rarefaction chamber）及负压爆破机制，并包含 Nama、!Xóõ 等语言的 X 射线矢状面描摹（sagittal tracings）与动态腭位图（electropalatography, EPG）。
  - [Ladefoged, P. & Traill, A. (1984). *Linguistic phonetic descriptions of clicks*, Language, 60(1), 1–20](https://www.jstor.org/stable/4178550)：基于 X 射线电影照相术（cineradiography）与舌压记录，论证了搭嘴音发音时舌背与软腭的稳定闭塞，以及前部闭塞释放时腔内空气稀薄化的动态过程。
  - Sands, B. (1991). *An acoustic and aerodynamic study of clicks in Khoisan*：研究了[科伊桑语系（Khoisan languages）](https://en.wikipedia.org/wiki/Khoisan_languages)搭嘴音的气动特性与舌腔声学共振。
  - [国际音标搭嘴音分类](https://en.wikipedia.org/wiki/Click_consonant)：包含[双唇搭嘴音 `[ʘ]`](https://en.wikipedia.org/wiki/Bilabial_click)、[齿搭嘴音 `[ǀ]`](https://en.wikipedia.org/wiki/Dental_click)、[齿龈搭嘴音 `[ǃ]`](https://en.wikipedia.org/wiki/Alveolar_click)、[腭龈搭嘴音 `[ǂ]`](https://en.wikipedia.org/wiki/Palato-alveolar_click) 与[齿龈侧搭嘴音 `[ǁ]`](https://en.wikipedia.org/wiki/Lateral_click)。
- **发音生理机制**：
  1. **双重闭塞（Dual Closures）**：搭嘴音必须同时形成两个闭塞：
     - 前部闭塞（Anterior closure）：双唇（`ʘ`）、齿（`ǀ`）、齿龈／齿龈后（`ǃ`）、硬腭／腭龈舌叶（`ǂ`）或齿龈侧边（`ǁ`）。
     - 后部闭塞（Posterior closure）：软腭（velar）或小舌（uvular）。
  2. **稀疏腔（Rarefaction chamber）形成**：双重闭塞形成闭合口腔后，通过舌体中部适度下移降低腔内空气压力（形成负压）。
  3. **腔体几何**：真实的矢状面 X 光照片显示，下压形成的稀疏腔是平缓圆滑的凹陷（shallow saucer-like pocket），绝非深不见底、直上直下的悬崖式断层（cliff deformation）。原预设中 `front.y` 曾被过度下拉至 480 乃至造成组织面积超标（超过 1.66 倍警戒线），属于未经文献标定的过度形变。

### 4.2 各搭嘴音构形更新
1. **下颌开度适度化**：
   - 将原过大的 `p.jaw = 0.22` 下调至 `0.12`，符合搭嘴音闭塞准备阶段下颌适度抬升以维持前闭塞的生理事实。
2. **腭龈搭嘴音（Palatoalveolar click, `[ǂ]`）**：
   - 具有广泛的舌叶—硬腭前部接触（broad laminal-palatal anterior closure）：
     - `tip`: `[205, 415]`
     - `blade`: `[275, 347]`（紧密闭塞于硬腭前沿）
     - `front`: `[390, 450]`（浅平稀疏腔）
     - `dorsum`: `[552, 374]`（后部软腭闭塞）
     - `root`: `[550, 725]`
   - 面积比例由过载恢复为健康的 `1.634`（≤ 1.66），前部闭塞紧密，中央凹陷平缓自然。
3. **双唇（`[ʘ]`）、齿（`[ǀ]`）、齿龈后（`[ǃ]`）与侧搭嘴（`[ǁ]`）**：
   - 稀疏腔前舌点统一校准为 `front.y = 460`，保持平滑圆滑过渡。
   - 双重闭塞特征被音标推断引擎（`infer`）100% 正确判定为主要部位与“舌面后部 + 软腭”协同闭塞。

### 4.3 运动学解耦与双闭塞手动拖拽动力学（Kinematic Decoupling for Manual Dragging）
在手动交互拖拽（`constrain()`）中，必须同时满足两个互相矛盾的生理学诉求：
1. **普通单闭塞辅音（如肺部气流音 `/k/`, `/ɡ/` 等）**：
   - 舌背在软腭处形成闭塞时，若用户拖动舌尖／舌叶前伸至齿龈或齿位，舌体必须整体前移以防组织卡死或产生不自然的撕拉，舌背顺应性前移（`dorsum.x < 500`）。
2. **搭嘴音双重闭塞（Dual Closures）**：
   - 用户手动构建或微调搭嘴音时，舌背与前部（舌叶／舌尖）同时或先后闭合，舌中部下沉形成稀疏腔（`front.y >= 430`）。
   - 如果继续沿用单闭塞时的前后强耦合机制，下压 `front` 会连带把两端已闭合的器官拉开；拖动 `blade`/`tip` 会强行把软腭上的 `dorsum` 拔开；拖动 `dorsum` 会把前部的闭塞冲掉，导致**无论如何手动拖拽都无法稳定构建出搭嘴音**。

**解耦动力学解决方案**：
- **吸气稀疏腔刻蚀（Carving suction pocket）**：
  - 当下压中舌点（`key === 'front' && dy > 0`）时，若舌叶、舌尖或舌背已在声道顶壁闭合（`< 22–25px` 阈值），其横向与纵向传播权重均置零（`wx = 0, wy = 0`），使用户可以自由向下挖掘稀疏腔而不撕脱任何一侧闭塞。
- **腔体维持下的双闭塞独立微调（Decoupled adjustments under suction pocket）**：
  - 引入稀疏腔判定标记 `hasLoweredPocket = pose.tongue.front.y >= 430`。
  - **前部器官微调**（拖动 `tip` 或 `blade`）：后部舌背 `dorsum` 保持软腭锚定（`wx = 0, wy = 0`），并跳过将 `dorsum.y` 强行拉向松弛高度 520 的单闭塞前移逻辑。
  - **后部闭塞微调**（拖动 `dorsum`）：前部 `blade` 与 `tip` 保持前闭塞锚定（`wx = 0, wy = 0`），并跳过前部松弛高度覆盖。
- **动力学结果**：
  - 用户既可以从默认姿态先拉起软腭闭塞，再压低中舌，再拉起舌叶/舌尖构建搭嘴音；也可以从预设搭嘴音中任意微调齿龈、舌叶或软腭接触部位，双闭塞结构牢固稳定，彻底解决了“前后舌体冲突无法手动构建”的体验痛点。

