import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { getSystemPrompt, AiMode } from '@/lib/ai/prompts';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const aiMode = (url.searchParams.get('mode') ?? 'itinerary') as AiMode;
    const ctxParam = url.searchParams.get('ctx');
    const tripContext = ctxParam ? JSON.parse(decodeURIComponent(ctxParam)) : {};

    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response('Missing Gemini API Key', { status: 500 });
    }

    const systemPrompt = getSystemPrompt(aiMode, tripContext);

    const result = streamText({
      model: google('gemini-1.5-flash'),
      system: systemPrompt,
      messages,
    });

    return result.toTextStreamResponse();
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(error.message || 'Internal Server Error', { status: 500 });
  }
}
