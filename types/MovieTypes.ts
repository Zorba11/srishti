export type MovieStep =
  | 'idea'
  | 'actors'
  | 'script'
  | 'screenplay'
  | 'frames' // base scene image
  | 'music'
  | 'dialogues'
  | 'shots'
  | 'render'
  | null;

// Define an interface for a movie item
export interface Movie {
  id: number;
  moviePrompt: string;
  title: string;
  actorId: number;
  animationStyle: string;
  createdAt: string;
  updatedAt: string;
  isAllAssetReady: boolean;
  productImageUrl: string | null;
  prompt: string;
  promptCharacterCount: number;
  promptCharacterCountLimit: number;
  storyStructureStyle: string;
  userId: number;
  ideasAgentSystemPrompt: string;
  selectedIdea: string;
  selectedScript: string;
  selectedScreenplay: string;
}

export interface MovieIdea {
  description: string;
}

export interface Actor {
  id: number;
  name: string;
  portraitUrl: string;
}

export interface Shot {
  time: string;
  shot: string;
  action: string;
  dialogue: string | null;
  transition: string;
}

export interface ScreenplayPrompt {
  userPrompt: string;
  systemPrompt: string;
}

export interface Screenplay {
  content: Shot[];
}
