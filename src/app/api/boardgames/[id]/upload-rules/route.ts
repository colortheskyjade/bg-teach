import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import ResourceModel, { ResourceType } from '@/models/Resource';
import BoardGameModel from '@/models/BoardGame';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(
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

    const boardGameId = boardGame._id;
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Use Gemini 3.0 Flash (gemini-2.0-flash-exp for now as it's the 2.0/3.0 preview)
    const { text } = await generateText({
      model: google('gemini-3-flash-preview'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please extract and format the text from this board game rulebook PDF. Focus on game setup, rules, and components. Use markdown for formatting.',
            },
            {
              type: 'file',
              data: buffer,
              mediaType: 'application/pdf',
            },
          ],
        },
      ],
    });

    // Save or update the resource
    const resource = await ResourceModel.findOneAndUpdate(
      { boardGameId, type: ResourceType.RULEBOOK },
      { $set: { boardGameId, type: ResourceType.RULEBOOK, content: text } },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      id: resource._id.toString(),
      type: resource.type,
      content: resource.content,
    });
  } catch (error: any) {
    console.error('Error processing PDF:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
