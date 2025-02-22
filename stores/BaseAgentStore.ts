import { makeObservable, observable, action } from 'mobx';

export abstract class BaseAgentStore {
  systemPrompt: string = '';
  protected basePromptName: string;

  constructor(basePromptName: string) {
    makeObservable<BaseAgentStore, 'systemPrompt' | 'setSystemPrompt'>(this, {
      systemPrompt: observable,
      setSystemPrompt: action,
    });
    this.basePromptName = basePromptName;
    this.getBaseSystemPrompt();
  }

  protected async getBaseSystemPrompt() {
    try {
      const baseSysPromptResponse = await fetch(
        `/api/agent-prompts?name=${this.basePromptName}`,
        {
          next: {
            revalidate: 86400, // Cache for 24 hours (in seconds)
          },
        }
      );

      if (!baseSysPromptResponse.ok) {
        throw new Error(
          `Failed to fetch system prompt: ${baseSysPromptResponse.statusText}`
        );
      }

      const { content } = await baseSysPromptResponse.json();
      this.setSystemPrompt(content);
    } catch (error) {
      console.error('Error fetching system prompt:', error);
      // You might want to handle this error differently depending on your needs
    }
  }

  protected setSystemPrompt(prompt: string) {
    this.systemPrompt = prompt;
  }
}
