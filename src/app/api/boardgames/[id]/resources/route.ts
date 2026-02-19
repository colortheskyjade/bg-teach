import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import ResourceModel from '@/models/Resource';
import BoardGameModel from '@/models/BoardGame';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id: slug } = await params;

    // Find the board game by slug to get its ID
    const boardGame = await BoardGameModel.findOne({ slug }).lean();
    
    if (!boardGame) {
      return NextResponse.json({ error: 'Board game not found' }, { status: 404 });
    }

    const resources = await ResourceModel.find({ boardGameId: boardGame._id }).lean();
    
    const formattedResources = resources.map((res: any) => ({
      id: res._id.toString(),
      type: res.type,
      content: res.content,
    }));

    return NextResponse.json(formattedResources);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
