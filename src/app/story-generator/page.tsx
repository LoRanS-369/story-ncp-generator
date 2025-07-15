'use client';

import { useState } from 'react';

export default function StoryGenerator() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');

  return (
    <div>
      <h1>Generateur d Histoires</h1>
      <p>Decrivez votre idee:</p>
      <textarea 
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        cols={50}
      />
      <br />
      <button onClick={() => setResult('Histoire pour: ' + prompt)}>
        Generer
      </button>
      {result && <div><h3>Resultat:</h3><p>{result}</p></div>}
      <br />
      <a href="/">Retour</a>
    </div>
  );
}
