'use client';

import { DockPosition } from '../ControlPanel';

interface DockingButtonsProps {
  dockPosition: DockPosition;
  setDockPosition: (pos: DockPosition) => void;
  isZeroShotMode: boolean;
  onCreateShot: () => void;
}

export const DockingButtons = ({
  dockPosition,
  setDockPosition,
  isZeroShotMode,
  onCreateShot,
}: DockingButtonsProps) => {
  return (
    <div className="absolute top-2 right-2 flex gap-2">
      {isZeroShotMode ? (
        <button
          onClick={onCreateShot}
          className="p-2 sm:p-2 md:p-3 rounded-full transition-all duration-300 bg-purple-600/50 text-purple-200 hover:bg-purple-500/50 hover:scale-105"
        >
          <svg
            className="w-3 h-3 sm:w-4 sm:h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m-8-8h16"
            />
          </svg>
        </button>
      ) : (
        (['left', 'right', 'top', 'bottom'] as DockPosition[]).map((pos) => (
          <button
            key={pos}
            onClick={() => setDockPosition(pos)}
            className={`p-2 sm:p-2 md:p-3 rounded-full transition-colors duration-200 ${
              dockPosition === pos
                ? 'bg-purple-600/50 text-purple-200'
                : 'bg-neutral-800/30 hover:bg-neutral-700/30 text-neutral-400'
            }`}
          >
            <svg
              className="w-3 h-3 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              {pos === 'left' && (
                // Icon for left docking: T shape facing right
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12h16M4 3v18"
                />
              )}
              {pos === 'right' && (
                // Icon for right docking: T shape facing left
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4M20 3v18"
                />
              )}
              {pos === 'top' && (
                // Icon for top docking: upside-down T shape
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4h18M12 4v16"
                />
              )}
              {pos === 'bottom' && (
                // Icon for bottom docking: upside-down T shape
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 20h18M12 20v-16"
                />
              )}
            </svg>
          </button>
        ))
      )}
    </div>
  );
};
