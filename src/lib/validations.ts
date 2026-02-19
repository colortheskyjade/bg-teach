import { z } from 'zod';

export const BoardGameSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  slug: z.string().optional(),
  bggUrl: z.string().url('Invalid BGG URL').startsWith('https://boardgamegeek.com/', 'Must be a BoardGameGeek URL'),
});

export type BoardGameInput = z.infer<typeof BoardGameSchema>;
