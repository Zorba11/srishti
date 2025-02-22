import { z } from 'zod';

export const createMovieSchema = z.object({
  moviePrompt: z.string().min(1).max(280),
  promptCharacterCount: z.number().int().min(1).max(280),
  promptCharacterCountLimit: z.number().int().min(280).max(280),
  storyStructureStyle: z.enum(['default']), // Can be expanded later
  animationStyle: z.enum(['default']), // Can be expanded later
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
