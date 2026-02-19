import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/mongodb';
import BoardGameModel from '@/models/BoardGame';
import { generateUniqueSlug } from '@/lib/slugify';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Always look up by slug
    const boardGame = await BoardGameModel.findOne({ slug: id }).lean();
    
    if (!boardGame) {
      return NextResponse.json({ error: 'Board game not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: boardGame._id.toString(),
      name: boardGame.name,
      slug: boardGame.slug,
      bggUrl: boardGame.bggUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const { name, bggUrl } = body;

    // Always look up by slug
    const existingGame = await BoardGameModel.findOne({ slug: id });

    if (!existingGame) {
      return NextResponse.json({ error: 'Board game not found' }, { status: 404 });
    }

    const updates: any = { name, bggUrl };
    
    // Update slug if name changed
    if (name && name !== existingGame.name) {
      updates.slug = await generateUniqueSlug(name, existingGame._id.toString());
    }

    const updatedGame = await BoardGameModel.findByIdAndUpdate(
      existingGame._id,
      updates,
      { new: true, runValidators: true }
    ).lean();

    if (!updatedGame) {
      return NextResponse.json({ error: 'Board game not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedGame._id.toString(),
      name: updatedGame.name,
      slug: updatedGame.slug,
      bggUrl: updatedGame.bggUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const deletedGame = await BoardGameModel.findOneAndDelete({ slug: id });

    if (!deletedGame) {
      return NextResponse.json({ error: 'Board game not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Board game deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
