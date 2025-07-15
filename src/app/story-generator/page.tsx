'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function UnifiedGenerator() {
  const [tab, setTab] = useState('story');

  /* ---------- HISTOIRE ---------- */
  const [story, setStory] = useState({
    prompt: '',
    genre: 'none',
    tone: 'none',
    style: 'none',
    length: 'none',
    target_audience: 'none',
    perspective: 'none',
    conflict_type: 'none',
    theme: '',
    writing_style: 'none',
  });

  /* ---------- PERSONNAGES ---------- */
  const [character, setCharacter] = useState({
    name: '',
    role: 'none',
    archetype: 'none',
    age: '',
    gender: 'none',
    personality_traits: '',
    skills: '',
    flaws: '',
    backstory: '',
    motivation: '',
    conflict: '',
    appearance: '',
  });

  /* ---------- CHAPITRES ---------- */
  const [chapters, setChapters] = useState({
    count: '1',
    structure: 'none',
    pacing: 'none',
    plot_points: '',
    cliffhangers: false,
    flashbacks: false,
    multiple_timelines: false,
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [openRouterStatus, setOpenRouterStatus] = useState(false);

  useState(() => {
    fetch('/api/openrouter?action=test')
      .then((r) => r.json())
      .then((data) => setOpenRouterStatus(data.configured));
  });

  async function generateAll() {
    if (!story.prompt) {
      alert('Veuillez saisir une idée d’histoire.');
      return;
    }

    setLoading(true);
    setResult('');

    const fullPrompt = `
GÉNÉRATION UNIFIÉE

📖 HISTOIRE
Idee : ${story.prompt}
Genre : ${story.genre}
Ton : ${story.tone}
Style : ${story.style}
Longueur : ${story.length}
Public : ${story.target_audience}
Perspective : ${story.perspective}
Conflit : ${story.conflict_type}
Theme : ${story.theme}
Style ecriture : ${story.writing_style}

👤 PERSONNAGE
Nom : ${character.name}
Role : ${character.role}
Archetype : ${character.archetype}
Age : ${character.age}
Genre : ${character.gender}
Personnalite : ${character.personality_traits}
Competences : ${character.skills}
Defauts : ${character.flaws}
Background : ${character.backstory}
Motivation : ${character.motivation}
Conflit : ${character.conflict}
Apparence : ${character.appearance}

📚 CHAPITRES
Nombre : ${chapters.count}
Structure : ${chapters.structure}
Rythme : ${chapters.pacing}
Points clefs : ${chapters.plot_points}
Cliffhangers : ${chapters.cliffhangers}
Flashbacks : ${chapters.flashbacks}
Timelines multiples : ${chapters.multiple_timelines}

Génère une histoire complète, avec personnages et plan de chapitres.
`;

    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          maxTokens: 3000,
          temperature: 0.8,
          systemMessage: 'Tu es un écrivain professionnel, créatif et structuré.',
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

  async function sendToN8n() {
    if (!result) {
      alert('Aucun texte à envoyer.');
      return;
    }
    try {
      await fetch('https://n8n.ton-domaine.com/webhook/story-ncp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Date.now(),
          title: story.prompt.slice(0, 50) + '...',
          content: result,
          metadata: { story, character, chapters },
        }),
      });
      alert('Envoyé à n8n avec succès !');
    } catch {
      alert('Erreur lors de l’envoi à n8n.');
    }
  }

  /* ---------- Helper ---------- */
  const SelectField = ({ label, value, onChange, children }: any) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Générateur Unifié</h1>
              <p className="text-gray-600 mt-2">Histoire + Personnages + Chapitres sur une seule page</p>
            </div>
            <Badge
              variant="outline"
              className={openRouterStatus ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
            >
              OpenRouter {openRouterStatus ? 'OK' : 'KO'}
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="story">📖 Histoire</TabsTrigger>
            <TabsTrigger value="character">👤 Personnages</TabsTrigger>
            <TabsTrigger value="chapter">📚 Chapitres</TabsTrigger>
          </TabsList>

          {/* HISTOIRE */}
          <TabsContent value="story">
            <Card>
              <CardHeader>
                <CardTitle>Configuration de l’histoire</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="Genre" value={story.genre} onChange={(v: string) => setStory({ ...story, genre: v })}>
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
                </SelectField>

                <SelectField label="Ton" value={story.tone} onChange={(v: string) => setStory({ ...story, tone: v })}>
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
                </SelectField>

                <SelectField label="Style d’écriture" value={story.style} onChange={(v: string) => setStory({ ...story, style: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="descriptif">Descriptif</SelectItem>
                  <SelectItem value="dialogue-intensif">Dialogue intensif</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="introspectif">Introspectif</SelectItem>
                  <SelectItem value="poetique">Poétique</SelectItem>
                  <SelectItem value="minimaliste">Minimaliste</SelectItem>
                  <SelectItem value="classique">Classique</SelectItem>
                  <SelectItem value="moderne">Moderne</SelectItem>
                </SelectField>

                <SelectField label="Longueur" value={story.length} onChange={(v: string) => setStory({ ...story, length: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="short">Courte (500-800 mots)</SelectItem>
                  <SelectItem value="medium">Moyenne (1000-1500 mots)</SelectItem>
                  <SelectItem value="long">Longue (2000-3000 mots)</SelectItem>
                </SelectField>

                <SelectField label="Public cible" value={story.target_audience} onChange={(v: string) => setStory({ ...story, target_audience: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="children">Enfants (8-12 ans)</SelectItem>
                  <SelectItem value="young_adult">Jeunes adultes (13-17 ans)</SelectItem>
                  <SelectItem value="adult">Adultes (18+ ans)</SelectItem>
                  <SelectItem value="all_ages">Tous âges</SelectItem>
                </SelectField>

                <SelectField label="Perspective narrative" value={story.perspective} onChange={(v: string) => setStory({ ...story, perspective: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="first_person">Première personne (Je)</SelectItem>
                  <SelectItem value="third_person">Troisième personne (Il/Elle)</SelectItem>
                  <SelectItem value="omniscient">Narrateur omniscient</SelectItem>
                </SelectField>

                <SelectField label="Type de conflit" value={story.conflict_type} onChange={(v: string) => setStory({ ...story, conflict_type: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="internal">Conflit interne</SelectItem>
                  <SelectItem value="external">Conflit externe</SelectItem>
                  <SelectItem value="both">Les deux</SelectItem>
                </SelectField>

                <SelectField label="Style d’écriture" value={story.writing_style} onChange={(v: string) => setStory({ ...story, writing_style: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="narratif">Narratif</SelectItem>
                  <SelectItem value="descriptif">Descriptif</SelectItem>
                  <SelectItem value="dialogue">Dialogue intensif</SelectItem>
                  <SelectItem value="action">Action</SelectItem>
                  <SelectItem value="introspectif">Introspectif</SelectItem>
                </SelectField>

                <Input
                  value={story.theme}
                  onChange={(e) => setStory({ ...story, theme: e.target.value })}
                  placeholder="Thème principal"
                />
              </CardContent>
            </Card>

            <Textarea
              value={story.prompt}
              onChange={(e) => setStory({ ...story, prompt: e.target.value })}
              placeholder="Décrivez votre idée d’histoire..."
              className="mt-4 min-h-20"
            />
          </TabsContent>

          {/* PERSONNAGE */}
          <TabsContent value="character">
            <Card>
              <CardHeader>
                <CardTitle>Fiche personnage complète</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={character.name}
                  onChange={(e) => setCharacter({ ...character, name: e.target.value })}
                  placeholder="Nom"
                />
                <SelectField label="Rôle" value={character.role} onChange={(v: string) => setCharacter({ ...character, role: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="protagoniste">Protagoniste</SelectItem>
                  <SelectItem value="antagoniste">Antagoniste</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="allié">Allié</SelectItem>
                  <SelectItem value="secondaire">Secondaire</SelectItem>
                </SelectField>
                <SelectField label="Archetype" value={character.archetype} onChange={(v: string) => setCharacter({ ...character, archetype: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="heros">Héros</SelectItem>
                  <SelectItem value="antiheros">Anti-héros</SelectItem>
                  <SelectItem value="mentor">Mentor</SelectItem>
                  <SelectItem value="shadow">Ombre</SelectItem>
                  <SelectItem value="trickster">Trickster</SelectItem>
                  <SelectItem value="guardian">Gardien</SelectItem>
                </SelectField>
                <Input
                  value={character.age}
                  onChange={(e) => setCharacter({ ...character, age: e.target.value })}
                  placeholder="Âge"
                />
                <SelectField label="Genre" value={character.gender} onChange={(v: string) => setCharacter({ ...character, gender: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="masculin">Masculin</SelectItem>
                  <SelectItem value="feminin">Féminin</SelectItem>
                  <SelectItem value="non-binaire">Non-binaire</SelectItem>
                </SelectField>
                <Input
                  value={character.personality_traits}
                  onChange={(e) => setCharacter({ ...character, personality_traits: e.target.value })}
                  placeholder="Traits de personnalité"
                />
                <Input
                  value={character.skills}
                  onChange={(e) => setCharacter({ ...character, skills: e.target.value })}
                  placeholder="Compétences"
                />
                <Input
                  value={character.flaws}
                  onChange={(e) => setCharacter({ ...character, flaws: e.target.value })}
                  placeholder="Défauts"
                />
                <Textarea
                  value={character.backstory}
                  onChange={(e) => setCharacter({ ...character, backstory: e.target.value })}
                  placeholder="Background / historique"
                  className="col-span-2 min-h-20"
                />
                <Textarea
                  value={character.motivation}
                  onChange={(e) => setCharacter({ ...character, motivation: e.target.value })}
                  placeholder="Motivation"
                  className="col-span-2 min-h-20"
                />
                <Textarea
                  value={character.conflict}
                  onChange={(e) => setCharacter({ ...character, conflict: e.target.value })}
                  placeholder="Conflit interne/externe"
                  className="col-span-2 min-h-20"
                />
                <Textarea
                  value={character.appearance}
                  onChange={(e) => setCharacter({ ...character, appearance: e.target.value })}
                  placeholder="Apparence physique"
                  className="col-span-2 min-h-20"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* CHAPITRES */}
          <TabsContent value="chapter">
            <Card>
              <CardHeader>
                <CardTitle>Planification des chapitres</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="Nombre de chapitres" value={chapters.count} onChange={(v: string) => setChapters({ ...chapters, count: v })}>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectField>

                <SelectField label="Structure narrative" value={chapters.structure} onChange={(v: string) => setChapters({ ...chapters, structure: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="acte-3">Acte 3</SelectItem>
                  <SelectItem value="acte-5">Acte 5</SelectItem>
                  <SelectItem value="hero-journey">Hero’s Journey</SelectItem>
                  <SelectItem value="freytag">Freytag</SelectItem>
                </SelectField>

                <SelectField label="Rythme narratif" value={chapters.pacing} onChange={(v: string) => setChapters({ ...chapters, pacing: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="lent">Lent</SelectItem>
                  <SelectItem value="modere">Modéré</SelectItem>
                  <SelectItem value="rapide">Rapide</SelectItem>
                  <SelectItem value="variable">Variable</SelectItem>
                </SelectField>

                <Textarea
                  value={chapters.plot_points}
                  onChange={(e) => setChapters({ ...chapters, plot_points: e.target.value })}
                  placeholder="Points clés de l’intrigue"
                  className="col-span-2 min-h-20"
                />

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={chapters.cliffhangers}
                    onChange={(e) => setChapters({ ...chapters, cliffhangers: e.target.checked })}
                  />
                  Cliffhangers
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={chapters.flashbacks}
                    onChange={(e) => setChapters({ ...chapters, flashbacks: e.target.checked })}
                  />
                  Flashbacks
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={chapters.multiple_timelines}
                    onChange={(e) => setChapters({ ...chapters, multiple_timelines: e.target.checked })}
                  />
                  Timelines multiples
                </label>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={generateAll}
            disabled={!story.prompt || loading || !openRouterStatus}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? 'Génération en cours...' : 'Générer tout'}
          </Button>
          <Button onClick={sendToN8n} variant="outline">
            Envoyer à n8n
          </Button>
        </div>

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
