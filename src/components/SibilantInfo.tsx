import { Popover } from '@base-ui/react/popover';
import { Info, X } from 'lucide-react';

export function SibilantInfo() {
  return (
    <Popover.Root>
      <Popover.Trigger
        className="sibilant-info"
        aria-label="咝音和擦音有什么区别？"
      >
        <Info size={16} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          side="bottom"
          align="start"
          sideOffset={8}
          className="mark-popover-positioner"
        >
          <Popover.Popup className="sibilant-popover">
            <div className="mark-detail-heading">
              <Popover.Title>咝音是擦音的特殊子类</Popover.Title>
              <Popover.Close className="mark-close" aria-label="关闭咝音说明">
                <X size={18} />
              </Popover.Close>
            </div>
            <Popover.Description>
              区别不只在于频率高，更在于气流与下游障碍物形成声源的方式。
            </Popover.Description>
            <p>
              擦音让气流通过狭窄通道，产生湍流噪声；[f θ x ç] 是非咝擦音的例子。
            </p>
            <p>
              咝音如 [s z ʃ ʒ ɕ ʑ ʂ
              ʐ]，通常把气流集中成高速气流束。气流越过舌头形成的狭窄处后，冲击下游牙齿，尤其是上门齿附近，产生强烈的湍流噪声。这种机制称为{' '}
              <em>obstacle frication</em>（障碍物摩擦）。
            </p>
            <p>
              因此，咝音的摩擦噪声通常比 [f θ x]
              等更强；强度和频谱仍受构形、气流及个体差异影响，不能只用“高频”划分。
            </p>
            <p className="chart-note">
              演示限制：当前二维动画只显示构形和示意气流，不能解析三维舌沟、牙齿处的气流冲击或声谱，无法在动画中展开呈现这两类声源的差别。
            </p>
            <a
              href="https://sail.usc.edu/~lgoldste/General_Phonetics/Constriction_Location/fricatives.html"
              target="_blank"
              rel="noreferrer"
            >
              南加州大学：擦音的气流与障碍物 ↗
            </a>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
