// Service n8n SÉCURISÉ - Webhooks uniquement, AUCUNE clé API requise

export interface N8nPayload {
  action: string;
  data?: any;
  metadata?: {
    userId?: string;
    documentId?: string;
    timestamp?: string;
    source: string;
  };
}

export interface N8nResponse {
  success: boolean;
  message: string;
  data?: any;
}

export class N8nService {
  private webhookUrl: string;

  constructor() {
    this.webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || '';
  }

  // Vérifier si n8n est configuré
  isConfigured(): boolean {
    return Boolean(this.webhookUrl &&
                   this.webhookUrl !== 'https://votre-instance-n8n.com/webhook/votre-webhook-id' &&
                   this.webhookUrl.startsWith('http'));
  }

  // Envoyer des données à n8n via webhook (SÉCURISÉ)
  async sendToN8n(payload: N8nPayload): Promise<N8nResponse> {
    if (!this.isConfigured()) {
      console.warn('N8N webhook not configured - skipping automation');
      return {
        success: false,
        message: 'N8N webhook not configured. Add NEXT_PUBLIC_N8N_WEBHOOK_URL to .env.local'
      };
    }

    try {
      // Préparer les données avec métadonnées de sécurité
      const securePayload = {
        ...payload,
        metadata: {
          ...payload.metadata,
          source: 'suite-ecriture-ncp',
          timestamp: new Date().toISOString(),
        }
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Suite-Ecriture-NCP/1.0',
        },
        body: JSON.stringify(securePayload)
      });

      if (!response.ok) {
        throw new Error(`Webhook failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json().catch(() => ({ received: true }));

      return {
        success: true,
        message: 'Data sent to n8n successfully',
        data: result
      };

    } catch (error) {
      console.error('N8N webhook error:', error);
      return {
        success: false,
        message: `Failed to send to n8n: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Test de connexion
  async testConnection(): Promise<N8nResponse> {
    return this.sendToN8n({
      action: 'test_connection',
      data: {
        message: 'Test de connexion depuis la suite d\'écriture',
        timestamp: new Date().toISOString()
      },
      metadata: {
        source: 'test-connection'
      }
    });
  }
}

// Instance singleton
export const n8nService = new N8nService();
