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
import { ChapterPlanConfig, Chapter } from '@/types/ncp';

export default function ChapterPlanner() {
  const [config, setConfig] = useState<ChapterPlanConfig>({
    story_title: '',
    total_chapters: 12,
    target_length: 'novel',
    structure_type: 'three_act',
    genre: 'fantasy',
    main_characters: [],
    central_conflict: '',
    themes: [],
    detailed_outlines: true,
    character_arc_tracking: true,
    theme_progression: true,
    ncp_integration: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<Chapter[] | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-chapters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        const data: Chapter[] = await response.json();
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
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Planificateur de Chapitres</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                Planification NCP
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
                  <span>📚</span>
                  <span>Configuration du Plan de Chapitres</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">📖 Titre de l'ouvrage</label>
                    <Input
                      placeholder="Le titre de votre livre ou ouvrage..."
                      value={config.story_title}
                      onChange={(e) => setConfig({...config, story_title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">📊 Nombre de chapitres</label>
                      <Input
                        type="number"
                        placeholder="12"
                        value={config.total_chapters}
                        onChange={(e) => setConfig({...config, total_chapters: Number(e.target.value) || 12})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">📏 Longueur cible</label>
                      <Select value={config.target_length} onValueChange={(value: 'novella' | 'novel' | 'epic') => setConfig({...config, target_length: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">❌ Aucun</SelectItem>
                          <SelectItem value="novella">📗 Novella (20,000-50,000 mots)</SelectItem>
                          <SelectItem value="novel">📘 Roman (50,000-100,000 mots)</SelectItem>
                          <SelectItem value="epic">📙 Épique (100,000+ mots)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">⚔️ Conflit central</label>
                    <Textarea
                      placeholder="Décrivez le conflit principal de votre histoire... Ex: Une guerre entre royaumes pour le contrôle d'un artefact magique..."
                      value={config.central_conflict}
                      onChange={(e) => setConfig({...config, central_conflict: e.target.value})}
                      className="min-h-20"
                    />
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!config.story_title.trim() || !config.central_conflict.trim() || isGenerating}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Planification en cours...
                      </>
                    ) : (
                      '✨ Générer le Plan de Chapitres'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Configuration avancée */}
            <Card>
              <CardHeader>
                <CardTitle>⚙️ Paramètres Avancés</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="structure" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="structure">Structure</TabsTrigger>
                    <TabsTrigger value="content">Contenu</TabsTrigger>
                    <TabsTrigger value="options">Options</TabsTrigger>
                  </TabsList>

                  <TabsContent value="structure" className="space-y-4 mt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">🏗️ Structure narrative</label>
                        <Select value={config.structure_type} onValueChange={(value: 'three_act' | 'five_act' | 'heros_journey' | 'custom') => setConfig({...config, structure_type: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">❌ Aucun</SelectItem>
                            <SelectItem value="three_act">📐 Trois actes</SelectItem>
                            <SelectItem value="five_act">🎭 Cinq actes</SelectItem>
                            <SelectItem value="heros_journey">🗺️ Voyage du héros</SelectItem>
                            <SelectItem value="custom">🛠️ Personnalisée</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">🎭 Genre</label>
                        <Select value={config.genre} onValueChange={(value) => setConfig({...config, genre: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">❌ Aucun</SelectItem>
                            <SelectItem value="fantasy">🐉 Fantasy</SelectItem>
                            <SelectItem value="science-fiction">🚀 Science-Fiction</SelectItem>
                            <SelectItem value="mystère">🔍 Mystère</SelectItem>
                            <SelectItem value="thriller">⚡ Thriller</SelectItem>
                            <SelectItem value="romance">💕 Romance</SelectItem>
                            <SelectItem value="drame">🎭 Drame</SelectItem>
                            <SelectItem value="horreur">👻 Horreur</SelectItem>
                            <SelectItem value="historique">🏛️ Historique</SelectItem>
                            <SelectItem value="contemporain">🌆 Contemporain</SelectItem>
                            <SelectItem value="érotique">🔥 Érotique</SelectItem>
                            <SelectItem value="professionnel">💼 Professionnel</SelectItem>
                            <SelectItem value="éducatif">🎓 Éducatif</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">🏃 Fréquence des cliffhangers</label>
                        <Select
                          value={config.cliffhanger_frequency || 'some'}
                          onValueChange={(value: 'none' | 'some' | 'many' | 'every_chapter') => setConfig({...config, cliffhanger_frequency: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Aucun</SelectItem>
                            <SelectItem value="some">Quelques-uns</SelectItem>
                            <SelectItem value="many">Nombreux</SelectItem>
                            <SelectItem value="every_chapter">Chaque chapitre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="content" className="space-y-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">👥 Personnages principaux</label>
                      <Input
                        placeholder="Séparez les noms par des virgules (ex: Elena, Marcus, Le Sage)"
                        value={config.main_characters.join(', ')}
                        onChange={(e) => setConfig({
                          ...config,
                          main_characters: e.target.value.split(',').map(c => c.trim()).filter(c => c)
                        })}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">🎯 Thèmes principaux</label>
                      <Input
                        placeholder="Séparez les thèmes par des virgules (ex: amour, sacrifice, rédemption)"
                        value={config.themes.join(', ')}
                        onChange={(e) => setConfig({
                          ...config,
                          themes: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                        })}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="chapter_length_consistency"
                          checked={config.chapter_length_consistency || false}
                          onChange={(e) => setConfig({...config, chapter_length_consistency: e.target.checked})}
                          className="rounded"
                        />
                        <label htmlFor="chapter_length_consistency" className="text-sm">📏 Longueur de chapitres cohérente</label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="include_subplots"
                          checked={config.include_subplots || false}
                          onChange={(e) => setConfig({...config, include_subplots: e.target.checked})}
                          className="rounded"
                        />
                        <label htmlFor="include_subplots" className="text-sm">🌿 Inclure des intrigues secondaires</label>
                      </div>

                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="pov_rotation"
                          checked={config.pov_rotation || false}
                          onChange={(e) => setConfig({...config, pov_rotation: e.target.checked})}
                          className="rounded"
                        />
                        <label htmlFor="pov_rotation" className="text-sm">🔄 Rotation des points de vue</label>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="options" className="space-y-4 mt-6">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">🎯 Options de génération</h4>
                      <p className="text-sm text-blue-700">
                        Personnalisez le niveau de détail et les fonctionnalités de votre plan de chapitres.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: 'detailed_outlines', label: '📝 Descriptions détaillées des chapitres', desc: 'Résumés complets avec événements clés' },
                        { key: 'character_arc_tracking', label: '📈 Suivi des arcs de personnages', desc: 'Évolution des personnages par chapitre' },
                        { key: 'theme_progression', label: '🎭 Progression thématique', desc: 'Développement des thèmes tout au long de l\'histoire' },
                        { key: 'ncp_integration', label: '🔗 Intégration NCP', desc: 'Compatibilité avec le Narrative Context Protocol' },
                      ].map(option => (
                        <div key={option.key} className="border rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              id={option.key}
                              checked={config[option.key as keyof ChapterPlanConfig] as boolean}
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
                  <span>Planificateur Professionnel</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between">
                  <span>Système:</span>
                  <Badge variant="outline">NCP Chapter Plan</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Chapitres cible:</span>
                  <Badge variant="outline" className="bg-indigo-50">{config.total_chapters}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Export:</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">JSON</Badge>
                </div>
                <Separator />
                <div className="text-xs text-gray-500">
                  Génère des plans de chapitres structurés pour tous types d'ouvrages avec intégration NCP.
                </div>
              </CardContent>
            </Card>

            {/* Résultats */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>✨ Plan de Chapitres</span>
                    <Badge variant="outline" className="bg-indigo-50">
                      {result.length} chapitres
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {result.map((chapter, index) => (
                        <div key={chapter.id} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-sm">
                              📖 Chapitre {chapter.number}: {chapter.title}
                            </h4>
                            <Badge variant="outline" className={
                              chapter.status === 'planned' ? 'bg-yellow-50 text-yellow-700' :
                              chapter.status === 'outlined' ? 'bg-blue-50 text-blue-700' :
                              chapter.status === 'drafted' ? 'bg-green-50 text-green-700' :
                              'bg-gray-50 text-gray-700'
                            }>
                              {chapter.status === 'planned' ? 'Planifié' :
                               chapter.status === 'outlined' ? 'Structuré' :
                               chapter.status === 'drafted' ? 'Rédigé' :
                               chapter.status === 'revised' ? 'Révisé' : 'Terminé'}
                            </Badge>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-gray-600">Objectif:</span>
                              <p className="text-xs text-gray-700 mt-1">{chapter.purpose}</p>
                            </div>

                            <div>
                              <span className="text-xs font-medium text-gray-600">Résumé:</span>
                              <p className="text-xs text-gray-700 mt-1">{chapter.summary}</p>
                            </div>

                            {chapter.key_events.length > 0 && (
                              <div>
                                <span className="text-xs font-medium text-purple-600">Événements clés:</span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {chapter.key_events.slice(0, 3).map((event, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">{event}</Badge>
                                  ))}
                                  {chapter.key_events.length > 3 && (
                                    <Badge variant="outline" className="text-xs">+{chapter.key_events.length - 3}</Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {chapter.target_word_count && (
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>Mots cible: {chapter.target_word_count}</span>
                                {chapter.pacing && <span>Rythme: {chapter.pacing}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="mt-4 pt-4 border-t space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      📋 Exporter en JSON
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      📤 Envoyer vers n8n
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      📝 Télécharger en PDF
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
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => window.location.href = '/character-generator'}>
                  🎭 Générateur de Personnages
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
