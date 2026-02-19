import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import BoardGameModel from '@/models/BoardGame';
import { BoardGameSchema } from '@/lib/validations';
import { generateUniqueSlug } from '@/lib/slugify';

export async function GET() {
  try {
    await connectDB();
    const boardGames = await BoardGameModel.find({}).lean();
    const formattedGames = boardGames.map((game: any) => ({
      id: game._id.toString(),
      name: game.name || 'Unknown Name',
      slug: game.slug,
      bggUrl: game.bggUrl || '#',
    }));
    return NextResponse.json(formattedGames);
  } catch (error: any) {
    console.error('API GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch board games' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Validate input
    const validatedData = BoardGameSchema.parse(body);
    
    // Generate unique slug
    const slug = await generateUniqueSlug(validatedData.name);
    
    const newGame = await BoardGameModel.create({
      ...validatedData,
      slug
    });
    
    return NextResponse.json({
      id: newGame._id.toString(),
      name: newGame.name,
      slug: newGame.slug,
      bggUrl: newGame.bggUrl,
    }, { status: 201 });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error.code === 11000) {
      return NextResponse.json({ error: 'A game with this name already exists' }, { status: 400 });
    }
    console.error('API POST Error:', error);
    return NextResponse.json({ error: 'Failed to create board game' }, { status: 500 });
  }
}
