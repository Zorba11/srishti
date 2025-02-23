import { makeObservable, observable } from 'mobx';
import { BaseAgentStore } from './BaseAgentStore';
import { IDEAS_AGENT_BASE_PROMPT_NAME } from '@/constants/PromptNames';

export interface IdeaPrompt {
  userPrompt: string;
  systemPrompt: string;
}

export interface MovieIdea {
  description: string;
}

export class IdeaAgentStore extends BaseAgentStore {
  currentStep: 'prompt' | 'results' = 'prompt';
  isGenerating: boolean = false;
  ideas: MovieIdea[] = [];

  constructor() {
    super(IDEAS_AGENT_BASE_PROMPT_NAME);
    makeObservable(this, {
      currentStep: observable,
      isGenerating: observable,
      ideas: observable,
    });
  }

  setIsGenerating(value: boolean) {
    this.isGenerating = value;
  }

  async generateIdeas(prompt: IdeaPrompt, movieId: string) {
    try {
      this.setIsGenerating(true);

      const response = await fetch('/api/movies/generate-ideas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId: movieId,
          userPrompt: prompt.userPrompt,
          systemPrompt: prompt.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const generatedIdeas = await response.json();
      this.ideas = generatedIdeas.map((idea: any) => ({
        description: idea,
      }));

      this.currentStep = 'results';
    } catch (error) {
      console.error('Error generating ideas:', error);
      // You might want to add error handling here
    } finally {
      this.setIsGenerating(false);
    }
  }

  setStep(step: 'prompt' | 'results') {
    this.currentStep = step;
  }
}
