interface Lesson {
  title: string;
  en: string;
  target: string | null;
  start: string;
  instruction: string;
  explanation: string;
  question: string;
  options: string[];
  answer: number;
  continuum?: boolean;
  hint: string;
}
export const lessons: Lesson[] = [
  {
    title: '声音在哪里形成？',
    hint: '保持“塞音”和关闭声带振动。将舌面后部控制点抬向软腭；若舌尖仍顶住齿龈，先稍微放低舌尖。可先演示目标音，再点击“跟随演示练习”从目标附近尝试。',
    en: 'Place of articulation',
    target: 'k',
    start: 't',
    instruction: '保持清塞音设置，将舌背拖向软腭，形成 [k] 的闭塞。',
    explanation:
      '调音部位由主动器官与被动部位的关系定义。[t] 主要使用舌尖，[k] 则使用舌背。',
    question: '[k] 的主要主动调音器官是什么？',
    options: ['舌尖', '舌背', '下唇'],
    answer: 1,
  },
  {
    title: '接触，还是接近？',
    hint: '先把调音方法改为“擦音”，保持清音。将舌尖从齿龈稍稍放低，留下窄缝；放得太低会更像近音。',
    en: 'Manner of articulation',
    target: 's',
    start: 't',
    instruction: '选择擦音，稍微降低舌尖，使齿龈处保留狭窄通道。',
    explanation:
      '塞音需要完整闭塞与释放，擦音则维持狭窄气流通道。不要只改变方法名称，也要调整构形。',
    question: '擦音典型的气流状态是什么？',
    options: ['持续通过狭窄通道', '完全闭塞后无释放', '只通过鼻腔'],
    answer: 0,
  },
  {
    title: '感受声带的振动',
    hint: '不必移动舌头。只需打开构音参数里的“声带振动”开关，保留擦音和中央气流。',
    en: 'Voiced vs voiceless',
    target: 'z',
    start: 's',
    instruction: '保持 [s] 的构形，打开声带振动，观察 [z]。',
    explanation:
      '清浊改变不要求改变主要口腔调音位置。真实语音的振动时序还会受到语境影响。',
    question: '[s] 与 [z] 的主要区别是？',
    options: ['鼻腔开闭', '调音部位', '声带是否振动'],
    answer: 2,
  },
  {
    title: '给气流另一条路',
    hint: '将调音方法设为“鼻音”，打开鼻咽通道，保持声带振动。舌尖仍须接触齿龈，不能同时打开口腔闭塞。',
    en: 'Oral vs nasal',
    target: 'n',
    start: 'd',
    instruction: '保留齿龈闭塞与声带振动，将调音方法改为鼻音，并开放鼻咽通道。',
    explanation:
      '[n] 的口腔仍然闭塞。软腭下降，让空气进入鼻腔，而不是从嘴里绕过舌头。',
    question: '鼻音需要哪种软腭状态？',
    options: ['降低，开放鼻咽通道', '升起，封闭鼻咽通道', '与气流无关'],
    answer: 0,
  },
  {
    title: '闭塞与释放',
    hint: '先选“塞音”，关闭声带振动，再把舌尖向齿龈抬起到接触。动画可帮助观察闭塞之后的释放。',
    en: 'Stops',
    target: 't',
    start: 's',
    instruction: '选择塞音，将舌尖抬至齿龈形成闭塞，再播放动画观察释放。',
    explanation:
      '发音是时间过程。静态的闭塞不足以展示一个完整塞音，还需要释放阶段。',
    question: '塞音释放前，口腔出口气流如何？',
    options: ['持续湍流', '因闭塞停止', '必须经过鼻腔'],
    answer: 1,
  },
  {
    title: '听见摩擦',
    hint: '保持清擦音，把舌叶抬到齿龈后方，同时让舌尖稍降低。需要的是舌叶附近的窄缝，不是完全闭塞。',
    en: 'Fricatives',
    target: 'ʃ',
    start: 's',
    instruction: '将舌叶稍向后移动至齿龈后，保留狭窄通道。',
    explanation: '[s] 和 [ʃ] 都是擦音。狭窄位置与前腔长度的变化影响摩擦噪声。',
    question: '普通话 sh 可以直接等同 [ʃ] 吗？',
    options: ['可以', '不可以，常记作 [ʂ]'],
    answer: 1,
  },
  {
    title: '接近而不摩擦',
    hint: '选择“近音”，打开声带振动；将舌面前部靠近硬腭，放低舌尖并解除软腭处闭塞。硬腭处要留出比擦音更宽的通道。',
    en: 'Approximants',
    target: 'j',
    start: 'k',
    instruction: '选择近音并打开声带振动，将舌前部抬向硬腭，保留通道。',
    explanation:
      '[j] 是硬腭近音，例如英语 yes 的首音。它并不是英语字母 j 的发音。',
    question: '[j] 的典型调音方法是？',
    options: ['塞音', '近音', '鼻音'],
    answer: 1,
  },
  {
    title: '从齿龈到硬腭：四种擦音',
    hint: '拖动下面的金色滑块到最右端 [ç]，或直接点击 [ç] 节点。观察舌面前部靠近硬腭；构形达标后回答下方问题，就能继续。',
    en: 's → ʃ → ɕ → ç',
    start: 's',
    target: 'ç',
    continuum: true,
    instruction:
      '先点击四个节点比较主动器官，再拖动连续体观察联动变化。也可手动调整舌叶和舌面前部，尝试构造 [ɕ]，最后到达 [ç]。',
    explanation:
      '这条连续体同时改变舌叶、舌面与狭窄区，不是把一个接触点从前往后平移。中间形状仅作教学过渡，二维图不能判定真实咝声或精确音类边界。',
    question: '区别典型 [ʃ] 与 [ɕ] 的关键是什么？',
    options: [
      '[ɕ] 必须由舌尖单独抬起',
      '[ɕ] 的舌叶后部与舌面前部共同抬高，形成更广的腭化狭窄区',
      '只看最近控制点是否在龈后',
    ],
    answer: 1,
  },
  {
    title: '一次，还是多次？',
    hint: '将调音方法从“颤音”切换为“闪音”，保持声带振动。播放后关注单次接触，不必通过反复拖动来模拟快速闪动。',
    en: 'Trills and taps',
    target: 'ɾ',
    start: 'r',
    instruction: '将方法切换为闪音，播放动画观察一次接触。',
    explanation:
      '颤音的周期性接触受气流驱动；闪音通常只有一次快速接触。静态姿态不能区分两者。',
    question: '闪音的典型接触次数是？',
    options: ['一次', '连续多次'],
    answer: 0,
  },
  {
    title: '绕过舌头两侧',
    hint: '将方法设为“边近音”，关闭鼻咽通道，打开边侧气流，保持声带振动和齿龈中央接触。',
    en: 'Lateral consonants',
    target: 'l',
    start: 'n',
    instruction: '选择边近音、关闭鼻咽通道并打开边侧气流，保留中央接触。',
    explanation: '矢状面只切过中线，看不到两侧通道。请结合舌面俯视图理解 [l]。',
    question: '[l] 的气流主要怎样通过？',
    options: ['经鼻腔', '从舌头侧面绕过', '穿过中央闭塞'],
    answer: 1,
  },
  {
    title: '肺部以外的机制',
    hint: '本课从齿嗒音开始，点击“播放动画”观察前后闭塞和向内气流，即可完成观察步骤，再回答小测试。',
    en: 'Non-pulmonic consonants',
    target: 'ǀ',
    start: 'ǀ',
    instruction:
      '播放齿搭嘴音，观察前后闭塞与前部释放时的局部内入气流；再到音表比较内爆音和挤喉音。',
    explanation:
      '挤喉音使用声门闭塞及向上运动压缩空气；内爆音涉及喉部下降；搭嘴音需要前后两个闭塞以及两者之间的腔体扩张。',
    question: '搭嘴音需要什么？',
    options: ['只把舌尖抬起', '前后两个闭塞', '只开启声带振动'],
    answer: 1,
  },
];
