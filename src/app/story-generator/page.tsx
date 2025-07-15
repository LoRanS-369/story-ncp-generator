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

export default function UltimateNCPGenerator() {
  const [tab, setTab] = useState('story');

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
  const genres = ["Éducation","Original","Classique","Humour","Science-fiction","Fantasy","Aventure","Drame","Mystère","Comédie","Romance","Horreur","Action","Historique","Épique","Crime","Vie quotidienne","Compétition"];
  const loveOptions = ["Romance légère","Romance intense","Amour impossible","Triangle amoureux","Amour interdit","Amour toxique","Amour virtuel","Amour polyamoureux"];
  const events = ["Sauver le monde","Triangle amoureux","Trahison","Secret de famille","Développement du personnage","Croissance dans l'adversité","Révolution technologique"];
  const creativityLevels = ["Conservateur","Équilibré","Inventif","Expérimental","Traditionnel","Innovant","Classique","Moderne","Avant-Gardiste","Éclectique"];
  const tones = ["Sérieux","Humoristique","Ironique","Sarcastique","Mélancolique","Optimiste","Pessimiste","Neutre","Passionné","Réfléchi"];
  const styles = ["Réaliste","Poétique","Journalistique","Épistolaire","Stream of Consciousness","Minimaliste","Descriptif","Dialogué","Lyrical","Satirique"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-blue-600">Générateur Ultime NCP</h1>
          <p className="text-gray-600 mt-2">Toutes les options PDF intégrées + IA</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="story">📖 Histoire</TabsTrigger>
            <TabsTrigger value="advanced">📋 Paramètres</TabsTrigger>
            <TabsTrigger value="character">👤 Personnage</TabsTrigger>
            <TabsTrigger value="chapter">📚 Chapitres</TabsTrigger>
            <TabsTrigger value="links">🔗 Liens & intrigues</TabsTrigger>
            <TabsTrigger value="locations">📍 Lieux</TabsTrigger>
            <TabsTrigger value="themes">📚 Thèmes</TabsTrigger>
            <TabsTrigger value="custom">⚙️ IA & Style</TabsTrigger>
          </TabsList>

          {/* ONGLET HISTOIRE */}
          <TabsContent value="story">
            <Card>
              <CardHeader><CardTitle>Idée de base</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Textarea value={story.prompt} onChange={(e) => setStory({ ...story, prompt: e.target.value })} placeholder="Pitch ou idée de base" className="min-h-20" />
                <Input value={story.title} onChange={(e) => setStory({ ...story, title: e.target.value })} placeholder="Titre du livre" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONGLET PARAMÈTRES */}
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

          {/* ONGLET CHAPITRES */}
          <TabsContent value="chapter">
            <Card>
              <CardHeader><CardTitle>Chapitres</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectMulti label="Nombre de chapitres" value={[chapters.count]} onChange={(v) => setChapters({ ...chapters, count: v[0] })} options={["1","3","5","7","10"]} />
                <SelectMulti label="Structure" value={[chapters.structure]} onChange={(v) => setChapters({ ...chapters, structure: v[0] })} options={["Acte 3","Hero’s Journey","Freytag","Save the Cat!"]} />
                <Textarea value={chapters.midpoint} onChange={(e) => setChapters({ ...chapters, midpoint: e.target.value })} placeholder="Twist central" className="min-h-20" />
                <Textarea value={chapters.climax} onChange={(e) => setChapters({ ...chapters, climax: e.target.value })} placeholder="Climax" className="min-h-20" />
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
