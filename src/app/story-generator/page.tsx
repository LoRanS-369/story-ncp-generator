'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/* ---------- Helpers ---------- */
const SelectField = ({ label, value, onChange, children }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger><SelectValue /></SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  </div>
);

const TextWithSuggestion = ({ label, value, onChange, placeholder }: any) => {
  const [loading, setLoading] = useState(false);
  const suggest = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Propose une courte suggestion créative pour : ${label} (en français)`,
          maxTokens: 50,
        }),
      });
      const data = await res.json();
      onChange(data.result?.trim() || '');
    } catch {
      alert('Erreur suggestion');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-1">
      <label className="block text-sm font-medium">{label}</label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="min-h-20" />
      <Button onClick={suggest} size="sm" variant="outline" disabled={loading}>
        💡 {loading ? '…' : 'Suggérer'}
      </Button>
    </div>
  );
};

export default function UltimateGenerator() {
  const [tab, setTab] = useState('story');

  /* ---------- STORY ---------- */
  const [story, setStory] = useState({
    prompt: '',
    title: '',
    duration: 'none',
    chapters: 'none',
    tomes: 'none',
    genre: [],
    love: [],
    event: [],
    eventType: [],
    animals: [],
    animalRole: [],
    creativity: 'none',
    audience: 'none',
    ageRange: 'none',
    diversity: [],
    perspective: [],
    style: [],
    tone: [],
    chronology: 'none',
    forbiddenWords: '',
    creativityLevel: 'none',
    authorStyle: '',
    avoidRepetition: false,
    narration: [],
    ending: [],
    cliffhanger: [],
    tensionLevel: 'none',
    allowDeath: [],
    allowSex: [],
    opening: [],
    location: [],
    globalArc: [],
    arcType: [],
    timeline: '',
  });

  /* ---------- CHARACTER ---------- */
  const [character, setCharacter] = useState<any>({
    name: '',
    nickname: '',
    age: '',
    gender: 'none',
    appearance: '',
    personality: '',
    backstory: '',
    motivation: '',
    conflict: '',
    relationships: '',
    profession: '',
    skills: '',
    fatalFlaw: '',
    desire: '',
    fear: '',
  });

  /* ---------- CHAPTER ---------- */
  const [chapters, setChapters] = useState({
    count: '1',
    structure: 'none',
    pacing: 'none',
    midpoint: '',
    climax: '',
    resolution: '',
    cliffhangers: false,
    flashbacks: false,
    multiTimeline: false,
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [openRouterStatus, setOpenRouterStatus] = useState(false);

  useState(() => {
    fetch('/api/openrouter?action=test')
      .then((r) => r.json())
      .then((data) => setOpenRouterStatus(data.configured));
  });

  /* ---------- Génération ---------- */
  async function generateStory() {
    if (!story.prompt) return alert('Entrez une idée');
    setLoading(true);
    const payload = { story, character, chapters };
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Génère une histoire complète en français avec ce schéma NCP : ${JSON.stringify(payload, null, 2)}`,
          maxTokens: 3500,
        }),
      });
      const data = await res.json();
      setResult(data.result || '');
    } catch (e: any) {
      setResult(`Erreur : ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Analyse narrative ---------- */
  async function analyseNarrative() {
    if (!result) return alert('Aucun texte');
    setLoading(true);
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyse narrative du texte suivant :\n${result}\n\nIdentifie les conflits, arcs, cliffhangers et propose 3 alternatives de résolution.`,
          maxTokens: 1000,
        }),
      });
      const data = await res.json();
      setResult(data.result || '');
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Répétitions ---------- */
  async function corrigerRepetitions() {
    if (!result) return alert('Aucun texte');
    setLoading(true);
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Corrige les répétitions dans ce texte et propose 3 reformulations alternatives :\n${result}`,
          maxTokens: 1000,
        }),
      });
      const data = await res.json();
      setResult(data.result || '');
    } finally {
      setLoading(false);
    }
  }

  /* ---------- Envoi à n8n ---------- */
  async function sendToN8n() {
    if (!result) return alert('Aucun texte');
    const ncp = {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: story.title || story.prompt.slice(0, 50),
      text: result,
      metadata: { story, character, chapters },
    };
    try {
      await fetch('https://n8n.ton-domaine.com/webhook/ncp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ncp),
      });
      alert('Envoyé à n8n !');
    } catch {
      alert('Erreur envoi n8n');
    }
  }

  /* ---------- Options du PDF ---------- */
  const genres = ["Education", "Original", "Classique", "Humour", "Science-fiction", "Space opera", "Extra-terrestre", "Dystopie", "Uchronie", "Steampunk", "Action", "Thriller", "Horreur", "Réaliste", "Biographie", "Fiction", "Non-fiction", "Drame", "Mystère", "Voyage dans le temps", "Bataille", "Comédie", "Kawaii", "Magie", "Mecha Battle", "Fantasy", "Aventure", "Vengeance", "Samouraï", "Ninja", "Kpop", "Suspense", "Guérison", "Émotion", "Superpouvoirs", "Crime", "Vie quotidienne", "Compétition", "Historique", "Épique", "Guerre", "Sports"];
  const perspectives = ["Première personne", "Deuxième personne", "Troisième personne", "Omniscient", "Flux de conscience", "Épistolaire", "Perspective multiples", "Interactif", "Observateur", "Œil de caméra", "Narrateur peu fiable"];
  const locations = ["Ville moderne", "Quartier historique", "Banlieue", "Centre commercial", "Ghetto urbain", "Ferme", "Village", "Forêt", "Montagnes", "Lacs", "Plage tropicale", "Port", "Île déserte", "Station balnéaire", "Royaume magique", "Univers parallèle", "Post-apo", "Espace", "Monde sous-marin", "Égypte antique", "Moyen Âge", "Cyberpunk", "Laboratoire", "Train", "Navire", "Station spatiale", "Casino", "Stade"];

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-600">Générateur Ultime NCP</h1>
          <p className="text-gray-600 mt-2">Toutes les options du PDF + IA + NCP</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="story">📖 Histoire</TabsTrigger>
            <TabsTrigger value="character">👤 Personnage</TabsTrigger>
            <TabsTrigger value="chapter">📚 Chapitres</TabsTrigger>
          </TabsList>

          <TabsContent value="story">
            <Card>
              <CardHeader><CardTitle>Configuration globale</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextWithSuggestion label="Titre du livre" value={story.title} onChange={(v: string) => setStory({ ...story, title: v })} placeholder="Titre" />
                <SelectField label="Durée" value={story.duration} onChange={(v: string) => setStory({ ...story, duration: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="court">Court (10-1000)</SelectItem>
                  <SelectItem value="medium">Moyen (1001-2500)</SelectItem>
                  <SelectItem value="long">Long (2501-5000)</SelectItem>
                  <SelectItem value="very-long">Très long (5001-10000)</SelectItem>
                </SelectField>
                <SelectField label="Nombre de chapitres" value={story.chapters} onChange={(v: string) => setStory({ ...story, chapters: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectField>
                <SelectField label="Nombre de tomes" value={story.tomes} onChange={(v: string) => setStory({ ...story, tomes: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectField>
                <TextWithSuggestion label="Lieux" value={story.location.join(', ')} onChange={(v: string) => setStory({ ...story, location: v.split(',').map(x => x.trim()) })} placeholder="Lieux (séparés par virgule)" />
                <Input value={story.forbiddenWords} onChange={(e) => setStory({ ...story, forbiddenWords: e.target.value })} placeholder="Mots interdits" />
                <Input value={story.authorStyle} onChange={(e) => setStory({ ...story, authorStyle: e.target.value })} placeholder="Imiter un auteur" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="character">
            <Card>
              <CardHeader><CardTitle>Fiche personnage</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextWithSuggestion label="Nom complet" value={character.name} onChange={(v: string) => setCharacter({ ...character, name: v })} placeholder="Nom" />
                <TextWithSuggestion label="Surnoms" value={character.nickname} onChange={(v: string) => setCharacter({ ...character, nickname: v })} placeholder="Surnoms" />
                <Input value={character.age} onChange={(e) => setCharacter({ ...character, age: e.target.value })} placeholder="Âge" />
                <SelectField label="Genre" value={character.gender} onChange={(v: string) => setCharacter({ ...character, gender: v })}>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="masculin">Masculin</SelectItem>
                  <SelectItem value="feminin">Féminin</SelectItem>
                  <SelectItem value="non-binaire">Non-binaire</SelectItem>
                </SelectField>
                <TextWithSuggestion label="Apparence" value={character.appearance} onChange={(v: string) => setCharacter({ ...character, appearance: v })} placeholder="Apparence physique" />
                <TextWithSuggestion label="Personnalité" value={character.personality} onChange={(v: string) => setCharacter({ ...character, personality: v })} placeholder="Traits de personnalité" />
                <TextWithSuggestion label="Background" value={character.backstory} onChange={(v: string) => setCharacter({ ...character, backstory: v })} placeholder="Historique" />
                <TextWithSuggestion label="Motivation" value={character.motivation} onChange={(v: string) => setCharacter({ ...character, motivation: v })} placeholder="Motivation" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chapter">
            <Card>
              <CardHeader><CardTitle>Planification des chapitres</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField label="Nombre de chapitres" value={chapters.count} onChange={(v: string) => setChapters({ ...chapters, count: v })}>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                </SelectField>
                <TextWithSuggestion label="Twist du milieu" value={chapters.midpoint} onChange={(v: string) => setChapters({ ...chapters, midpoint: v })} placeholder="Twist central" />
                <TextWithSuggestion label="Climax" value={chapters.climax} onChange={(v: string) => setChapters({ ...chapters, climax: v })} placeholder="Climax" />
                <TextWithSuggestion label="Résolution" value={chapters.resolution} onChange={(v: string) => setChapters({ ...chapters, resolution: v })} placeholder="Résolution finale" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button onClick={generateStory} disabled={loading || !openRouterStatus}>Générer</Button>
          <Button onClick={analyseNarrative} disabled={loading}>📊 Analyser</Button>
          <Button onClick={corrigerRepetitions} disabled={loading}>✏️ Corriger répétitions</Button>
          <Button onClick={sendToN8n} disabled={!result}>📤 Envoyer à n8n</Button>
        </div>

        {result && (
          <Card className="mt-6">
            <CardHeader><CardTitle>Résultat</CardTitle></CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
