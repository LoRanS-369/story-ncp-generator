'use client';

import { useState } from 'react';

export default function GenerateStory() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Generateur d Histoires</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Votre idee:</label>
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', height: '100px', margin: '10px 0' }}
          placeholder="Decrivez votre idee..."
        />
      </div>

      <button 
        onClick={() => setResult('Histoire generee pour: ' + prompt)}
        style={{ padding: '10px 20px', backgroundColor: '#blue', color: 'white' }}
      >
        Generer
      </button>

      {result && (
        <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#f5f5f5' }}>
          <h3>Resultat:</h3>
          <p>{result}</p>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <a href="/">Retour accueil</a>
      </div>
    </div>
  );
}
