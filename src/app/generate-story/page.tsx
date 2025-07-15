'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function GenerateStory() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt) return;
    setLoading(true);
    
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: 'Ecris une histoire basee sur: ' + prompt,
          maxTokens: 1000
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Generateur d Histoires</h1>
        <Link href="/">
          <Button variant="outline">Retour Accueil</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Votre Idee</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Decrivez votre idee d histoire..."
              className="mb-4"
            />
            <Button 
              onClick={generate} 
              disabled={!prompt || loading}
              className="w-full"
            >
              {loading ? 'Generation...' : 'Generer'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-32 p-4 bg-gray-50 rounded">
              {result || 'Votre histoire apparaitra ici...'}
            </div>
            {result && (
              <Button 
                onClick={() => navigator.clipboard.writeText(result)}
                variant="outline" 
                className="mt-4"
              >
                Copier
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
