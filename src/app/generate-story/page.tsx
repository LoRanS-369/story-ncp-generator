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
      console.error('Erreur verification OpenRouter:', error);
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
          prompt: 'Genere une histoire creative basee sur cette idee : ' + prompt + '. Cree une histoire complete avec un debut engageant, des personnages interessants, une intrigue captivante et une fin satisfaisante. Style narratif et immersif.',
          maxTokens: 2000,
          temperature: 0.8,
          systemMessage: "Tu es un ecrivain professionnel specialise dans la creation d'histoires captivantes."
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data.result);
