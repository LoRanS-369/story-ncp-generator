// Service OpenRouter pour LLM gratuits

export interface OpenRouterConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
}

// Modèles gratuits disponibles sur OpenRouter
export const FREE_MODELS = {
  'qwen/qwen-2.5-72b-instruct:free': {
    name: 'Qwen 2.5 72B (Gratuit)',
    description: 'Excellent modèle multilingue, très performant',
    maxTokens: 32768
  },
  'meta-llama/llama-3.2-3b-instruct:free': {
    name: 'Llama 3.2 3B (Gratuit)',
    description: 'Modèle Meta rapide et efficace',
    maxTokens: 8192
  },
  'microsoft/phi-3-mini-128k-instruct:free': {
    name: 'Phi-3 Mini (Gratuit)',
    description: 'Modèle Microsoft compact',
    maxTokens: 128000
  },
  'google/gemma-2-9b-it:free': {
    name: 'Gemma 2 9B (Gratuit)',
    description: 'Modèle Google performant',
    maxTokens: 8192
  },
  'huggingface/zephyr-7b-beta:free': {
    name: 'Zephyr 7B (Gratuit)',
    description: 'Modèle HuggingFace optimisé',
    maxTokens: 4096
  }
} as const;

export class OpenRouterService {
  private config: OpenRouterConfig;

  constructor() {
    this.config = {
      apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
      model: process.env.NEXT_PUBLIC_DEFAULT_MODEL || 'qwen/qwen-2.5-72b-instruct:free'
    };
  }

  async generateText(prompt: string, options?: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    systemMessage?: string;
  }): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('OpenRouter API key not configured. Please add NEXT_PUBLIC_OPENROUTER_API_KEY to your .env.local file');
    }

    const model = options?.model || this.config.model;
    const messages: OpenRouterMessage[] = [];

    // Message système optionnel
    if (options?.systemMessage) {
      messages.push({
        role: 'system',
        content: options.systemMessage
      });
    }

    // Message utilisateur
    messages.push({
      role: 'user',
      content: prompt
    });

    const requestBody: OpenRouterRequest = {
      model,
      messages,
      max_tokens: options?.maxTokens || 2000,
      temperature: options?.temperature || 0.7,
      top_p: 1
    };

    try {
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Suite d\'écriture NCP'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`OpenRouter API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from OpenRouter');
      }

      return data.choices[0].message.content;

    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw error;
    }
  }

  // Méthodes spécialisées pour l'écriture créative

  async generateStory(prompt: string, genre?: string): Promise<string> {
    const systemMessage = `Tu es un écrivain professionnel spécialisé dans la création d'histoires ${genre ? `de ${genre}` : 'créatives'}.
    Écris de manière engageante, avec des détails vivants et un style littéraire de qualité.
    Crée des personnages intéressants et des situations captivantes.`;

    return this.generateText(prompt, {
      systemMessage,
      maxTokens: 3000,
      temperature: 0.8
    });
  }

  async generateCharacter(prompt: string): Promise<string> {
    const systemMessage = `Tu es un expert en création de personnages pour la fiction.
    Crée des personnages tridimensionnels avec une personnalité complexe, un background intéressant,
    des motivations claires et des traits distinctifs. Sois créatif et original.`;

    return this.generateText(prompt, {
      systemMessage,
      maxTokens: 2000,
      temperature: 0.9
    });
  }

  async generateChapter(prompt: string, context?: string): Promise<string> {
    const systemMessage = `Tu es un romancier expérimenté. Écris un chapitre complet et engageant.
    ${context ? `Contexte de l'histoire : ${context}` : ''}
    Assure-toi que le chapitre a une structure narrative solide avec un début, un développement et une fin.`;

    return this.generateText(prompt, {
      systemMessage,
      maxTokens: 4000,
      temperature: 0.7
    });
  }

  // Utilitaires
  getAvailableModels() {
    return FREE_MODELS;
  }

  isConfigured(): boolean {
    return !!this.config.apiKey && this.config.apiKey !== 'sk-or-v1-votre-cle-openrouter-ici';
  }
}

// Instance singleton
export const openRouter = new OpenRouterService();
