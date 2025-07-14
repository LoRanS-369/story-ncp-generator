'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ApiDocsPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exampleRequest = {
    prompt: "Un détective découvre que son enquête sur un meurtre le mène vers son propre passé oublié",
    genre: "mystery",
    length: "medium",
    tone: "dark",
    style: "suspenseful",
    narrative_perspective: "third_person_limited",
    structure_type: "three_act",
    target_audience: "adult",
    thematic_focus: ["vérité", "rédemption", "justice"],
    conflict_type: "both",
    character_arc_type: "positive",
    creativity_level: "high",
    include_subtext: true,
    include_storytelling: true,
    generate_full_ncp: true
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.history.back()}>
                ← Retour à l'app
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Documentation principale */}
          <div className="lg:col-span-2 space-y-6">

            {/* Introduction */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Story Generator NCP API</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  API REST pour générer des idées d'histoires structurées selon le
                  <span className="font-semibold"> Narrative Context Protocol (NCP)</span>.
                  Parfaitement compatible avec n8n et autres outils d'automatisation.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">✨ Fonctionnalités</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Génération d'histoires structurées NCP</li>
                    <li>• Configuration avancée (genre, ton, style, etc.)</li>
                    <li>• Sortie JSON compatible avec tous les workflows</li>
                    <li>• Support des thèmes personnalisés</li>
                    <li>• Intégration n8n native</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Endpoint principal */}
            <Card>
              <CardHeader>
                <CardTitle>📡 Endpoint Principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono">
                  <div className="flex items-center justify-between">
                    <span>POST /api/generate-story</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(`${window.location.origin}/api/generate-story`)}
                    >
                      Copier URL
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Content-Type</h4>
                    <Badge variant="outline">application/json</Badge>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Méthode</h4>
                    <Badge className="bg-green-600">POST</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Paramètres */}
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Paramètres de Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">

                    <div className="border-l-4 border-red-400 pl-4">
                      <h4 className="font-medium text-red-800">prompt <span className="text-red-600">*requis</span></h4>
                      <p className="text-sm text-gray-600">Idée de base de l'histoire</p>
                      <Badge variant="outline" className="mt-1">string</Badge>
                    </div>

                    <div className="border-l-4 border-blue-400 pl-4">
                      <h4 className="font-medium text-blue-800">genre</h4>
                      <p className="text-sm text-gray-600">Genre littéraire (défaut: "fantasy")</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["fantasy", "science-fiction", "mystery", "thriller", "romance", "drama", "horror"].map(g => (
                          <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-l-4 border-green-400 pl-4">
                      <h4 className="font-medium text-green-800">length</h4>
                      <p className="text-sm text-gray-600">Longueur de l'histoire (défaut: "medium")</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["short", "medium", "long", "novel"].map(l => (
                          <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-l-4 border-purple-400 pl-4">
                      <h4 className="font-medium text-purple-800">tone</h4>
                      <p className="text-sm text-gray-600">Ton de l'histoire (défaut: "neutral")</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["light", "dark", "humorous", "serious", "dramatic", "suspenseful"].map(t => (
                          <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-l-4 border-yellow-400 pl-4">
                      <h4 className="font-medium text-yellow-800">narrative_perspective</h4>
                      <p className="text-sm text-gray-600">Point de vue narratif</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {["first_person", "third_person_limited", "third_person_omniscient"].map(p => (
                          <Badge key={p} variant="secondary" className="text-xs">{p.replace('_', ' ')}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-l-4 border-indigo-400 pl-4">
                      <h4 className="font-medium text-indigo-800">thematic_focus</h4>
                      <p className="text-sm text-gray-600">Liste des thèmes à explorer</p>
                      <Badge variant="outline" className="mt-1">array</Badge>
                      <p className="text-xs text-gray-500 mt-1">Ex: ["amour", "sacrifice", "rédemption"]</p>
                    </div>

                    <div className="border-l-4 border-pink-400 pl-4">
                      <h4 className="font-medium text-pink-800">Options NCP</h4>
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">include_subtext</span>
                          <Badge variant="outline">boolean</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">include_storytelling</span>
                          <Badge variant="outline">boolean</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">generate_full_ncp</span>
                          <Badge variant="outline">boolean</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Exemple de requête */}
            <Card>
              <CardHeader>
                <CardTitle>💻 Exemple de Requête</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`curl -X POST ${typeof window !== 'undefined' ? window.location.origin : ''}/api/generate-story \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(exampleRequest, null, 2)}'`}
                  </pre>
                </div>
                <Button
                  className="mt-2"
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(exampleRequest, null, 2))}
                >
                  Copier JSON
                </Button>
              </CardContent>
            </Card>

            {/* Format de réponse */}
            <Card>
              <CardHeader>
                <CardTitle>📄 Format de Réponse</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto">
                  <pre className="text-sm">
{`{
  "story": {
    "id": "story_1234567890",
    "title": "Le Secret de Willowbrook",
    "genre": "mystery",
    "logline": "Un détective découvre...",
    "narratives": [
      {
        "id": "narrative_1234567890",
        "title": "Narrative Principale",
        "subtext": {
          "perspectives": [...],
          "players": [...],
          "storypoints": [...],
          "storybeats": [...],
          "dynamics": [...]
        },
        "storytelling": {
          "overviews": [...],
          "moments": [...]
        }
      }
    ]
  },
  "generated_content": {
    "idea": "Prompt original",
    "summary": "Résumé de l'histoire",
    "characters": ["Personnage 1", "Personnage 2"],
    "plot_outline": "Structure narrative",
    "themes": ["Thème 1", "Thème 2"]
  },
  "metadata": {
    "generation_time": "2025-01-14T...",
    "config_used": {...},
    "version": "1.0.0"
  }
}`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Intégration n8n */}
          <div className="space-y-6">

            {/* Guide n8n */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🔗</span>
                  <span>Intégration n8n</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-bold">1</div>
                    <span className="text-sm">Ajoutez un nœud HTTP Request</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-bold">2</div>
                    <span className="text-sm">URL: /api/generate-story</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-bold">3</div>
                    <span className="text-sm">Méthode: POST</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-bold">4</div>
                    <span className="text-sm">Body: JSON avec paramètres</span>
                  </div>
                </div>

                <Separator />

                <div className="bg-green-50 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 text-sm mb-1">✅ Prêt à utiliser !</h4>
                  <p className="text-xs text-green-700">
                    La réponse JSON est directement utilisable dans vos workflows n8n.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Codes de statut */}
            <Card>
              <CardHeader>
                <CardTitle>📊 Codes de Statut</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-600">200</Badge>
                  <span className="text-sm">Succès</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-yellow-600">400</Badge>
                  <span className="text-sm">Paramètres invalides</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className="bg-red-600">500</Badge>
                  <span className="text-sm">Erreur serveur</span>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>💬 Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-gray-600">
                  Besoin d'aide ? L'API est conçue pour être simple et intuitive.
                </p>

                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    📖 Voir les exemples
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    🧪 Tester l'API
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
