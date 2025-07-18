'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { TabsContent } from '@/components/ui/tabs';

type NCPData = {
  ncpVersion: string;
  creator: {
    name: string;
    intent: string;
  };
  story: {
    title: string;
    premise: string;
    themes: string[];
    characters: any[];
    plot: any;
  };
  text: string;
};

export default function NCPPanel({
  story,
  character,
  chapters,
  links,
  locations,
  themes,
  customization,
  generatedText,
  setGeneratedText,
}: any) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyses, setAnalyses] = useState({
    throughlines: '',
    emotion: '',
    themesActions: '',
    pacing: '',
    conflict: '',
    redundancies: '',
    worldConsistency: '',
    subplots: '',
    narrativeVoice: '',
    climax: '',
  });

  const buildNCP = () => ({
    ncpVersion: '1.0',
    creator: {
      name: 'Auteur',
      intent: story.prompt || 'Explorer un récit riche en émotions et en conflits.',
    },
    story: {
      title: story.title,
      premise: story.prompt,
      themes: themes.general,
      characters: [character],
      plot: {
        structure: chapters.structure,
        acts: chapters.acts,
        globalArcs: chapters.globalArc,
      },
    },
    text: generatedText,
  });

  const exportNCP = () => {
    const data = buildNCP();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${story.title || 'histoire'}.ncp.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importNCP = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string) as NCPData;
        setGeneratedText(data.text || '');
      } catch {
        alert('Fichier NCP invalide.');
      }
    };
    reader.readAsText(file);
  };

  const analyzeWithAI = async () => {
    setLoading(true);
    const prompt = `Analyse le texte suivant et propose 3 suggestions concrètes pour améliorer l'intrigue, les personnages ou les conflits :\n\n${generatedText}`;
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, maxTokens: 300 }),
      });
      const data = await res.json();
      setSuggestions(data.result?.split('\n').filter(Boolean) || []);
    } catch {
      alert('Erreur analyse IA.');
    } finally {
      setLoading(false);
    }
  };

  const analyzeDeep = async () => {
    setLoading(true);
    const prompt = `Analyse cette histoire avec les critères suivants : 
- Cohérence des 4 throughlines (Main Character, Impact Character, Relationship, Overall) 
- Progression émotionnelle du protagoniste 
- Cohérence des thèmes avec les actions 
- Pacing dramatique (pics et creux) 
- Dynamique de conflit (cause-effet) 
- Redondances ou incohérences 
- Cohérence des lieux et règles du monde 
- Sous-intrigues et liens 
- Voix narrative et ton 
- Climax et résolution 
Donne-moi un rapport clair et des suggestions concrètes.

Histoire: ${JSON.stringify({ story, character, chapters, links, locations, themes, generatedText })}`;
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, maxTokens: 1000 }),
      });
      const data = await res.json();
      // Assuming the response is a structured text, parse it simply for demo
      const parts = data.result?.split('\n\n') || [];
      setAnalyses({
        throughlines: parts[0] || '',
        emotion: parts[1] || '',
        themesActions: parts[2] || '',
        pacing: parts[3] || '',
        conflict: parts[4] || '',
        redundancies: parts[5] || '',
        worldConsistency: parts[6] || '',
        subplots: parts[7] || '',
        narrativeVoice: parts[8] || '',
        climax: parts[9] || '',
      });
    } catch {
      alert('Erreur analyse approfondie IA.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TabsContent value="ncp">
      <Card>
        <CardHeader>
          <CardTitle>🧠 Analyse & Perfectionnement (NCP)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={exportNCP}>📤 Exporter NCP</Button>
            <label>
              <input type="file" accept=".json" onChange={importNCP} className="hidden" />
              <Button as="span">📥 Importer NCP</Button>
            </label>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Rapport narratif</h3>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>✅ Structure : {chapters.structure || 'Non définie'}</li>
              <li>✅ Personnage principal : {character.name || 'Non défini'}</li>
              <li>✅ Thèmes : {themes.general.join(', ') || 'Aucun'}</li>
              <li>✅ Conflit principal : {character.conflict || 'Non défini'}</li>
              <li>✅ Throughlines : {analyses.throughlines}</li>
              <li>✅ Progression émotionnelle : {analyses.emotion}</li>
              <li>✅ Cohérence thèmes/actions : {analyses.themesActions}</li>
              <li>✅ Pacing : {analyses.pacing}</li>
              <li>✅ Dynamique de conflit : {analyses.conflict}</li>
              <li>✅ Redondances et incohérences : {analyses.redundancies}</li>
              <li>✅ Cohérence des lieux : {analyses.worldConsistency}</li>
              <li>✅ Sous-intrigues : {analyses.subplots}</li>
              <li>✅ Voix narrative : {analyses.narrativeVoice}</li>
              <li>✅ Climax et résolution : {analyses.climax}</li>
            </ul>
          </div>

          <Button onClick={analyzeWithAI} disabled={loading}>
            {loading ? 'Analyse en cours...' : '🔍 Analyser avec l’IA'}
          </Button>

          <Button onClick={analyzeDeep} disabled={loading}>
            {loading ? 'Analyse en cours...' : '🔍 Analyse Approfondie avec l’IA'}
          </Button>

          {suggestions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">💡 Suggestions IA :</h4>
              {suggestions.map((s, i) => (
                <Badge key={i} className="mr-2 mb-2 cursor-pointer" onClick={() => setGeneratedText(generatedText + '\n\n' + s)}>
                  {s}
                </Badge>
              ))}
            </div>
          )}

          <Textarea
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
            placeholder="Texte généré ou écrit ici..."
            className="min-h-96 text-sm"
          />
        </CardContent>
      </Card>
    </TabsContent>
  );
}

