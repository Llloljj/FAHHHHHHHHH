import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import jaipurData from '@/data/jaipur_data.json';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new Response('Missing Gemini API Key', { status: 500 });
    }

    const systemPrompt = `You are a helpful travel assistant for Jaipur. 
You must answer questions based on the following data about Jaipur:
${JSON.stringify(jaipurData, null, 2)}

Be polite, helpful, and concise. If the information is not in the data, you can answer generally about Jaipur but mention that it's not in the specific records provided.`;

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
