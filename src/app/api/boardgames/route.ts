import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import BoardGameModel from '@/models/BoardGame';

export async function GET() {
  try {
    await connectDB();
    const boardGames = await BoardGameModel.find({}).lean();
    const formattedGames = boardGames.map((game: any) => ({
      id: game._id.toString(),
      name: game.name || 'Unknown Name',
      bggUrl: game.bggUrl || '#',
    }));
    return NextResponse.json(formattedGames);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, bggUrl } = body;
    
    const newGame = await BoardGameModel.create({ name, bggUrl });
    return NextResponse.json({
      id: newGame._id.toString(),
      name: newGame.name,
      bggUrl: newGame.bggUrl,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
