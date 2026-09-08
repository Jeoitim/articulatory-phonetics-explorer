# 舌叶构形校准（2026-09-08）

采用接近解剖实际的连续轮廓，用接近部位和主动舌部的标注辅助教学，不以夸张弯折增加区分度。

## 参考与适用范围

- [Tavin 的 /ʃ/ 矢状面图](https://commons.wikimedia.org/wiki/File:Fricatives-sch.svg)：用户提供的圆拱轮廓参照。舌叶之后由舌面承托，不是孤立尖峰。
- [Tavin 的 /s z/ 图](https://commons.wikimedia.org/wiki/File:Fricatives-s-z.svg)：用于比较前部狭窄与 /ʃ/ 的较后狭窄。
- [Wright / McCloy 的舌叶 /ʃ/ 图](https://commons.wikimedia.org/wiki/File:IPA_%CA%83_laminal_Sagittal_Section.svg)与[舌叶 /s/ 图](https://commons.wikimedia.org/wiki/File:IPA_s_laminal_Sagittal_Section.svg)：补充构形参照；[原作者教学素材](https://github.com/drammock/phonetics-teaching-assets)明确属于教学图，并非个体 MRI 测量。
- [舌叶音](https://en.wikipedia.org/wiki/Laminal_consonant)：舌叶是舌尖之后的前部表面；舌叶性不规定唯一的舌尖高度。
- [齿龈腭擦音 /ɕ/](https://en.wikipedia.org/wiki/Voiceless_alveolo-palatal_fricative)：保留舌面前部的较广泛抬高，以免把 /ʃ/ 与 /ɕ/ 简化为舌尖位置的区别。

## 实现

1. 齿龈后基础构形：舌尖稍前移，舌面前部和后部共同承托舌叶，减轻前舌的尖峰。共享于清浊音、塞擦音和从基础构形产生的次要调音变体。
2. 齿龈舌叶变体：减小尖叶高差，扩大前后跨度，同时抬高相邻舌面。保留擦音间隙和塞音闭塞。
3. 齿龈后舌尖型：减少舌尖之后的陡降，仍以舌尖形成主要狭窄；不把舌尖性画成反卷。
4. 齿龈腭型：减小不必要的舌尖下压，保留舌叶与舌面前部共同抬高。
5. 共享轮廓：前向舌尖之后的抬高舌叶使用圆拱切线；手动编辑也受益。反向卷舌切线保持独立。瑞典语 /ɧ/ 双部位教学示意单独保留组织空间。

数值是现有图坐标中的定性校准，不是毫米、测量数据或生理角度阈值。参考 SVG 没有复制进项目；它们的头颅比例与本图不同，不应直接逐点套用。矢状面不能充分表达舌沟、横向接触和三维气流。不能据此宣称所有说话者都采用同一舌形，或模型已获影像学验证。

## 后舌、舌根与下颌的补充校准

软腭和小舌构形采用有支撑的前舌与宽阔的抬高舌体，避免把舌冠强压向口底。下颌适度收小开度，小舌附近不把软腭陡降的斜率直接当作舌面圆拱的切线。二维面积约为静息态的 1.53 倍（/k/）和 1.50 倍（/q/），不能用这些数值推断体积膨胀。上一轮的 1.4 倍面积目标已撤回：它错误地鼓励降低前舌，不能作为科学性标准。

咽部构形保留口内舌面的弧度，后部转为向下延续的轮廓。舌根点两侧共享渐变的向下切线，回到下方附着处之前有一段有厚度的后壁；不再从该点沿对角线直接返回舌骨区。这个规则由实际几何后缩程度控制，也用于手动构造和咽化变体，不依赖所选音标。

手动下颌运动带动游离前舌，向舌根逐渐减弱；近腭点保留接触补偿。无效动作只接受仍符合几何约束的连续部分。下颌抬升不等于嘴唇闭合，也不等于软腭鼻咽门关闭。

默认软腭／小舌姿态采用适度后收的舌尖和舌叶，相邻前舌一起承托后舌隆起，主要后部接触位置保持不变。没有把后收等同于舌尖上翘或反卷。此选择用于默认展示，不是所有语言、说话者或元音语境的必需姿态；软腭闭塞的语境变化参见下列超声研究。

- [Wright / McCloy 的 /k/ 图](https://commons.wikimedia.org/wiki/File:IPA_k_Sagittal_Section.svg)：后舌闭塞的补充参照。
- [咽部音及不同调音实现](https://en.wikipedia.org/wiki/Pharyngeal_consonant)：咽部音不应全部简化为舌背抬高；喉入口构形仍由原有独立模型处理。
- [Variability in muscle activation of simple speech motions](https://pmc.ncbi.nlm.nih.gov/articles/PMC6909993/)：舌与下颌的协同及说话者差异。
- [Velar–vowel coarticulation in a virtual target model of stop production](https://pmc.ncbi.nlm.nih.gov/articles/PMC4805126/)：元音语境影响软腭闭塞位置，不能给每个音规定唯一的下颌角度或接触形状。
- [Hermes 等，2017，阿拉伯语咽音与咽化音的实时 MRI 研究](https://www.isca-archive.org/interspeech_2017/hermes17_interspeech.pdf#page=3)：已查看第 3 页图 1–6，含 MRI 和舌面、舌根、咽后壁轮廓。三位说话者分别来自三个方言；可作定性形状参照，不能据此给所有咽音拟合一个普适轮廓。
- [Shar 与 Ingram，2011，MRI Investigation of Arabic Gutturals](https://www.internationalphoneticassociation.org/icphs-proceedings/ICPhS2011/OnlineProceedings/RegularSession/Shar/Shar.pdf#page=2)：已查看第 2 页图 1，区分舌根层面、会厌层面的咽宽和喉位测量。不能把所有后部狭窄等同于单一舌根点。

本轮保留原有宽松的通用面积边界，以兼容元音和手动构形；回归检查重点是前舌不被强压低、抬高区有宽度、舌根向下延续、接触和动画连续。未把二维面积强制守恒，也未将其解释成三维生理测量。模型未重建影像中的咽壁肌肉、完整喉位变化或个体解剖结构。
