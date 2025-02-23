import { makeObservable, observable } from 'mobx';
import { BaseAgentStore } from './BaseAgentStore';
import { SCREENPLAY_AGENT_BASE_SYSTEM_PROMPT } from '@/constants/PromptNames';
import { Screenplay, ScreenplayPrompt, Shot } from '@/types/MovieTypes';

export class ScreenplayAgentStore extends BaseAgentStore {
  currentStep: 'prompt' | 'results' = 'prompt';
  isGenerating: boolean = false;
  screenplay: Screenplay | null = null;
  lastPrompt: ScreenplayPrompt | null = null;

  constructor() {
    super(SCREENPLAY_AGENT_BASE_SYSTEM_PROMPT);
    makeObservable(this, {
      currentStep: observable,
      isGenerating: observable,
      screenplay: observable,
      lastPrompt: observable,
    });
  }

  setIsGenerating(value: boolean) {
    this.isGenerating = value;
  }

  async generateScreenplay(prompt: ScreenplayPrompt, movieId: string) {
    try {
      this.setIsGenerating(true);
      this.lastPrompt = prompt;

      const response = await fetch('/api/movies/generate-screenplay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId,
          userPrompt: prompt.userPrompt,
          systemPrompt: prompt.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate screenplay');
      }

      const data = await response.json();

      this.setScreenplay(data.screenplay);

      this.currentStep = 'results';
    } catch (error) {
      console.error('Error generating screenplay:', error);
      throw error;
    } finally {
      this.setIsGenerating(false);
    }
  }

  setStep(step: 'prompt' | 'results') {
    this.currentStep = step;
  }

  setScreenplay(shots: Shot[]) {
    this.screenplay = { content: shots };
  }
}
