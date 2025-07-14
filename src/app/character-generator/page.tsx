'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CharacterGenerationConfig, CharacterProfile } from '@/types/ncp';

export default function CharacterGenerator() {
  const [config, setConfig] = useState<CharacterGenerationConfig>({
    role: 'protagonist',
    genre: 'fantasy',
    story_context: '',
    personality_focus: 'complex',
    background_complexity: 'detailed',
    include_flaws: true,
    include_backstory: true,
    include_relationships: true,
    include_arc: true,
    creativity_level: 'standard',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CharacterProfile | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        const data: CharacterProfile = await response.json();
        setResult(data);
      } else {
        console.error('Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Générateur de Personnages</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                Système NCP Characters
              </Badge>
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                ← Retour à l'accueil
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Panel de configuration */}
          <div className="lg:col-span-2 space-y-6">

            {/* Configuration de base */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🎭</span>
                  <span>Configuration du Personnage</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nom (optionnel)</label>
                    <Input
                      placeholder="Laisser vide pour génération automatique"
                      value={config.name || ''}
                      onChange={(e) => setConfig({...config, name: e.target.value || undefined})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Rôle dans l'histoire</label>
                    <Select value={config.role} onValueChange={(value: 'protagonist' | 'antagonist' | 'support' | 'background') => setConfig({...config, role: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">❌ Aucun</SelectItem>
                        <SelectItem value="protagonist">🦸 Protagoniste</SelectItem>
                        <SelectItem value="antagonist">😈 Antagoniste</SelectItem>
                        <SelectItem value="support">🤝 Personnage de soutien</SelectItem>
                        <SelectItem value="background">👥 Personnage secondaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Contexte de l'histoire</label>
                  <Textarea
                    placeholder="Décrivez brièvement l'univers et l'intrigue où évoluera ce personnage... Par exemple: Dans un monde post-apocalyptique où la magie a remplacé la technologie..."
                    value={config.story_context}
                    onChange={(e) => setConfig({...config, story_context: e.target.value})}
                    className="min-h-24"
                  />
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={!config.story_context.trim() || isGenerating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création du personnage...
                    </>
                  ) : (
                    '✨ Générer le Personnage'
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Configuration avancée */}
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Paramètres Avancés</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basique</TabsTrigger>
                    <TabsTrigger value="personality">Personnalité</TabsTrigger>
                    <TabsTrigger value="options">Options</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">🎭 Genre littéraire</label>
                        <Select value={config.genre} onValueChange={(value) => setConfig({...config, genre: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">❌ Aucun</SelectItem>
                            <SelectItem value="fantasy">Fantasy</SelectItem>
                            <SelectItem value="science-fiction">Science-Fiction</SelectItem>
                            <SelectItem value="mystère">Mystère</SelectItem>
                            <SelectItem value="thriller">Thriller</SelectItem>
                            <SelectItem value="romance">Romance</SelectItem>
                            <SelectItem value="drame">Drame</SelectItem>
                            <SelectItem value="horreur">Horreur</SelectItem>
                            <SelectItem value="historique">Historique</SelectItem>
                            <SelectItem value="contemporain">Contemporain</SelectItem>
                            <SelectItem value="érotique">Érotique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">👤 Préférence de genre</label>
                        <Select
                          value={config.gender_preference || 'any'}
                          onValueChange={(value: 'any' | 'male' | 'female' | 'non-binary') => setConfig({...config, gender_preference: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">❌ Aucun</SelectItem>
                            <SelectItem value="any">⚪ Indifférent</SelectItem>
                            <SelectItem value="male">♂️ Masculin</SelectItem>
                            <SelectItem value="female">♀️ Féminin</SelectItem>
                            <SelectItem value="non-binary">⚡ Non-binaire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">🎂 Tranche d'âge</label>
                        <div className="flex space-x-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={config.age_range?.min || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              age_range: {
                                min: Number(e.target.value) || 0,
                                max: config.age_range?.max || 100
                              }
                            })}
                          />
                          <Input
                            type="number"
                            placeholder="Max"
                            value={config.age_range?.max || ''}
                            onChange={(e) => setConfig({
                              ...config,
                              age_range: {
                                min: config.age_range?.min || 0,
                                max: Number(e.target.value) || 100
                              }
                            })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">📚 Complexité du background</label>
                        <Select
                          value={config.background_complexity}
                          onValueChange={(value: 'simple' | 'detailed' | 'extensive') => setConfig({...config, background_complexity: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">❌ Aucun</SelectItem>
                            <SelectItem value="simple">Simple</SelectItem>
                            <SelectItem value="detailed">Détaillé</SelectItem>
                            <SelectItem value="extensive">Extensif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="personality" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">🎯 Focus personnalité</label>
                        <Select
                          value={config.personality_focus}
                          onValueChange={(value: 'heroic' | 'complex' | 'mysterious' | 'comedic' | 'tragic') => setConfig({...config, personality_focus: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">❌ Aucun</SelectItem>
                            <SelectItem value="heroic">🦸 Héroïque</SelectItem>
                            <SelectItem value="complex">🧩 Complexe</SelectItem>
                            <SelectItem value="mysterious">🕵️ Mystérieux</SelectItem>
                            <SelectItem value="comedic">😄 Comique</SelectItem>
                            <SelectItem value="tragic">😢 Tragique</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">🎨 Niveau de créativité</label>
                        <Select
                          value={config.creativity_level}
                          onValueChange={(value: 'low' | 'standard' | 'high' | 'maximum') => setConfig({...config, creativity_level: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">❌ Aucun</SelectItem>
                            <SelectItem value="low">Conservateur</SelectItem>
                            <SelectItem value="standard">Standard</SelectItem>
                            <SelectItem value="high">Créatif</SelectItem>
                            <SelectItem value="maximum">Expérimental</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="options" className="space-y-4 mt-6">
                    <div className="space-y-4">
                      {[
                        { key: 'include_flaws', label: '❌ Inclure les défauts et faiblesses', desc: 'Ajoute de la profondeur au personnage' },
                        { key: 'include_backstory', label: '📖 Générer un background détaillé', desc: 'Histoire personnelle et origine' },
                        { key: 'include_relationships', label: '👥 Créer des relations avec autres personnages', desc: 'Connexions avec d\'autres personnes' },
                        { key: 'include_arc', label: '📈 Définir un arc de développement', desc: 'Évolution du personnage dans l\'histoire' },
                      ].map(option => (
                        <div key={option.key} className="border rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={option.key}
                              checked={config[option.key as keyof CharacterGenerationConfig] as boolean}
                              onChange={(e) => setConfig({...config, [option.key]: e.target.checked})}
                              className="rounded"
                            />
                            <div className="flex-1">
                              <label htmlFor={option.key} className="text-sm font-medium">{option.label}</label>
                              <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Panneau de résultats */}
          <div className="space-y-6">

            {/* Info outil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>🎯</span>
                  <span>Générateur Professionnel</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Système:</span>
                  <Badge variant="outline">NCP Character</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Compatible:</span>
                  <Badge variant="outline">Workflows n8n</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Export:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">JSON</Badge>
                </div>
                <Separator />
                <div className="text-xs text-gray-500">
                  Génère des personnages complexes avec arcs narratifs intégrés pour tous types d'ouvrages.
                </div>
              </CardContent>
            </Card>

            {/* Résultats */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>✨ {result.name}</span>
                    <Badge variant="outline" className="bg-purple-50">
                      {result.role === 'protagonist' ? '🦸 Protagoniste' :
                       result.role === 'antagonist' ? '😈 Antagoniste' :
                       result.role === 'support' ? '🤝 Soutien' : '👥 Secondaire'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">

                      {/* Informations de base */}
                      <div>
                        <h5 className="text-sm font-medium mb-2">ℹ️ Informations de base</h5>
                        <div className="text-sm text-gray-700 space-y-1">
                          {result.age && <p><span className="font-medium">Âge:</span> {result.age} ans</p>}
                          {result.gender && <p><span className="font-medium">Genre:</span> {result.gender}</p>}
                          {result.occupation && <p><span className="font-medium">Profession:</span> {result.occupation}</p>}
                        </div>
                      </div>

                      <Separator />

                      {/* Personnalité */}
                      <div>
                        <h5 className="text-sm font-medium mb-2">🧠 Personnalité</h5>
                        <div className="space-y-2">
                          <div>
                            <span className="text-xs font-medium text-gray-600">Traits:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.personality.traits.map((trait, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{trait}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-green-600">Forces:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.personality.strengths.map((strength, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-green-700 border-green-200">{strength}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-red-600">Faiblesses:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.personality.weaknesses.map((weakness, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-red-700 border-red-200">{weakness}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-orange-600">Peurs:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.personality.fears.map((fear, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-orange-700 border-orange-200">{fear}</Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <span className="text-xs font-medium text-blue-600">Désirs:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {result.personality.desires.map((desire, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs text-blue-700 border-blue-200">{desire}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Arc narratif */}
                      <div>
                        <h5 className="text-sm font-medium mb-2">📈 Arc de développement</h5>
                        <div className="text-sm text-gray-700 space-y-2">
                          <div>
                            <span className="font-medium text-blue-600">Point de départ:</span>
                            <p className="text-xs mt-1">{result.character_arc.starting_point}</p>
                          </div>
                          <div>
                            <span className="font-medium text-purple-600">Transformation:</span>
                            <p className="text-xs mt-1">{result.character_arc.transformation}</p>
                          </div>
                          <div>
                            <span className="font-medium text-green-600">Point d'arrivée:</span>
                            <p className="text-xs mt-1">{result.character_arc.ending_point}</p>
                          </div>
                        </div>
                      </div>

                      {/* Apparence */}
                      {result.physical_description && (
                        <>
                          <Separator />
                          <div>
                            <h5 className="text-sm font-medium mb-2">👤 Apparence physique</h5>
                            <div className="text-sm text-gray-700 space-y-1">
                              {result.physical_description.height && <p><span className="font-medium">Taille:</span> {result.physical_description.height}</p>}
                              {result.physical_description.build && <p><span className="font-medium">Corpulence:</span> {result.physical_description.build}</p>}
                              {result.physical_description.hair && <p><span className="font-medium">Cheveux:</span> {result.physical_description.hair}</p>}
                              {result.physical_description.eyes && <p><span className="font-medium">Yeux:</span> {result.physical_description.eyes}</p>}
                              {result.physical_description.distinctive_features && result.physical_description.distinctive_features.length > 0 && (
                                <div>
                                  <span className="font-medium">Signes distinctifs:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {result.physical_description.distinctive_features.map((feature, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">{feature}</Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}

                      {/* Background */}
                      {result.background && (
                        <>
                          <Separator />
                          <div>
                            <h5 className="text-sm font-medium mb-2">📚 Background</h5>
                            <p className="text-sm text-gray-700">{result.background}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </ScrollArea>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      📋 Exporter en JSON
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      📤 Envoyer vers n8n
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>🔗 Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => window.location.href = '/chapter-planner'}>
                  📚 Planificateur de Chapitres
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => window.location.href = '/'}>
                  💡 Générateur d'Ouvrages
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  🌍 Créateur de Mondes
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  📝 Générateur de Synopsis
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
