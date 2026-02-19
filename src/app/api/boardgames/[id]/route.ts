import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import BoardGameModel from '@/models/BoardGame';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;
    
    const deletedGame = await BoardGameModel.findByIdAndDelete(id);
    
    if (!deletedGame) {
      return NextResponse.json({ error: 'Board game not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Board game deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
