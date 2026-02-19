import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import connectDB from '@/lib/db/mongodb';
import BoardGameModel from '@/models/BoardGame';
import ResourceModel, { ResourceType } from '@/models/Resource';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, data } = await req.json();
    const boardGameId = data?.boardGameId;

    let systemPrompt = 'You are a helpful board game teacher. You help users understand rules, find new games, and manage their collection.';

    if (boardGameId) {
      try {
        await connectDB();
        const boardGame = await BoardGameModel.findById(boardGameId).lean();
        if (boardGame) {
          const resource = await ResourceModel.findOne({ 
            boardGameId: boardGame._id, 
            type: ResourceType.RULEBOOK 
          }).lean();

          if (resource?.content) {
            systemPrompt = `You are an expert teacher for the board game "${boardGame.name}". 
            Use the following rulebook content to answer the user's questions accurately. 
            If the information is not in the rulebook, you can use your general knowledge but mention it's not from the official rules.
            
            RULEBOOK CONTENT:
            ${resource.content}`;
          } else {
            systemPrompt = `You are an expert teacher for the board game "${boardGame.name}". 
            I don't have the specific rulebook for this game yet, so use your general knowledge to help the user.`;
          }
        }
      } catch (error) {
        console.error('Error fetching board game context:', error);
      }
    }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages,
      system: systemPrompt,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
