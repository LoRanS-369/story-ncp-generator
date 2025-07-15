'use client';

import { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function UnifiedGenerator() {
  const [tab, setTab] = useState('story');

  const [storyConfig, setStoryConfig] = useState({
    prompt: '',
    genre: 'none',
    tone: 'none',
    style: 'none',
    length: 'none',
    target_audience: 'none',
    perspective: 'none',
    conflict_type: 'none',
    theme: '',
  });

  const [characterConfig, setCharacterConfig] = useState({
    name: '',
    role: 'none',
    age: '',
    traits: '',
    background: '',
  });

  const [chapterConfig, setChapterConfig] = useState({
    count: '1',
    plan: '',
    summary: '',
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [openRouterStatus, setOpenRouterStatus] = useState(false);

  // Vérifie qu’OpenRouter est OK
  const checkOpenRouter = async () => {
    const res = await fetch('/api/openrouter?action=test');
    const data = await res.json();
    setOpenRouterStatus(data.configured);
  };

  // Charge une fois
  useState(() => {
    checkOpenRouter();
  });

  // Génération unique
  async function generateAll() {
    if (!storyConfig.prompt) {
      alert('Veuillez saisir une idée d’histoire.');
      return;
    }

    setLoading(true);
    setResult('');

    const fullPrompt = `
GÉNÉRATION UNIFIÉE :

1) HISTOIRE :
- Idée : ${storyConfig.prompt}
- Genre : ${storyConfig.genre}
- Ton : ${storyConfig.tone}
- Style : ${storyConfig.style}
- Longueur : ${storyConfig.length}
- Public : ${storyConfig.target_audience}
- Perspective : ${storyConfig.perspective}
- Conflit : ${storyConfig.conflict_type}
- Thème : ${storyConfig.theme || 'libre'}

2) PERSONNAGE :
- Nom : ${characterConfig.name || 'non défini'}
- Rôle : ${characterConfig.role}
- Âge : ${characterConfig.age || 'non défini'}
- Traits : ${characterConfig.traits || 'non définis'}
- Background : ${characterConfig.background || 'non défini'}

3) CHAPITRES :
- Nombre : ${chapterConfig.count}
- Plan : ${chapterConfig.plan || 'libre'}
- Résumé : ${chapterConfig.summary || 'non défini'}

Génère une histoire complète, avec personnages et structure de chapitres.
`;

    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          maxTokens: 2500,
          temperature: 0.8,
          systemMessage:
            'Tu es un écrivain professionnel, créatif et structuré. Tu génères une histoire complète avec personnages et chapitres.',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur inconnue');
      setResult(data.result || 'Aucun résultat');
    } catch (error: any) {
      setResult(`Erreur : ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Envoi à n8n
  async function sendToN8n() {
    if (!result) {
      alert('Aucun texte à envoyer.');
      return;
    }

    try {
      const res = await fetch('https://n8n.ton-domaine.com/webhook/story-ncp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now(),
          title: storyConfig.prompt.slice(0, 50) + '...',
          content: result,
          metadata: { ...storyConfig, ...characterConfig, ...chapterConfig },
        }),
      });
      if (!res.ok) throw new Error('Erreur n8n');
      alert('Envoyé à n8n avec succès !');
    } catch (error: any) {
      alert('Erreur lors de l’envoi à n8n : ' + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">
                Générateur Unifié
              </h1>
              <p className="text-gray-600 mt-2">
                Histoire + Personnages + Chapitres → en une seule page
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
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="story">📖 Histoire</TabsTrigger>
            <TabsTrigger value="character">👤 Personnage</TabsTrigger>
            <TabsTrigger value="chapter">📚 Chapitre</TabsTrigger>
          </TabsList>

          {/* Onglet Histoire */}
          <TabsContent value="story">
            <Card>
              <CardHeader>
                <CardTitle>Configuration de l’histoire</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  value={storyConfig.genre}
                  onValueChange={(v) => setStoryConfig({ ...storyConfig, genre: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
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

                <Select
                  value={storyConfig.tone}
                  onValueChange={(v) => setStoryConfig({ ...storyConfig, tone: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Ton" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
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

                <Select
                  value={storyConfig.style}
                  onValueChange={(v) => setStoryConfig({ ...storyConfig, style: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Style d'écriture" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
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

                <Select
                  value={storyConfig.length}
                  onValueChange={(v) => setStoryConfig({ ...storyConfig, length: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Longueur" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="short">Courte (500-800 mots)</SelectItem>
                    <SelectItem value="medium">Moyenne (1000-1500 mots)</SelectItem>
                    <SelectItem value="long">Longue (2000-3000 mots)</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={storyConfig.target_audience}
                  onValueChange={(v) => setStoryConfig({ ...storyConfig, target_audience: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Public cible" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="children">Enfants (8-12 ans)</SelectItem>
                    <SelectItem value="young_adult">Jeunes adultes (13-17 ans)</SelectItem>
                    <SelectItem value="adult">Adultes (18+ ans)</SelectItem>
                    <SelectItem value="all_ages">Tous âges</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={storyConfig.perspective}
                  onValueChange={(v) => setStoryConfig({ ...storyConfig, perspective: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Perspective narrative" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="first_person">Première personne (Je)</SelectItem>
                    <SelectItem value="third_person">Troisième personne (Il/Elle)</SelectItem>
                    <SelectItem value="omniscient">Narrateur omniscient</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={storyConfig.conflict_type}
                  onValueChange={(v) => setStoryConfig({ ...storyConfig, conflict_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Type de conflit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="internal">Conflit interne</SelectItem>
                    <SelectItem value="external">Conflit externe</SelectItem>
                    <SelectItem value="both">Les deux</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={storyConfig.theme}
                  onChange={(e) => setStoryConfig({ ...storyConfig, theme: e.target.value })}
                  placeholder="Thème principal (optionnel)"
                />
              </CardContent>
            </Card>

            <Textarea
              value={storyConfig.prompt}
              onChange={(e) => setStoryConfig({ ...storyConfig, prompt: e.target.value })}
              placeholder="Décrivez votre idée d’histoire..."
              className="min-h-24 mt-4"
            />
          </TabsContent>

          {/* Onglet Personnage */}
          <TabsContent value="character">
            <Card>
              <CardHeader>
                <CardTitle>Configuration du personnage</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={characterConfig.name}
                  onChange={(e) => setCharacterConfig({ ...characterConfig, name: e.target.value })}
                  placeholder="Nom du personnage"
                />
                <Select
                  value={characterConfig.role}
                  onValueChange={(v) => setCharacterConfig({ ...characterConfig, role: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucun</SelectItem>
                    <SelectItem value="protagoniste">Protagoniste</SelectItem>
                    <SelectItem value="antagoniste">Antagoniste</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                    <SelectItem value="allié">Allié</SelectItem>
                    <SelectItem value="secondaire">Secondaire</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={characterConfig.age}
                  onChange={(e) => setCharacterConfig({ ...characterConfig, age: e.target.value })}
                  placeholder="Âge"
                />
                <Input
                  value={characterConfig.traits}
                  onChange={(e) => setCharacterConfig({ ...characterConfig, traits: e.target.value })}
                  placeholder="Traits de caractère"
                />
                <Textarea
                  value={characterConfig.background}
                  onChange={(e) =>
                    setCharacterConfig({ ...characterConfig, background: e.target.value })
                  }
                  placeholder="Background / historique"
                  className="col-span-2 min-h-20"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Chapitre */}
          <TabsContent value="chapter">
            <Card>
              <CardHeader>
                <CardTitle>Structure des chapitres</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  value={chapterConfig.count}
                  onValueChange={(v) => setChapterConfig({ ...chapterConfig, count: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Nombre de chapitres" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="7">7</SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  value={chapterConfig.plan}
                  onChange={(e) => setChapterConfig({ ...chapterConfig, plan: e.target.value })}
                  placeholder="Plan global (début, milieu, fin)"
                  className="col-span-2 min-h-20"
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={generateAll}
            disabled={!storyConfig.prompt || loading || !openRouterStatus}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Génération en cours...' : 'Générer tout'}
          </Button>
          <Button onClick={sendToN8n} variant="outline">
            Envoyer à n8n
          </Button>
        </div>

        {/* Résultat */}
        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Résultat généré</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {result}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
