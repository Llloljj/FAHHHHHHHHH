import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getSystemPrompt, AiMode } from '@/lib/ai/prompts';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages, aiMode, tripContext } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response('Missing Gemini API Key', { status: 500 });
    }

    const systemPrompt = getSystemPrompt(aiMode as AiMode, tripContext);

    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
