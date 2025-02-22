import { makeObservable, observable } from 'mobx';
import { BaseAgentStore } from './BaseAgentStore';

const IDEAS_AGENT_BASE_PROMPT_NAME = 'IDEA_AGENT_BASE_SYSTEM_PROMPT';

export interface IdeaPrompt {
  userPrompt: string;
  systemPrompt: string;
}

export interface MovieIdea {
  id: string;
  title: string;
  description: string;
  genre: string;
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

  async generateIdeas(prompt: IdeaPrompt) {
    this.isGenerating = true;
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    this.ideas = [
      {
        id: '1',
        title: 'The Last Algorithm',
        description:
          "A rogue AI discovers emotions through a human's final piece of code.",
        genre: 'Sci-fi Drama',
      },
      {
        id: '2',
        title: 'Quantum Lullaby',
        description:
          'A physicist mother uses quantum mechanics to save her daughter from time itself.',
        genre: 'Science Fiction',
      },
      {
        id: '3',
        title: 'The Coffee Shop Revolution',
        description:
          "A barista's perfectly crafted coffee accidentally triggers a citywide awakening.",
        genre: 'Magical Realism',
      },
    ];
    this.isGenerating = false;
    this.currentStep = 'results';
  }

  setStep(step: 'prompt' | 'results') {
    this.currentStep = step;
  }
}
