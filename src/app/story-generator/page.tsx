'use client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
    writing_style: 'narratif'
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [openRouterStatus, setOpenRouterStatus] = useState(false);

  const checkOpenRouter = async () => {
    try {
      const res = await fetch(`${window.location.origin}/api/openrouter?action=status`);
      const data = await res.json();
      setOpenRouterStatus(data.configured || false);
    } catch (error) {
      console.error('Erreur OpenRouter:', error);
    }
  };

  useEffect(() => {
    checkOpenRouter();
  }, []);

  const generate = async () => {
    if (!config.prompt) return;
    setLoading(true);

    try {
      const fullPrompt = `Ecris une histoire complete de genre ${config.genre} avec un ton ${config.tone} et un style ${config.style}.
IDEE: ${config.prompt}
PARAMETRES:
- Longueur: ${config.length}
- Public cible: ${config.target_audience}
- Perspective narrative: ${config.perspective}
- Type de conflit: ${config.conflict_type}
- Style d'ecriture: ${config.writing_style}
- Theme principal: ${config.theme || 'libre'}
Cree une histoire engageante avec:
- Un debut captivant
- Des personnages interessants
- Une intrigue bien construite
- Un denouement satisfaisant
Ecris en francais avec un style ${config.writing_style} et adapte le contenu pour ${config.target_audience}.`;

      const res = await fetch(`${window.location.origin}/api/openrouter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          maxTokens: config.length === 'short' ? 1000 : config.length === 'medium' ? 2000 : 3000,
          temperature: 0.8,
          systemMessage: `Tu es un ecrivain professionnel specialise dans la creation d'histoires de genre ${config.genre}. Ecris avec un style ${config.style} et un ton ${config.tone}.`
        })
      });

      if (res.ok) {
        const data = await res.json();
        setResult(data.result || 'Histoire generee avec succes!');
      } else {
        const errorData = await res.json();
        setResult('Erreur: ' + (errorData.error || 'Impossible de generer l histoire'));
      }
    } catch (error) {
      setResult('Erreur de connexion: ' + error);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                Generateur d Histoires Complet
              </h1>
              <p className="text-gray-600 mt-2">
                Creez des histoires personnalisees avec de nombreuses options
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={openRouterStatus ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}>
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
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuration de l Histoire</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Genre</label>
                  <Select value={config.genre} onValueChange={(value) => setConfig({...config, genre: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="fantasy">Fantasy</SelectItem>
                      <SelectItem value="science-fiction">Science-Fiction</SelectItem>
                      <SelectItem value="mystere">Mystere</SelectItem>
                      <SelectItem value="thriller">Thriller</SelectItem>
                      <SelectItem value="romance">Romance</SelectItem>
                      <SelectItem value="drame">Drame</SelectItem>
                      <SelectItem value="horreur">Horreur</SelectItem>
                      <SelectItem value="aventure">Aventure</SelectItem>
                      <SelectItem value="comedie">Comedie</SelectItem>
                      <SelectItem value="historique">Historique</SelectItem>
                      <SelectItem value="contemporain">Contemporain</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Ton</label>
                  <Select value={config.tone} onValueChange={(value) => setConfig({...config, tone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="leger">Leger</SelectItem>
                      <SelectItem value="sombre">Sombre</SelectItem>
                      <SelectItem value="humoristique">Humoristique</SelectItem>
                      <SelectItem value="serieux">Serieux</SelectItem>
                      <SelectItem value="dramatique">Dramatique</SelectItem>
                      <SelectItem value="optimiste">Optimiste</SelectItem>
                      <SelectItem value="neutre">Neutre</SelectItem>
                      <SelectItem value="mysterieux">Mysterieux</SelectItem>
                      <SelectItem value="romantique">Romantique</SelectItem>
                      <SelectItem value="ironique">Ironique</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Style d Ecriture</label>
                  <Select value={config.style} onValueChange={(value) => setConfig({...config, style: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="descriptif">Descriptif</SelectItem>
                      <SelectItem value="dialogue-intensif">Dialogue intensif</SelectItem>
                      <SelectItem value="action">Action</SelectItem>
                      <SelectItem value="introspectif">Introspectif</SelectItem>
                      <SelectItem value="poetique">Poetique</SelectItem>
                      <SelectItem value="minimaliste">Minimaliste</SelectItem>
                      <SelectItem value="classique">Classique</SelectItem>
                      <SelectItem value="moderne">Moderne</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Longueur</label>
                  <Select value={config.length} onValueChange={(value) => setConfig({...config, length: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="short">Courte (500-800 mots)</SelectItem>
                      <SelectItem value="medium">Moyenne (1000-1500 mots)</SelectItem>
                      <SelectItem value="long">Longue (2000-3000 mots)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Public Cible</label>
                  <Select value={config.target_audience} onValueChange={(value) => setConfig({...config, target_audience: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="children">Enfants (8-12 ans)</SelectItem>
                      <SelectItem value="young_adult">Jeunes adultes (13-17 ans)</SelectItem>
                      <SelectItem value="adult">Adultes (18+ ans)</SelectItem>
                      <SelectItem value="all_ages">Tous ages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Perspective Narrative</label>
                  <Select value={config.perspective} onValueChange={(value) => setConfig({...config, perspective: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="first_person">Premiere personne (Je)</SelectItem>
                      <SelectItem value="third_person">Troisieme personne (Il/Elle)</SelectItem>
                      <SelectItem value="omniscient">Narrateur omniscient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Type de Conflit</label>
                  <Select value={config.conflict_type} onValueChange={(value) => setConfig({...config, conflict_type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="internal">Conflit interne</SelectItem>
                      <SelectItem value="external">Conflit externe</SelectItem>
                      <SelectItem value="both">Les deux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Theme Principal (optionnel)</label>
                  <Input
                    value={config.theme}
                    onChange={(e) => setConfig({...config, theme: e.target.value})}
                    placeholder="Ex: amitie, courage, redemption..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Votre Idee d Histoire</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={config.prompt}
                  onChange={(e) => setConfig({...config, prompt: e.target.value})}
                  placeholder="Decrivez votre idee d histoire en detail..."
                  className="min-h-32 mb-4"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{config.prompt.length} caracteres</span>
                  <Button
                    onClick={generate}
                    disabled={!config.prompt || loading || !openRouterStatus}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generation en cours...
                      </>
                    ) : (
                      'Generer l Histoire Complete'
                    )}
                  </Button>
                </div>
                {!openRouterStatus && (
                  <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      OpenRouter n est pas configure. Verifiez vos variables d environnement dans Vercel.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Histoire Generee</CardTitle>
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
                        Copier le Texte
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
                          const blob = new Blob([result], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'histoire-generee.txt';
                          a.click();
                        }}
                        variant="outline"
                        size="sm"
                      >
                        Telecharger
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-6xl mb-4">📖</div>
                    <p className="text-lg mb-2">Votre histoire apparaitra ici...</p>
                    <p className="text-sm">Configurez les options, entrez votre idee et cliquez sur Generer</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <Card className="mt-8 bg-white/60">
          <CardHeader>
            <CardTitle>Exemples d Idees d Histoires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Un facteur qui livre du courrier entre les reves et la realite decouvre un message urgent",
                "Une pianiste entend les secrets des gens a travers la musique qu elle joue sur son piano",
                "Dans une ville ou il pleut des souvenirs, un collecteur doit retrouver un souvenir perdu crucial",
                "Un reparateur d horloges peut voyager dans le temps, mais seulement de 5 minutes en arriere",
                "Une boulangere realise que ses patisseries donnent des super-pouvoirs temporaires aux clients",
                "Un gardien de phare decouvre que sa lumiere guide les ames perdues vers l au-dela",
                "Une fleuriste peut voir l aura emotionnelle des gens et decide d aider avec ses fleurs",
                "Un chauffeur de taxi de nuit transporte mysterieusement des passagers deja morts"
              ].map((idea, index) => (
                <button
                  key={index}
                  onClick={() => setConfig({...config, prompt: idea})}
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
