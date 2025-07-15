'use client';

import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function GenerateStory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-center">🚧 En Construction</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>
            Cette fonctionnalité utilise les API de génération d'histoires existantes.
          </p>
          <p className="text-sm text-gray-600">
            Utilisez les endpoints API directement ou l'interface de développement.
          </p>
          <div className="space-y-2">
            <Link href="/api-docs" className="block">
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                📚 Documentation API
              </button>
            </Link>
            <Link href="/" className="block">
              <button className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600">
                🏠 Retour à l'accueil
              </button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
