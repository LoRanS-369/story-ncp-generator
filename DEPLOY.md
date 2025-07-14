# 🚀 Guide de Déploiement Vercel

## Déploiement Automatique

### Option 1 : CLI Vercel (Recommandé)
```bash
# Installer la CLI Vercel
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer depuis ce répertoire
cd story-ncp-generator
vercel

# Suivre les prompts :
# - Framework: Next.js
# - Build Command: bun run build
# - Install Command: bun install
# - Root Directory: ./
```

### Option 2 : GitHub + Vercel Dashboard
1. Pushez le code sur GitHub
2. Connectez le repo sur https://vercel.com/dashboard
3. Vercel détecte automatiquement Next.js
4. Le déploiement se fait automatiquement

## Variables d'Environnement à Configurer

Dans le dashboard Vercel ou via CLI :

```bash
# OpenRouter (REQUIS pour la génération)
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-votre-cle-ici
NEXT_PUBLIC_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
NEXT_PUBLIC_DEFAULT_MODEL=qwen/qwen-2.5-72b-instruct:free

# n8n (OPTIONNEL pour l'automatisation)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://votre-n8n.com/webhook/votre-id

# Base URL (sera auto-configurée par Vercel)
NEXT_PUBLIC_API_BASE_URL=https://votre-app.vercel.app/api
```

## Après Déploiement

1. ✅ Testez les endpoints : `/api/openrouter?action=status`
2. ✅ Testez la génération d'histoires
3. ✅ Vérifiez n8n si configuré
4. ✅ Partagez le lien public !

## URLs Typiques Vercel
- `https://story-ncp-generator.vercel.app`
- `https://story-ncp-generator-git-main-username.vercel.app`
- `https://story-ncp-generator-123abc.vercel.app`

## Troubleshooting

### Build Errors
- Vercel ignore automatiquement les erreurs TypeScript non-critiques
- Les erreurs ESLint sont ignorées via `next.config.js`

### Performance
- Toutes les pages sont statiques sauf les API routes
- OpenRouter fonctionne côté client
- n8n utilise des webhooks sécurisés

🎉 **Votre application sera accessible publiquement et partageable !**
