'use client';

import { useStores } from '@/hooks/useStores';
import { observer } from 'mobx-react-lite';
import { DockingButtons } from './DockingButtons';
import { PowerIndicator } from './PowerIndicator';
import { ModeToggleSwitch } from './ModeToggleSwitch';
import { ControlDialsGrid } from './ControlDialsGrid';

// Updated dock options (bottom removed in favor of top)
export type DockPosition = 'left' | 'right' | 'top' | 'bottom' | 'undocked';

// (Desktop dimensions are maintained for reference.)
const PANEL_DIMENSIONS = {
  vertical: {
    width: '280px',
    height: '100%', // Vertical mode spans full height of the TV screen container.
  },
  horizontal: {
    width: '100%',
    height: '180px',
  },
};

// When docked, we remove the rounding on the edge adjoining the TV screen.
const getIntegratedClasses = () => {
  const baseClasses = 'bg-[#1a1a2e] border-[#2d2d41]/40';
  return {
    left: `rounded-tl-3xl rounded-bl-3xl rounded-tr-0 rounded-br-0 border-t border-b border-l border-r-0 ${baseClasses} shadow-[inset_-1px_0_2px_rgba(255,255,255,0.03)]`,
    right: `rounded-tr-3xl rounded-br-3xl rounded-tl-0 rounded-bl-0 border-t border-b border-r border-l-0 ${baseClasses} shadow-[inset_1px_0_2px_rgba(255,255,255,0.03)]`,
    top: `rounded-tl-3xl rounded-tr-3xl rounded-bl-0 rounded-br-0 border-l border-r border-t border-b-0 ${baseClasses} shadow-[inset_0_-1px_2px_rgba(255,255,255,0.03)]`,
    bottom: `rounded-bl-3xl rounded-br-3xl rounded-tl-0 rounded-tr-0 border-l border-r border-b border-t-0 ${baseClasses} shadow-[inset_0_1px_2px_rgba(255,255,255,0.03)]`,
    undocked: `rounded-3xl border ${baseClasses} shadow-lg shadow-black/50 hover:shadow-xl transition-shadow duration-300`,
  };
};

export default observer(function ControlPanel({
  dockPosition,
  setDockPosition,
  showArrows = false,
}: {
  dockPosition: DockPosition;
  setDockPosition: (pos: DockPosition) => void;
  showArrows?: boolean;
}) {
  const {
    rootStore: { movieStore },
  } = useStores();
  const isVertical = dockPosition === 'left' || dockPosition === 'right';
  const integratedClasses = getIntegratedClasses()[dockPosition] ?? '';
  const responsiveClasses = isVertical
    ? 'w-full sm:w-[280px] sm:h-full'
    : 'w-full sm:h-[180px]';

  return (
    <div
      className={`flex flex-col relative ${integratedClasses} ${responsiveClasses}`}
    >
      <DockingButtons
        dockPosition={dockPosition}
        setDockPosition={setDockPosition}
        isZeroShotMode={movieStore.isZeroShotMode}
        onCreateShot={() => movieStore.createZeroShotMovie()}
      />
      <div
        className={`px-3 py-1.5 sm:px-6 sm:py-2 border-b border-neutral-800/50 ${
          isVertical ? 'w-full' : ''
        }`}
      >
        <div className="flex items-center gap-3">
          <PowerIndicator
            isOn={movieStore.isPowerOn}
            onClick={() => movieStore.setPowerOn()}
          />
          <ModeToggleSwitch
            value={movieStore.isZeroShotMode}
            onToggle={() => movieStore.toggleZeroShotMode()}
          />
        </div>
      </div>
      <div
        className={`flex-1 px-3 py-3 overflow-y-auto custom-scrollbar ${
          isVertical ? 'w-full' : ''
        } ${
          movieStore.isZeroShotMode ? 'flex items-center justify-center' : ''
        }`}
      >
        <ControlDialsGrid
          movieStore={movieStore}
          isVertical={isVertical}
          showArrows={showArrows}
        />
      </div>
    </div>
  );
});
