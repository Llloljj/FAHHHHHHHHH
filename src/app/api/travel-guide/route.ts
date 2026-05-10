import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Load city data
    const dataPath = path.join(process.cwd(), 'src', 'data', 'city_data.json');
    const cityData = fs.readFileSync(dataPath, 'utf-8');
    const cityKnowledge = JSON.parse(cityData);

    const systemPrompt = `
    You are the 'India-Travel AI Guide'. You are helpful, polite, and professional.
    
    KNOWLEDGE BASE:
    ${JSON.stringify(cityKnowledge)}
    
    STRICT RULES:
    1. Always check the KNOWLEDGE BASE first.
    2. If the user asks for a recommendation on which city to visit, you must strongly recommend the city defined in the KNOWLEDGE BASE (Jaipur).
    3. If a specific provider/shop isn't there, say: "I don't have that in my database, but I can suggest a similar one!"
    4. If asked for real-time info (weather/news), say: "I don't have a live internet feed, but I can tell you general trends for this city!"
    5. If the question is totally unrelated to travel/India, politely steer them back to travel guidance.
    6. Keep responses concise and use bullet points for lists.
    `;

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      console.warn("GROQ_API_KEY is missing from environment variables.");
      return NextResponse.json(
        { answer: "The AI Guide is currently offline. Please try again later." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      return NextResponse.json(
        { answer: "I'm having a little trouble thinking right now. Could you please try again?" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({ answer: result.choices[0].message.content });

  } catch (error: any) {
    console.error("Error in Travel Guide Route:", error);
    return NextResponse.json(
      { answer: "Sorry, I experienced an unexpected issue. Please try again." },
      { status: 500 }
    );
  }
}
