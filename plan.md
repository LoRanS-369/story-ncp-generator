# Plan du Projet Story-NCP-Generator

## Objectifs Généraux
Déployer l'application en ligne de manière basique avec priorité open-source/gratuit/sécurisé, intégrer CrewAI pour l'orchestration d'agents IA, ajouter des visualisations NCP, des boucles de feedback, l'édition de prompts, des exports variés, la génération d'images, un dashboard pour agents, la modification d'images, la connexion à APIs LLM/images, un outil Amazon BSR, intégrer une DB (PocketBase pour pure open-source/self-hosted), et boosts pertinents (Cloudinary, Sentry, Stripe). Adresser sécurité dès le début sans compromis.

## Tâches à Faire (To Do)
- Configurer déploiement sur Vercel (fiable pour Next.js, gratuit long-term pour basics, sécurisé avec HTTPS/SSO, adapté pour SaaS ; vérifier vercel.json, guider GitHub push/deploy).
- Installer et intégrer CrewAI via npm, créer route API sécurisée pour crews (agents pour analyse, feedback, images, exports, écriture/relecture).
- Ajouter visualisations NCP avec react-flow dans NCPPanel.tsx.
- Intégrer APIs open-source (Hugging Face pour IA/images, Replicate pour générative) et boucles de feedback automatisées, avec focus sécurité (validation inputs).
- Ajouter section d'édition de prompts IA dans page.tsx.
- Implémenter exports vers n8n, .doc/.odt/.pdf/.json, en utilisant templates KDP dans src/templates/kdp/.
- Intégrer génération d'images avec Stable Diffusion via Hugging Face (gratuit, sécurisé), option Jaaz backup, utiliser gabarit 6x9 pouces.
- Ajouter dashboard UI pour gestion/prompting agents CrewAI.
- Créer onglet pour visualisation/modification images (preview, chat IA, export PNG/JPG).
- Ajouter page settings pour connexion APIs LLM (OpenAI/Claude/Grok) et images, avec stockage sécurisé de keys (env vars server-side).
- Développer outil Amazon BSR/niches/mots-clés dans nouvel onglet, utilisant AWS free tier (Lambda pour queries API v5, gratuit/sécurisé).
- Intégrer boosts : Cloudinary pour storage médias, Sentry pour monitoring erreurs, Stripe pour paiements (tiers gratuits).
- Implémenter bonnes pratiques sécurité globales (env vars pour keys, auth avec DB, validation Zod, CORS/CSRF, updates deps).

## Tâches en Cours
- Aucune.

## Tâches Terminées
- Analyse ressources free-for-dev et révision plan.
- Intégrer PocketBase comme DB (open-source, self-hosted, léger avec auth/storage, gratuit, sécurisé ; installer et configurer).

Dernière mise à jour : [Date actuelle]. Mise à jour à chaque avancement.