'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function StoryGenerator() {
  const [config, setConfig] = useState({
    prompt: '',
    genre: 'fantasy',
    tone: 'neutre',
    style: 'descriptif',
    length: 'medium',
    target_audience: 'adult',
    perspective: 'third_person',
    theme: '',
    conflict_type: 'both',
    writing_style: 'narratif',
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [openRouterStatus, setOpenRouterStatus] = useState(false);

  // Vérifie qu’OpenRouter est joignable via la route serveur
  useEffect(() => {
    fetch('/api/openrouter?action=test')
      .then((r) => r.json())
      .then((data) => setOpenRouterStatus(data.configured))
      .catch(() => setOpenRouterStatus(false));
  }, []);

  // Fonction de génération via la route serveur
  async function generate() {
    if (!config.prompt) return;

    setLoading(true);
    setResult('');

    const fullPrompt = `Ecris une histoire complète de genre ${config.genre} avec un ton ${config.tone} et un style ${config.style}.
IDÉE : ${config.prompt}
PARAMÈTRES :
- Longueur : ${config.length}
- Public cible : ${config.target_audience}
- Perspective narrative : ${config.perspective}
- Type de conflit : ${config.conflict_type}
- Style d'écriture : ${config.writing_style}
- Thème principal : ${config.theme || 'libre'}

Crée une histoire engageante avec :
- Un début captivant
- Des personnages intéressants
- Une intrigue bien construite
- Un dénouement satisfaisant

Écris en français avec un style ${config.writing_style} et adapte le contenu pour ${config.target_audience}.`;

    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          maxTokens:
            config.length === 'short'
              ? 1000
              : config.length === 'medium'
              ? 2000
              : 3000,
          temperature: 0.8,
          systemMessage: `Tu es un écrivain professionnel spécialisé dans la création d'histoires de genre ${config.genre}.`,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'Erreur inconnue');
      setResult(data.result || 'Aucun résultat');
    } catch (error: any) {
      setResult(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                Générateur d’Histoires Complet
              </h1>
              <p className="text-gray-600 mt-2">
                Créez des histoires personnalisées avec de nombreuses options
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={
                  openRouterStatus
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }
              >
                OpenRouter {openRouterStatus ? 'OK' : 'KO'}
              </Badge>
              <Link href="/">
                <Button variant="outline">Retour Accueil</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche : configuration */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuration de l’Histoire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <Select
                    value={config.genre}
                    onValueChange={(v) => setConfig({ ...config, genre: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="science-fiction">Science-Fiction</SelectItem>
                      <SelectItem value="mystere">Mystère</SelectItem>
                      <SelectItem value="thriller">Thriller</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="drame">Drame</SelectItem>
                      <SelectItem value="horreur">Horreur</SelectItem>
                      <SelectItem value="aventure">Aventure</SelectItem>
                      <SelectItem value="comedie">Comédie</SelectItem>
                      <SelectItem value="historique">Historique</SelectItem>
                      <SelectItem value="contemporain">Contemporain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ton */}
                <div>
                  <label className="block text-sm font-medium mb-2">Ton</label>
                  <Select
                    value={config.tone}
                    onValueChange={(v) => setConfig({ ...config, tone: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leger">Léger</SelectItem>
                      <SelectItem value="sombre">Sombre</SelectItem>
                      <SelectItem value="humoristique">Humoristique</SelectItem>
                      <SelectItem value="serieux">Sérieux</SelectItem>
                      <SelectItem value="dramatique">Dramatique</SelectItem>
                      <SelectItem value="optimiste">Optimiste</SelectItem>
                      <SelectItem value="neutre">Neutre</SelectItem>
                      <SelectItem value="mysterieux">Mystérieux</SelectItem>
                      <SelectItem value="romantique">Romantique</SelectItem>
                      <SelectItem value="ironique">Ironique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Style d’écriture */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Style d’écriture
                  </label>
                  <Select
                    value={config.style}
                    onValueChange={(v) => setConfig({ ...config, style: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="descriptif">Descriptif</SelectItem>
                      <SelectItem value="dialogue-intensif">Dialogue intensif</SelectItem>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="introspectif">Introspectif</SelectItem>
                      <SelectItem value="poetique">Poétique</SelectItem>
                      <SelectItem value="minimaliste">Minimaliste</SelectItem>
                      <SelectItem value="classique">Classique</SelectItem>
                      <SelectItem value="moderne">Moderne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Longueur */}
                <div>
                  <label className="block text-sm font-medium mb-2">Longueur</label>
                  <Select
                    value={config.length}
                    onValueChange={(v) => setConfig({ ...config, length: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Courte (500-800 mots)</SelectItem>
                      <SelectItem value="medium">Moyenne (1000-1500 mots)</SelectItem>
                      <SelectItem value="long">Longue (2000-3000 mots)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Public cible */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Public cible
                  </label>
                  <Select
                    value={config.target_audience}
                    onValueChange={(v) => setConfig({ ...config, target_audience: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="children">Enfants (8-12 ans)</SelectItem>
                      <SelectItem value="young_adult">Jeunes adultes (13-17 ans)</SelectItem>
                      <SelectItem value="adult">Adultes (18+ ans)</SelectItem>
                      <SelectItem value="all_ages">Tous âges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Perspective narrative */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Perspective narrative
                  </label>
                  <Select
                    value={config.perspective}
                    onValueChange={(v) => setConfig({ ...config, perspective: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first_person">Première personne (Je)</SelectItem>
                      <SelectItem value="third_person">Troisième personne (Il/Elle)</SelectItem>
                      <SelectItem value="omniscient">Narrateur omniscient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Type de conflit */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Type de conflit
                  </label>
                  <Select
                    value={config.conflict_type}
                    onValueChange={(v) => setConfig({ ...config, conflict_type: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="internal">Conflit interne</SelectItem>
                      <SelectItem value="external">Conflit externe</SelectItem>
                      <SelectItem value="both">Les deux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Thème */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Thème principal (optionnel)
                  </label>
                  <Input
                    value={config.theme}
                    onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                    placeholder="Ex: amitié, courage, rédemption..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Colonne droite : prompt + résultat */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prompt */}
            <Card>
              <CardHeader>
                <CardTitle>Votre idée d’histoire</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={config.prompt}
                  onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
                  placeholder="Décrivez votre idée d’histoire en détail..."
                  className="min-h-32 mb-4"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {config.prompt.length} caractères
                  </span>
                  <Button
                    onClick={generate}
                    disabled={!config.prompt || loading || !openRouterStatus}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Génération en cours...
                      </>
                    ) : (
                      'Générer l’histoire'
                    )}
                  </Button>
                </div>
                {!openRouterStatus && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      OpenRouter n’est pas configuré. Vérifiez vos variables
                      d’environnement dans Vercel.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Résultat */}
            <Card>
              <CardHeader>
                <CardTitle>Histoire générée</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div>
                    <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto mb-4">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                        {result}
                      </pre>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={() => navigator.clipboard.writeText(result)}
                        variant="outline"
                        size="sm"
                      >
                        Copier
                      </Button>
                      <Button
                        onClick={() => setResult('')}
                        variant="outline"
                        size="sm"
                      >
                        Effacer
                      </Button>
                      <Button
                        onClick={() => {
                          const blob = new Blob([result], {
                            type: 'text/plain',
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'histoire-generee.txt';
                          a.click();
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Télécharger
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">📖</div>
                    <p className="text-lg mb-2">
                      Votre histoire apparaîtra ici...
                    </p>
                    <p className="text-sm">
                      Configurez les options, entrez votre idée et cliquez sur
                      Générer
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Exemples d’idées */}
        <Card className="mt-8 bg-white/60">
          <CardHeader>
            <CardTitle>Exemples d’idées d’histoires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Un facteur qui livre du courrier entre les rêves et la réalité découvre un message urgent',
                'Une pianiste entend les secrets des gens à travers la musique qu’elle joue sur son piano',
                'Dans une ville où il pleut des souvenirs, un collecteur doit retrouver un souvenir perdu crucial',
                'Un réparateur d’horloges peut voyager dans le temps, mais seulement de 5 minutes en arrière',
                'Une boulangère réalise que ses pâtisseries donnent des super-pouvoirs temporaires aux clients',
                'Un gardien de phare découvre que sa lumière guide les âmes perdues vers l’au-delà',
                'Une fleuriste peut voir l’aura émotionnelle des gens et décide d’aider avec ses fleurs',
                'Un chauffeur de taxi de nuit transporte mystérieusement des passagers déjà morts',
              ].map((idea, idx) => (
                <button
                  key={idx}
                  onClick={() => setConfig({ ...config, prompt: idea })}
                  className="text-left p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors text-sm border border-blue-100"
                >
                  {idea}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
