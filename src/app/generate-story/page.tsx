'use client';

import { useState, useEffect } from 'react'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function GenerateStory() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [openRouterStatus, setOpenRouterStatus] = useState({
    configured: false,
    testing: false
  });

  useEffect(() => {
    checkOpenRouterStatus();
  }, []);

  const checkOpenRouterStatus = async () => {
    try {
      const response = await fetch('/api/openrouter?action=status');
      const data = await response.json();
      setOpenRouterStatus(prev => ({ 
        ...prev, 
        configured: data.configured 
      }));
    } catch (error) {
      console.error('Erreur vérification OpenRouter:', error);
    }
  };

  const generateStory = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setResult(null);

    try {
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Génère une histoire créative basée sur cette idée : ${prompt}

Crée une histoire complète avec :
- Un début engageant
- Des personnages intéressants  
- Une intrigue captivante
- Une fin satisfaisante

Style : narratif et immersif.`,
          maxTokens: 2000,
          temperature: 0.8,
          systemMessage: "Tu es un écrivain professionnel spécialisé dans la création d'histoires captivantes."
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setResult(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-sm border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                📚 Générateur d&apos;Histoires
              </h1>
              <p className="text-gray-600 mt-2">
                Créez des histoires uniques avec l&apos;aide de l&apos;intelligence artificielle
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant="outline" 
                className={openRouterStatus.configured 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-red-50 text-red-700 border-red-200'
                }
              >
                🚀 OpenRouter {openRouterStatus.configured ? '✅' : '❌'}
              </Badge>
              <Link href="/">
                <Button variant="outline" size="sm">
                  🏠 Accueil
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ✨ Votre Idée d&apos;Histoire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Décrivez votre idée d'histoire...
