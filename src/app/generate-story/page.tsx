'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function GenerateStory() {
  const [config, setConfig] = useState({
    prompt: '',
    genre: 'fantasy',
    tone: 'neutre',
    style: 'descriptif',
    length: 'medium',
    target_audience: 'adult',
    perspective: 'third_person',
    theme: ''
  });

  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!config.prompt) return;
    setLoading(true);
    
    try {
      const fullPrompt = `Ecris une histoire ${config.genre} avec un ton ${config.tone} et un style ${config.style}.

Idee: ${config.prompt}

Parametres:
- Longueur: ${config.length}
- Public: ${config.target_audience}  
- Perspective: ${config.perspective}
- Theme: ${config.theme || 'libre'}

Cree une histoire complete et engageante.`;

      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          maxTokens: 2000,
          temperature: 0.8
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        setResult(data.result || 'Histoire generee!');
      } else {
        setResult('Erreur de generation');
      }
    } catch (error) {
      setResult('Erreur: ' + error);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600">Generateur d Histoires Complet</h1>
              <p className="text-gray-600 mt-2">Creez des histoires avec de nombreuses options</p>
            </div>
            <Link href="/">
              <Button variant="outline">Retour Accueil</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Configuration */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* Genre */}
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
                    </SelectContent>
                  </Select>
                </div>

                {/* Ton */}
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
                      <SelectItem value="mystérieux">Mysterieux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Style */}
                <div>
                  <label className="block text-sm font-medium mb-2">Style</label>
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
                    </SelectContent>
                  </Select>
                </div>

                {/* Longueur */}
                <div>
                  <label className="block text-sm font-medium mb-2">Longueur</label>
                  <Select value={config.length} onValueChange={(value) => setConfig({...config, length: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="short">Courte (500 mots)</SelectItem>
                      <SelectItem value="medium">Moyenne (1000 mots)</SelectItem>
                      <SelectItem value="long">Longue (2000 mots)</SelectItem>
                      <SelectItem value="very_long">Tres longue (3000+ mots)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Public cible */}
                <div>
                  <label className="block text-sm font-medium mb-2">Public cible</label>
                  <Select value={config.target_audience} onValueChange={(value) => setConfig({...config, target_audience: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="children">Enfants</SelectItem>
                      <SelectItem value="young_adult">Jeunes adultes</SelectItem>
                      <SelectItem value="adult">Adultes</SelectItem>
                      <SelectItem value="all_ages">Tous ages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Perspective */}
                <div>
                  <label className="block text-sm font-medium mb-2">Perspective</label>
                  <Select value={config.perspective} onValueChange={(value) => setConfig({...config, perspective: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      <SelectItem value="first_person">Premiere personne</SelectItem>
                      <SelectItem value="third_person">Troisieme personne</SelectItem>
                      <SelectItem value="omniscient">Omniscient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium mb-2">Theme (optionnel)</label>
                  <Input
                    value={config.theme}
                    onChange={(e) => setConfig({...config, theme: e.target.value})}
                    placeholder="Ex: amitie, courage, redemption..."
                  />
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Zone principale */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Prompt */}
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
                    disabled={!config.prompt || loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generation...
                      </>
                    ) : (
                      'Generer l Histoire'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Resultat */}
            <Card>
              <CardHeader>
                <CardTitle>Histoire Generee</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div>
                    <div className="p-4 bg-gray-50 rounded-lg max-h-96 overflow-y-auto mb-4">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">{result}</pre>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => navigator.clipboard.writeText(result)}
                        variant="outline"
                      >
                        Copier
                      </Button>
                      <Button 
                        onClick={() =>
