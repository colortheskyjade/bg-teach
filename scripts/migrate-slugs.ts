import 'dotenv/config';
import mongoose from 'mongoose';
import BoardGameModel from '../src/models/BoardGame';
import { generateUniqueSlug } from '../src/lib/slugify';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in .env');
  process.exit(1);
}

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    const boardGames = await BoardGameModel.find({ 
      $or: [
        { slug: { $exists: false } },
        { slug: '' },
        { slug: null }
      ]
    });

    console.log(`Found ${boardGames.length} board games to migrate.`);

    for (const game of boardGames) {
      const slug = await generateUniqueSlug(game.name, game._id.toString());
      game.slug = slug;
      await game.save();
      console.log(`Migrated: ${game.name} -> ${slug}`);
    }

    console.log('Migration completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

migrate();
