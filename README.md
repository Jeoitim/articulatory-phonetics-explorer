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

## 功能

- 完整肺部辅音主表的 59 个符号，以及 19 个常用扩展音：双重调音近音、龈腭音、会厌音、暗 l、边闪音和常用塞擦音。
- Build、Explore、Compare、Lessons 四种模式，双向选择、轮廓叠加、10 个教学单元。
- 基于用户提供参考 SVG 的分层解剖图；舌尖、舌叶、舌面前部、舌背、舌根采用连续曲面和联动拖动。
- 邻近区域联动、拉伸限制、边界投影、自交检查；下颌、下唇、唇齿接触、圆唇、软腭、声门及会厌区控制。
- 独立的清浊、方法、鼻咽通道与侧向气流参数；显示最近匹配，并拒绝不一致的构形。
- 区分闭塞、压力、释放、摩擦、单次接触及不同器官颤动的动画；声带和舌面俯视小图。
- 78 份具有来源与许可的录音记录：41 份本地音频，37 份通过 Commons 加载。远程播放取决于网络及来源服务器，不使用合成语音冒充录音。
- 响应式布局、键盘调整、Shift 关闭辅助吸附、标签固定与 prefers-reduced-motion。

## 科学边界

这是一套定性教学模型，不是生物力学或声学求解器。联动约束可以排除明显的拉伸、自交和硬腭穿透，并不保证每一种连续形状均能由真实肌肉实现。二维面积约束不是三维体积守恒。

IPA 表示类别，而非唯一口型；预测只表示最近的教学构形。卷舌有多种实现，图中采用一种弯曲舌尖示意；[ɧ]、咽音和会厌音存在较大实现差异。喉入口图只说明狭窄关系，不能用于精确重建喉部生理。

左右不对称、舌沟、侧向形状和声带细节不能由单一矢状面充分表示。非肺部音本阶段只有机制课程，尚未实现交互构形。没有把 [ʃ]、[ʂ] 和 [ɕ] 简单等同。

录音可能含元音上下文，不与慢动作逐帧同步；示例不代表唯一标准发音。

## 项目结构

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

构音参数在 Build 模式中位于匹配卡片上方；发音过程、声学特征和语言实例采用同一行的三个等宽切换按钮。调音关系另列主动器官与被动部位，支持观察舌尖与舌叶在龈后构形中的区别。
