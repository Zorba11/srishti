import { makeObservable, observable } from 'mobx';

export type FrameStepType = 'form' | 'image';

export class FrameStore {
  currentStep: FrameStepType = 'form';
  isGeneratingPrompt: boolean = false;
  imagePrompt: string = '';
  isCreatingImage: boolean = false;
  baseSceneImage: string | null = null;

  constructor() {
    makeObservable(this, {
      currentStep: observable,
      isGeneratingPrompt: observable,
      imagePrompt: observable,
      isCreatingImage: observable,
      baseSceneImage: observable,
    });
  }

  setStep(step: FrameStepType) {
    this.currentStep = step;
  }

  async generateBaseScenePrompt(
    frameIndex: number,
    shotDescription: string,
    nextShotDescription: string,
    script: string,
    movieId: string
  ) {
    try {
      this.isGeneratingPrompt = true;
      const response = await fetch('/api/movies/generate-frame-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId,
          frameIndex,
          shotDescription,
          nextShotDescription,
          script,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate base scene prompt');
      }
      const data = await response.json();
      this.imagePrompt = data.prompt;
      this.currentStep = 'image';
    } catch (error) {
      console.error('Error generating base scene prompt:', error);
      throw error;
    } finally {
      this.isGeneratingPrompt = false;
    }
  }

  async createBaseSceneImage(
    movieId: string,
    frameIndex: number,
    imagePrompt: string
  ) {
    try {
      this.isCreatingImage = true;
      const response = await fetch('/api/movies/create-frame-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId,
          frameIndex,
          imagePrompt,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to create base scene image');
      }
      const data = await response.json();
      this.baseSceneImage = data.imageUrl;
    } catch (error) {
      console.error('Error creating base scene image:', error);
      throw error;
    } finally {
      this.isCreatingImage = false;
    }
  }
}
