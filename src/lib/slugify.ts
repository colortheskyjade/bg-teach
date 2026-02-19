import BoardGameModel from '../models/BoardGame';

/**
 * Generates a URL-friendly slug from a string.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
}

/**
 * Generates a unique slug for a board game.
 * If the slug already exists, appends a number to make it unique.
 */
export async function generateUniqueSlug(name: string, currentId?: string): Promise<string> {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingGame = await BoardGameModel.findOne({ 
      slug, 
      _id: { $ne: currentId } 
    }).lean();

    if (!existingGame) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
