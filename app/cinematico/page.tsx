'use client';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { AnimatePresence } from 'framer-motion';
import { useStores } from '@/hooks/useStores';
import ControlPanel, {
  DockPosition,
} from '@/components/cinematico/control-panel/ControlPanel';
import NoiseBackground from '@/components/cinematico/NoiseBackground';
import MovieContent from '@/components/cinematico/MovieContent';
import MoviesDashboard from '@/components/cinematico/MoviesDashboard';

export default observer(function CinematicoPage() {
  const {
    rootStore: { movieStore },
  } = useStores();
  const isPowerOn = movieStore.isPowerOn;
  const [dockPosition, setDockPosition] = useState<DockPosition>('left');

  /**
   * For left/right docking, the panel should span the full height of the TV screen,
   * and for top/bottom docking, it should span the full width.
   */
  const getPanelPositionStyle = (dock: DockPosition) => {
    switch (dock) {
      case 'left':
        return { left: '-280px', top: '0', bottom: '0' };
      case 'right':
        return { right: '-280px', top: '0', bottom: '0' };
      case 'top':
        return { top: '-180px', left: '0', right: '0' };
      case 'bottom':
        return { bottom: '-180px', left: '0', right: '0' };
      default:
        return {};
    }
  };

  /**
   * Adjust the TV screen's border radii so that the edge touching the control panel
   * becomes straight.
   */
  const getTVScreenBorderClasses = (dock: DockPosition) => {
    switch (dock) {
      case 'left':
        return 'rounded-tr-3xl rounded-br-3xl';
      case 'right':
        return 'rounded-tl-3xl rounded-bl-3xl';
      case 'top':
        return 'rounded-bl-3xl rounded-br-3xl';
      case 'bottom':
        return 'rounded-tl-3xl rounded-tr-3xl';
      default:
        return 'rounded-3xl';
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      <NoiseBackground />
      <div className="w-full h-screen p-4 sm:p-8 pt-10 flex items-start top-10 justify-center relative z-10">
        <div className="relative w-full max-w-full sm:max-w-4xl mx-auto">
          <div
            className={`aspect-[16/9] relative w-full overflow-hidden transition-all duration-500 ${getTVScreenBorderClasses(
              dockPosition
            )}`}
            style={{
              backgroundColor: '#1a1a2e',
              borderColor: 'rgba(45, 45, 65, 0.4)',
              boxShadow: `
                16px 16px 32px rgba(0, 0, 0, 0.8),
                -8px -8px 16px rgba(255, 255, 255, 0.03),
                inset -2px -2px 4px rgba(255, 255, 255, 0.03),
                inset 2px 2px 4px rgba(0, 0, 0, 0.4)
              `,
            }}
          >
            <div className="absolute inset-4">
              <AnimatePresence mode="wait">
                {isPowerOn ? <MovieContent /> : <MoviesDashboard />}
              </AnimatePresence>
            </div>
          </div>
          {/* Render the ControlPanel either overlaid or in-flow (if undocked) */}
          {dockPosition === 'undocked' ? (
            <ControlPanel
              dockPosition={dockPosition}
              setDockPosition={setDockPosition}
            />
          ) : (
            <div
              style={getPanelPositionStyle(dockPosition)}
              className="absolute"
            >
              <ControlPanel
                dockPosition={dockPosition}
                setDockPosition={setDockPosition}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
