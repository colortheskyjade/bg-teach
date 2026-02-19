import { describe, it, expect } from 'vitest';
import { BoardGameSchema } from '../lib/validations';

describe('BoardGameSchema', () => {
  it('should validate a correct board game input', () => {
    const input = {
      name: 'Catan',
      bggUrl: 'https://boardgamegeek.com/boardgame/13/catan',
    };
    const result = BoardGameSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  it('should fail if name is empty', () => {
    const input = {
      name: '',
      bggUrl: 'https://boardgamegeek.com/boardgame/13/catan',
    };
    const result = BoardGameSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should fail if bggUrl is not a valid URL', () => {
    const input = {
      name: 'Catan',
      bggUrl: 'not-a-url',
    };
    const result = BoardGameSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  it('should fail if bggUrl does not start with boardgamegeek.com', () => {
    const input = {
      name: 'Catan',
      bggUrl: 'https://google.com',
    };
    const result = BoardGameSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});
