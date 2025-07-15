'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Générateur d'Ouvrages NCP
                </h1>
              </div>
              <p className="text-gray-600 text-lg">
                Créez des histoires, personnages et chapitres avec l'IA
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Que souhaitez-vous créer aujourd'hui ?
          </h2>
          <p className="text-xl text-gray-600">
            Choisissez votre outil de création alimenté par l'IA
          </p>
        </div>

        {/* Grille des outils */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Générateur d'histoires */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📚</span>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">
                Générateur d'Histoires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Créez des histoires complètes avec structure NCP, personnages et intrigue détaillée.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  OpenRouter intégré (LLM gratuits)
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Compatible n8n
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Structure NCP complète
                </div>
              </div>
              <Link href="/story-generator" passHref>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3">
                  Créer une Histoire
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Générateur de personnages */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">👤</span>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">
                Générateur de Personnages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Développez des personnages riches avec background, personnalité et arcs narratifs.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Personnalités détaillées
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Background complexe
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Arcs de développement
                </div>
              </div>
              <Link href="/character-generator" passHref>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold py-3">
                  Créer un Personnage
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Planificateur de chapitres */}
          <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <span className="text-3xl">📖</span>
              </div>
              <CardTitle className="text-xl font-bold text-gray-800">
                Planificateur de Chapitres
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                Structurez votre livre avec des chapitres organisés et des plans détaillés.
              </p>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Structure en actes
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Plans de chapitres
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Progression narrative
                </div>
              </div>
              <Link href="/chapter-planner" passHref>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-semibold py-3">
                  Planifier les Chapitres
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Section de statut des services */}
        <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
          <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
            Services Intégrés
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🚀</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">OpenRouter</h4>
              <p className="text-sm text-gray-600">
                Accès aux meilleurs LLM gratuits pour la génération de contenu
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔗</span>
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">n8n Compatible</h4>
              <p className="text-sm text-gray-600">
                Automatisation et notifications pour vos workflows
              </p>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            Alimenté par l'IA • Structure NCP • Open Source
          </p>
        </div>
      </div>
    </div>
  );
}
