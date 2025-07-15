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

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMulti = (setter: any, key: string) => (v: string) =>
    setter((prev: any) => ({ ...prev, [key]: v.split(',').filter(Boolean) }));

  const generateAll = async () => {
    if (!story.prompt) return alert('Entrez une idée');
    setLoading(true);
    const payload = { story };
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

  const genres = ["Éducation","Original","Classique","Humour","Science-fiction","Fantasy","Aventure","Drame","Mystère","Comédie","Romance","Horreur","Action","Historique","Épique","Crime","Vie quotidienne","Compétition"];
  const loveOptions = ["Romance légère","Romance intense","Amour impossible","Triangle amoureux","Amour interdit","Amour toxique","Amour virtuel","Amour polyamoureux"];
  const events = ["Sauver le monde","Triangle amoureux","Trahison","Secret de famille","Développement du personnage","Croissance dans l'adversité","Révolution technologique"];

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
            <TabsTrigger value="advanced">📋 Paramètres</TabsTrigger>
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
                  ✅ Respect du NCP (Narrative Context Protocol)
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={story.seo} onChange={(e) => setStory({ ...story, seo: e.target.checked })} />
                  🔍 Optimiser SEO (article blog)
                </label>

                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={story.splitAudio} onChange={(e) => setStory({ ...story, splitAudio: e.target.checked })} />
                  🔊 Séparer audio pour plusieurs voix
                </label>
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
