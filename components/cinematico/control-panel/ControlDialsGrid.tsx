import { observer } from 'mobx-react-lite';
import { ControlDial } from './ControlDial';
import {
  LightBulbIcon,
  UserIcon,
  DocumentTextIcon,
  DocumentIcon,
  PhotoIcon,
  MusicalNoteIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  FilmIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { MovieStore } from '@/stores/MovieStore';
import { motion } from 'framer-motion';

interface ControlDialsGridProps {
  movieStore: MovieStore;
  isVertical: boolean;
  showArrows?: boolean;
}

type MovieStoreHandlers = {
  [K in keyof MovieStore]: MovieStore[K] extends Function ? K : never;
}[keyof MovieStore];

// Enhanced Arrow component with support for down arrows
const Arrow = ({
  direction,
  isActive,
  isDownward,
}: {
  direction: string;
  isActive: boolean;
  isDownward?: boolean;
}) => (
  <motion.div
    className={`absolute transform ${direction} pointer-events-none
      ${isActive ? 'opacity-100' : 'opacity-40'}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: isActive ? 1 : 0.4 }}
    transition={{ duration: 0.3 }}
  >
    <div
      className={`
      ${isDownward ? 'w-px h-6' : 'h-px w-6'} 
      bg-gradient-to-r from-emerald-400/50 to-emerald-400
      after:content-[''] after:absolute after:h-2.5 after:w-2.5
      after:border-t-2 after:border-r-2 after:border-emerald-400
      after:transform ${
        isDownward
          ? 'after:rotate-135 after:left-[-4px] after:bottom-0'
          : 'after:rotate-45 after:right-0 after:-top-1'
      }
      after:rounded-tr-sm
    `}
    />
  </motion.div>
);

export const ControlDialsGrid = observer(
  ({ movieStore, isVertical, showArrows = true }: ControlDialsGridProps) => {
    const getDialSize = () => {
      return isVertical ? 'sm' : 'md';
    };

    const getGridCols = () => {
      if (movieStore.isZeroShotMode) {
        return 'grid-cols-1';
      }
      return isVertical
        ? 'grid-cols-2'
        : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
    };

    const getGapSize = () => {
      return 'gap-2 sm:gap-3 md:gap-4';
    };

    const regularModeButtons = [
      {
        label: 'Actors',
        icon: UserIcon,
        step: 'actors',
        handler: 'handleActorsClick' as MovieStoreHandlers,
        isCompleted: movieStore.isActorSelected,
      },
      {
        label: 'Idea',
        icon: LightBulbIcon,
        step: 'idea',
        handler: 'handleIdeaClick' as MovieStoreHandlers,
        isCompleted: movieStore.isIdeaSelected,
      },
      {
        label: 'Script',
        icon: DocumentTextIcon,
        step: 'script',
        handler: 'handleScriptClick' as MovieStoreHandlers,
        isCompleted: movieStore.isScriptSelected,
      },
      {
        label: 'Screenplay',
        icon: DocumentIcon,
        step: 'screenplay',
        handler: 'handleScreenplayClick' as MovieStoreHandlers,
        isCompleted: movieStore.isScreenplaySelected,
      },
      {
        label: 'Frames',
        icon: PhotoIcon,
        step: 'frames',
        handler: 'handleFramesClick' as MovieStoreHandlers,
        isCompleted: movieStore.isFramesSelected,
      },
      {
        label: 'Music',
        icon: MusicalNoteIcon,
        step: 'music',
        handler: 'handleMusicClick' as MovieStoreHandlers,
        isCompleted: movieStore.isMusicSelected,
      },
      {
        label: 'Dialogues',
        icon: ChatBubbleLeftRightIcon,
        step: 'dialogues',
        handler: 'handleDialoguesClick' as MovieStoreHandlers,
        isCompleted: movieStore.isDialoguesSelected,
      },
      {
        label: 'Shots',
        icon: FilmIcon,
        step: 'shots',
        handler: 'handleShotsClick' as MovieStoreHandlers,
        isCompleted: movieStore.isShotsSelected,
      },
      {
        label: 'Render',
        icon: CheckCircleIcon,
        step: 'render',
        handler: 'handleRenderClick' as MovieStoreHandlers,
        isCompleted: movieStore.isRenderCompleted,
      },
    ] as const;

    const zeroShotButton = [
      {
        label: 'CREATE IN ZERO SHOT',
        icon: SparklesIcon,
        step: 'zeroshot',
        handler: 'createShot' as MovieStoreHandlers,
      },
    ];

    const buttons = movieStore.isZeroShotMode
      ? zeroShotButton
      : regularModeButtons;

    const getArrowPosition = (index: number, totalButtons: number) => {
      if (isVertical) {
        // For vertical layout (2 columns)
        const isLastInColumn = index % 2 === 1;
        const isLastRow = index >= totalButtons - 2;

        if (isLastInColumn && !isLastRow) {
          return {
            direction: 'left-1/2 -translate-x-1/2 bottom-[-30px]',
            isDownward: true,
          };
        }
        if (!isLastInColumn) {
          return {
            direction: 'right-[-30px] top-1/2 -translate-y-1/2',
            isDownward: false,
          };
        }
      } else {
        // For horizontal layout
        const isLastInRow = (index + 1) % 4 === 0;
        const isLastRow = index >= totalButtons - 4;

        if (isLastInRow && !isLastRow) {
          return {
            direction: 'left-1/2 -translate-x-1/2 bottom-[-30px]',
            isDownward: true,
          };
        }
        if (!isLastInRow) {
          return {
            direction: 'right-[-30px] top-1/2 -translate-y-1/2',
            isDownward: false,
          };
        }
      }
      return null;
    };

    return (
      <div
        className={`h-full flex ${
          movieStore.isZeroShotMode ? 'items-center justify-center' : ''
        }`}
      >
        <div
          className={`grid ${getGridCols()} ${getGapSize()} justify-items-center relative ${
            movieStore.isZeroShotMode ? 'w-fit' : 'w-full'
          }`}
        >
          {buttons.map(({ label, icon, step, handler, isCompleted }, index) => (
            <div key={label} className="relative">
              <ControlDial
                label={label}
                icon={icon}
                onClick={() => movieStore[handler]()}
                isActive={movieStore.currentStep === step}
                isCompleted={isCompleted}
                size={getDialSize()}
                disabled={!movieStore.isPowerOn}
              />

              {/* Add arrows between buttons only if showArrows is true */}
              {showArrows &&
                !movieStore.isZeroShotMode &&
                index < buttons.length - 1 && (
                  <>
                    {(() => {
                      const arrowConfig = getArrowPosition(
                        index,
                        buttons.length
                      );
                      if (arrowConfig) {
                        return (
                          <Arrow
                            direction={arrowConfig.direction}
                            isDownward={arrowConfig.isDownward}
                            isActive={
                              movieStore.isPowerOn &&
                              movieStore.currentStep === step
                            }
                          />
                        );
                      }
                      return null;
                    })()}
                  </>
                )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
