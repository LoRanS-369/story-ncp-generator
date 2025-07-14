import { NextRequest, NextResponse } from 'next/server';
import { n8nService } from '@/lib/n8n';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Utiliser le service n8n sécurisé (webhook uniquement)
    const result = await n8nService.sendToN8n(body);

    if (!result.success) {
      return NextResponse.json({
        error: result.message,
        configured: n8nService.isConfigured(),
        help: 'Configurez NEXT_PUBLIC_N8N_WEBHOOK_URL dans .env.local'
      }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('N8N integration error:', error);
    return NextResponse.json({
      error: 'Failed to process n8n request',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Test de connexion n8n
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  switch (action) {
    case 'test':
      const result = await n8nService.testConnection();
      return NextResponse.json({
        configured: n8nService.isConfigured(),
        test: result
      });

    case 'status':
      return NextResponse.json({
        configured: n8nService.isConfigured(),
        webhookUrl: n8nService.isConfigured() ? '✅ Configuré' : '❌ Non configuré',
        security: 'Webhook uniquement - Aucune clé API requise'
      });

    default:
      return NextResponse.json({
        message: 'N8N API endpoint ready',
        endpoints: {
          'POST /': 'Envoyer données à n8n',
          'GET /?action=test': 'Tester la connexion',
          'GET /?action=status': 'Statut de configuration'
        }
      });
  }
}
