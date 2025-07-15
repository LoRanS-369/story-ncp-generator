// src/lib/openrouter.ts
export const FREE_MODELS = {
  'qwen/qwen-2.5-72b-instruct:free': {
    name: 'Qwen 2.5 72B (Gratuit)',
    description: 'Excellent modèle multilingue, très performant',
    maxTokens: 32768,
  },
  'meta-llama/llama-3.2-3b-instruct:free': {
    name: 'Llama 3.2 3B (Gratuit)',
    description: 'Modèle Meta rapide et efficace',
    maxTokens: 8192,
  },
  'microsoft/phi-3-mini-128k-instruct:free': {
    name: 'Phi-3 Mini (Gratuit)',
    description: 'Modèle Microsoft compact',
    maxTokens: 128000,
  },
  'google/gemma-2-9b-it:free': {
    name: 'Gemma 2 9B (Gratuit)',
    description: 'Modèle Google performant',
    maxTokens: 8192,
  },
  'huggingface/zephyr-7b-beta:free': {
    name: 'Zephyr 7B (Gratuit)',
    description: 'Modèle HuggingFace optimisé',
    maxTokens: 4096,
  },
} as const;
