// src/app/api/openrouter/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, maxTokens = 1500, temperature = 0.8, systemMessage = '' } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt manquant' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API absente (OPENROUTER_API_KEY)' }, { status: 500 });
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000',
        'X-Title': 'Story NCP Generator',
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-72b-instruct:free',
        messages: [
          { role: 'system', content: systemMessage },
          { role: 'user', content: prompt },
        ],
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const data = await res.json();
    const result = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({ result });
  } catch (e: any) {
    console.error('Erreur /api/openrouter:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  const key = process.env.OPENROUTER_API_KEY;
  return NextResponse.json({
    configured: !!key && key !== 'sk-or-v1-votre-cle-openrouter-ici',
  });
}
