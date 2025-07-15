'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/* ---------- Helper ---------- */
const SelectMulti = ({ label, value, onChange, options }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Select
      value={Array.isArray(value) ? value.join(',') : value}
      onValueChange={(v) => onChange(v.split(',').filter(Boolean))}
    >
      <SelectTrigger>
        <SelectValue placeholder={`Sélectionner ${label.toLowerCase()}`} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o: string) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
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
        body: JSON.stringify({ prompt: `Suggère une idée créative pour : ${label}` }),
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

export default function UltimateNCPGenerator() {
  const [tab, setTab] = useState('story');

  /* ---------- ÉTAT GLOBAL ---------- */
  const [story, setStory] = useState({
    prompt: '',
    title: '',
    genre: [] as string[],
    love: [] as string[],
    event: [] as string[],
    supportType: '',
    commercialGoal: '',
    respectNCP: false,
    seo: false,
    splitAudio: false,
  });

  const [character, setCharacter] = useState({
    name: '',
    age: '',
    appearance: '',
    personality: '',
    backstory: '',
    motivation: '',
    skills: '',
    fatalFlaw: '',
    desire: '',
    fear: '',
  });

  const [chapters, setChapters] = useState({
    count: '1',
    structure: '',
    pacing: '',
    midpoint: '',
    climax: '',
    resolution: '',
    cliffhangers: false,
    flashbacks: false,
    multiTimeline: false,
  });

  const [links, setLinks] = useState({
    loyaltyConflict: false,
    redemptionQuest: false,
    betrayal: false,
    familySecret: false,
    forbiddenLove: false,
    powerCorruption: false,
    survival: false,
    rivalry: false,
    truthQuest: false,
  });

  const [locations, setLocations] = useState({
    urban: [] as string[],
    rural: [] as string[],
    coastal: [] as string[],
    fantasy: [] as string[],
    historical: [] as string[],
    futuristic: [] as string[],
  });

  const [themes, setThemes] = useState({
    general: [] as string[],
    sport: [] as string[],
    erotic: [] as string[],
    professional: [] as string[],
  });

  const [customization, setCustomization] = useState({
    creativityLevel: '',
    style: [] as string[],
    tone: [] as string[],
    death: [] as string[],
    sex: [] as string[],
    opening: [] as string[],
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  /* ---------- UTILS ---------- */
  const handleMulti = (setter: any, key: string) => (v: string) =>
    setter((prev: any) => ({ ...prev, [key]: v.split(',').filter(Boolean) }));

  const generateAll = async () => {
    if (!story.prompt) return alert('Entrez une idée');
    setLoading(true);
    const payload = { story, character, chapters, links, locations, themes, customization };
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Génère une histoire NCP complète : ${JSON.stringify(payload, null, 2)}`, maxTokens: 3500 }),
      });
      const data = await res.json();
      setResult(data.result || '');
    } finally {
      setLoading(false);
    }
  };

  /* ---------- OPTIONS ---------- */
  const genres = ["Éducation","Original","Classique","Humour","Science-fiction","Space opera","Extra-terrestre","Dystopie","Uchronie","Steampunk","Action","Thriller","Horreur","Réaliste","Biographie","Fiction","Non-fiction","Drame","Mystère","Voyage dans le temps","Bataille","Comédie","Kawaii","Magie","Fantasy","Aventure","Vengeance","Samouraï","Ninja","Suspense","Guérison","Émotion","Superpouvoirs","Crime","Vie quotidienne","Compétition","Historique","Épique","Guerre","Sports"];
  const loveOptions = ["Intrigue","Romance légère","Romance intense","Romance complexe","Dark Romance","Boys' Love","Girls’ Love","Triangle amoureux","Amour impossible","Première amour","Érotique","Pornographique","Amour torride","Amour toxique","Amour tordu","Amour amical","Sex friend","Amour à distance","Amour virtuel","Amour multiple","Amour interdit","Amour perdu","Amour polyamoureux","Amour asexuel"];
  const events = ["Difficulté à l’école","Harcèlement","Sauver le monde","Sauver les autres","Rupture amicale","Triangle amoureux","Coup de foudre","Malentendu","Explorer l'inconnu","Éveil du héros","Amnésie","Mystère de l'identité","Travail d'équipe","Voyage dans le temps et l'espace","Bataille fatale","Trahison par la famille","Secret de famille","Événement mystérieux","Ascension du méchant","Civilisation perdue","Monde virtuel","Survie à l'apocalypse","Progression professionnelle","Croissance dans l'adversité","Chasser les rêves","Vie ordinaire","Ment","Enquête sur un événement","Meurtre","Amour perdu et réuni","Test familial","Amour sado-masochiste","Douceur","Développement du personnage","Amélioration des compétences","Retrait","Lutte pour le pouvoir","Guerre des gangs","Poursuite et évasion","Complot politique","Choc des civilisations","Mystère historique","Lutte commerciale","Adieu","Triste fin","Premier amour","Regret irréparable","Gestion d'entreprise","Croissance difficile","Côté obscur de l'industrie","Découverte scientifique","Catastrophe naturelle","Révolution technologique"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-600">Générateur Ultime NCP</h1>
          <p className="text-gray-600 mt-2">Crée ton histoire, personnages et intrigue en un seul outil</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="story">📖 Histoire</TabsTrigger>
            <TabsTrigger value="advanced">📋 Paramètres avancés</TabsTrigger>
            <TabsTrigger value="character">👤 Personnages</TabsTrigger>
            <TabsTrigger value="chapter">📚 Chapitres</TabsTrigger>
            <TabsTrigger value="links">🔗 Liens & intrigues</TabsTrigger>
            <TabsTrigger value="locations">📍 Lieux</TabsTrigger>
            <TabsTrigger value="themes">📚 Thèmes</TabsTrigger>
          </TabsList>

          {/* ONGLET HISTOIRE */}
          <TabsContent value="story">
            <Card>
              <CardHeader><CardTitle>Idée de base</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextWithSuggestion label="Titre du livre" value={story.title} onChange={(v) => setStory({ ...story, title: v })} placeholder="Titre" />
                <Textarea value={story.prompt} onChange={(e) => setStory({ ...story, prompt: e.target.value })} placeholder="Pitch ou idée de base" className="min-h-20" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONGLET AVANCÉ */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader><CardTitle>📋 Paramètres avancés</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectMulti label="Genre" value={story.genre} onChange={handleMulti(setStory, 'genre')} options={genres} />
                <SelectMulti label="Amours" value={story.love} onChange={handleMulti(setStory, 'love')} options={loveOptions} />
                <SelectMulti label="Événements" value={story.event} onChange={handleMulti(setStory, 'event')} options={events} />
                <SelectMulti label="Support final" value={[story.supportType]} onChange={(v) => setStory({ ...story, supportType: v[0] })} options={["Ebook","Livre audio","Podcast","Vidéo","Article de blog","Autre"]} />
                <SelectMulti label="Objectif commercial" value={[story.commercialGoal]} onChange={(v) => setStory({ ...story, commercialGoal: v[0] })} options={["Commercialisable","Création pure","Autre"]} />
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={story.respectNCP} onChange={(e) => setStory({ ...story, respectNCP: e.target.checked })} />
                  ✅ Respect du NCP
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={story.seo} onChange={(e) => setStory({ ...story, seo: e.target.checked })} />
                  🔍 Optimiser SEO
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={story.splitAudio} onChange={(e) => setStory({ ...story, splitAudio: e.target.checked })} />
                  🔊 Séparer audio
                </label>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONGLET PERSONNAGE */}
          <TabsContent value="character">
            <Card>
              <CardHeader><CardTitle>Fiche personnage</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input value={character.name} onChange={(e) => setCharacter({ ...character, name: e.target.value })} placeholder="Nom complet" />
                <Input value={character.age} onChange={(e) => setCharacter({ ...character, age: e.target.value })} placeholder="Âge" />
                <Textarea value={character.appearance} onChange={(e) => setCharacter({ ...character, appearance: e.target.value })} placeholder="Apparence physique" className="min-h-20" />
                <Textarea value={character.personality} onChange={(e) => setCharacter({ ...character, personality: e.target.value })} placeholder="Traits de personnalité" className="min-h-20" />
                <Textarea value={character.motivation} onChange={(e) => setCharacter({ ...character, motivation: e.target.value })} placeholder="Motivation profonde" className="min-h-20" />
                <Textarea value={character.skills} onChange={(e) => setCharacter({ ...character, skills: e.target.value })} placeholder="Compétences spécialisées" className="min-h-20" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ACTIONS GLOBALES */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button onClick={generateAll} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
              {loading ? 'Génération en cours...' : 'Générer l’histoire'}
            </Button>
          </div>

          {result && (
            <Card className="mt-6">
              <CardHeader><CardTitle>Résultat généré</CardTitle></CardHeader>
              <CardContent>
                <pre className="whitespace-pre-wrap text-sm">{result}</pre>
              </CardContent>
            </Card>
          )}
        </Tabs>
      </div>
    </div>
  );
}
