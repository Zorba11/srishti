'use client';
import { IdeaStep } from './IdeaStep';
import { ActorsStep } from './ActorsStep';
import { ScriptStep } from './ScriptStep';
import { FramesStep } from './FramesStep';
import { ScreenplayStep } from './ScreenplayStep';
import { MusicStep } from './MusicStep';
import { DialoguesStep } from './DialoguesStep';
import { ShotsStep } from './ShotsStep';
import { RenderStep } from './FullMovieStep';
import { MovieStep } from '@/types/MovieTypes';
import { MovieStore } from '@/stores/MovieStore';

const stepComponents: Record<
  NonNullable<MovieStep>,
  React.ComponentType<{ movieStore: MovieStore }>
> = {
  idea: IdeaStep,
  actors: ActorsStep,
  script: ScriptStep,
  screenplay: ScreenplayStep,
  frames: FramesStep,
  music: MusicStep,
  dialogues: DialoguesStep,
  shots: ShotsStep,
  render: RenderStep,
};

interface StepRendererProps {
  currentStep: MovieStep;
  movieStore: MovieStore;
}

export const StepRenderer = ({
  currentStep,
  movieStore,
}: StepRendererProps) => {
  if (!currentStep) return null;

  const StepComponent = stepComponents[currentStep];
  return <StepComponent movieStore={movieStore} />;
};
