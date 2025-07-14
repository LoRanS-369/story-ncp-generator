import { NextRequest, NextResponse } from 'next/server';
import { openRouter, FREE_MODELS } from '@/lib/openrouter';

export async function POST(request: NextRequest) {
  try {
    const { prompt, model, maxTokens, temperature, systemMessage } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!openRouter.isConfigured()) {
      return NextResponse.json({
        error: 'OpenRouter not configured',
        message: 'Add NEXT_PUBLIC_OPENROUTER_API_KEY to your .env.local file',
        help: 'Get your free API key from https://openrouter.ai/'
      }, { status: 400 });
    }

    const result = await openRouter.generateText(prompt, {
      model,
      maxTokens,
      temperature,
      systemMessage
    });

    return NextResponse.json({
      success: true,
      result,
      model: model || process.env.NEXT_PUBLIC_DEFAULT_MODEL
    });

  } catch (error) {
    console.error('OpenRouter API error:', error);
    return NextResponse.json({
      error: 'Failed to generate text',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'models':
      return NextResponse.json({
        freeModels: FREE_MODELS,
        currentModel: process.env.NEXT_PUBLIC_DEFAULT_MODEL
      });

    case 'test':
      if (!openRouter.isConfigured()) {
        return NextResponse.json({
          configured: false,
          message: 'OpenRouter not configured',
          help: 'Add NEXT_PUBLIC_OPENROUTER_API_KEY to .env.local'
        });
      }

      try {
        const testResult = await openRouter.generateText('Dis bonjour en français', {
          maxTokens: 50
        });

        return NextResponse.json({
          configured: true,
          test: testResult,
          model: process.env.NEXT_PUBLIC_DEFAULT_MODEL
        });
      } catch (error) {
        return NextResponse.json({
          configured: false,
          error: error instanceof Error ? error.message : 'Test failed'
        });
      }

    case 'status':
      return NextResponse.json({
        configured: openRouter.isConfigured(),
        currentModel: process.env.NEXT_PUBLIC_DEFAULT_MODEL,
        availableModels: Object.keys(FREE_MODELS).length,
        apiUrl: process.env.NEXT_PUBLIC_OPENROUTER_BASE_URL
      });

    default:
      return NextResponse.json({
        message: 'OpenRouter API endpoint ready',
        endpoints: {
          'POST /': 'Générer du texte',
          'GET /?action=models': 'Liste des modèles gratuits',
          'GET /?action=test': 'Tester la configuration',
          'GET /?action=status': 'Statut de configuration'
        },
        freeModelsCount: Object.keys(FREE_MODELS).length
      });
  }
}
