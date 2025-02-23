import { makeObservable, observable } from 'mobx';
import { BaseAgentStore } from './BaseAgentStore';
import { SCRIPT_AGENT_BASE_SYSTEM_PROMPT } from '@/constants/PromptNames';

export interface ScriptPrompt {
  userPrompt: string;
  systemPrompt: string;
}

export interface MovieScript {
  content: string;
}

export class ScriptAgentStore extends BaseAgentStore {
  currentStep: 'prompt' | 'results' = 'prompt';
  isGenerating: boolean = false;
  script: MovieScript | null = null;
  lastPrompt: ScriptPrompt | null = null;

  constructor() {
    super(SCRIPT_AGENT_BASE_SYSTEM_PROMPT);
    makeObservable(this, {
      currentStep: observable,
      isGenerating: observable,
      script: observable,
      lastPrompt: observable,
    });
  }

  setIsGenerating(value: boolean) {
    this.isGenerating = value;
  }

  async generateScript(prompt: ScriptPrompt, movieId: string) {
    try {
      this.setIsGenerating(true);
      this.lastPrompt = prompt;

      const response = await fetch('/api/movies/generate-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movieId: movieId,
          userPrompt: prompt.userPrompt, // selected idea
          systemPrompt: prompt.systemPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate script');
      }

      const generatedScript = await response.json();
      this.script = {
        content: generatedScript.script,
      };

      this.currentStep = 'results';
    } catch (error) {
      console.error('Error generating script:', error);
      throw error;
    } finally {
      this.setIsGenerating(false);
    }
  }

  setStep(step: 'prompt' | 'results') {
    this.currentStep = step;
  }

  setScript(content: string) {
    this.script = { content };
  }
}
