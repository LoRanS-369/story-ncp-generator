'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

/* ---------- Helper ---------- */
const SelectMulti = ({ label, value, onChange, options }: any) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <Select value={value.join(',')} onValueChange={(v) => onChange(v.split(',').filter(Boolean))}>
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
        body: JSON.stringify({ prompt: `Suggère une courte idée pour : ${label}`, maxTokens: 60 }),
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

  /* ---------- STRUCTURE ---------- */
  const [story, setStory] = useState({
    prompt: '',
    title: '',
    duration: '',
    chapters: '',
    tomes: '',
    genre: [] as string[],
    love: [] as string[],
    event: [] as string[],
    eventType: [] as string[],
    animals: [] as string[],
    animalRole: [] as string[],
    creativity: '',
    audience: '',
    ageRange: '',
    diversity: [] as string[],
    perspective: [] as string[],
    style: [] as string[],
    tone: [] as string[],
    chronology: '',
    forbiddenWords: '',
    creativityLevel: '',
    authorStyle: '',
    avoidRepetition: false,
    narration: [] as string[],
    ending: [] as string[],
    cliffhanger: [] as string[],
    tensionLevel: '',
    allowDeath: [] as string[],
    allowSex: [] as string[],
    opening: [] as string[],
    supportType: '',
    commercialGoal: '',
    splitAudio: false,
    seo: false,
  });

  const [character, setCharacter] = useState({
    name: '',
    nickname: '',
    age: '',
    gender: '',
    appearance: '',
    personality: '',
    backstory: '',
    motivation: '',
    conflict: '',
    relationships: '',
    profession: '',
    skills: '',
    fatalFlaw: '',
    desire: '',
    fear: '',
    contextBirth: '',
    education: '',
    childhood: '',
    family: '',
    trauma: '',
    shortGoals: '',
    longGoals: '',
    obstacles: '',
    dreams: '',
    secrets: '',
    internalConflict: '',
    externalConflict: '',
    stressSources: '',
    friends: '',
    enemies: '',
    mentors: '',
    growthArc: '',
    dialogueStyle: '',
    residence: '',
    culturalContext: '',
    economicStatus: '',
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
    globalArc: [] as string[],
    arcType: [] as string[],
    timelineStyle: '',
  });

  const [links, setLinks] = useState({
    loyaltyConflict: false,
    redemptionQuest: false,
    raceAgainstTime: false,
    betrayal: false,
    familySecret: false,
    forbiddenLove: false,
    powerCorruption: false,
    survival: false,
    rivalry: false,
    truthQuest: false,
    intrigueLevel: [] as string[],
    genealogy: '',
  });

  const [locations, setLocations] = useState({
    urban: [] as string[],
    rural: [] as string[],
    coastal: [] as string[],
    fantasy: [] as string[],
    historical: [] as string[],
    futuristic: [] as string[],
    mystical: [] as string[],
    industrial: [] as string[],
    transport: [] as string[],
    leisure: [] as string[],
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

  const suggest = async (label: string, setter: any) => {
    try {
      const res = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `Suggère une idée pour : ${label}`, maxTokens: 80 }),
      });
      const data = await res.json();
      setter(data.result?.trim() || '');
    } catch {
      alert('Erreur suggestion');
    }
  };

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
  const genres = ["Education","Original","Classique","Humour","Science-fiction","Space opera","Extra-terrestre","Dystopie","Uchronie","Steampunk","Action","Thriller","Horreur","Réaliste","Biographie","Fiction","Non-fiction","Drame","Mystère","Voyage dans le temps","Bataille","Comédie","Kawaii","Magie","Mecha Battle","Fantasy","Aventure","Vengeance","Samouraï","Ninja","Kpop","Suspense","Guérison","Émotion","Superpouvoirs","Crime","Vie quotidienne","Compétition","Historique","Épique","Guerre","Sports"];
  const loveOptions = ["Intrigue","Romance légère","Romance intense","Romance complexe","New romance","Dark Romance","SM Romance","BDSM Romance","Passion","Passion amoureuse","Rupture amoureuse","Echangisme","Boys' Love","Girls' Love","Triangle amoureux","Amour impossible","Première amour","Erotique","Pornographique","Amour torride","Amour toxique","Amour tordu","amour amical","sex friend","amour à distance","amour virtuel","amour multiple","amour interdit","amour perdu","Amour polyamoureux","Amour asexuel"];
  const events = ["Difficulté à l'école","Harcèlement","Sauver le monde","Sauver les autres","Rupture amicale","Triangle amoureux","Coup de foudre","Malentendu","Explorer l'inconnu","Éveil du héros","Amnésie","Mystère de l'identité","Travail d'équipe","Voyage dans le temps et l'espace","Bataille fatale","Trahison par la famille","Secret de famille","Événement mystérieux","Ascension du méchant","Civilisation perdue","Monde virtuel","Survie à l'apocalypse","Progression professionnelle","Croissance dans l'adversité","Chassez les rêves","Vie ordinaire","Ment","Enquête sur un événement","Meurtre","Amour perdu et réuni","Test familial","Amour sado-masochiste","Douceur","Développement du personnage","Amélioration des compétences","Retrait","Lutte pour le pouvoir","Guerre des gangs","Poursuite et évasion","Complot politique","Choc des civilisations","Mystère historique","Lutte commerciale","Adieu","Triste fin","Premier amour","Regret irréparable","Gestion d'entreprise","Croissance difficile","Côté obscur de l'industrie","Découverte scientifique","Catastrophe naturelle","Révolution technologique"];
  const creativityLevels = ["Conservateur","Équilibré","Inventif","Expérimental","Traditionnel","Innovant","Classique","Moderne","Avant-Gardiste","Éclectique"];
  const tones = ["Sérieux","Humoristique","Ironique","Sarcastique","Mélancolique","Optimiste","Pessimiste","Neutre","Passionné","Réfléchi"];
  const styles = ["Réaliste","Poétique","Journalistique","Épistolaire","Stream of Consciousness","Minimaliste","Descriptif","Dialogué","Lyrical","Satirique"];
  const locationsUrban = ["Ville Moderne","Quartier Historique","Banlieue Résidentielle","Centre Commercial","Ghetto Urbain"];
  const locationsRural = ["Ferme Agricole","Village de Campagne","Forêt et Nature","Montagnes et Collines","Lacs et Rivières"];
  const locationsCoastal = ["Plage Tropicale","Port de Pêche","Île Déserte","Station Balnéaire","Falaises et Grottes Marines"];
  const locationsFantasy = ["Royaume Magique","Univers Parallèle","Monde Post-Apocalyptique","Espace et Planètes Lointaines","Monde Sous-Marin"];
  const locationsHistorical = ["Égypte Antique","Moyen Âge Européen","Renaissance Italienne","Guerre Mondiale","Révolution Industrielle"];
  const locationsFuturistic = ["Ville Cyberpunk","Colonie Spatiale","Monde Post-Humain","Terre Dévastée","Utopie Technologique"];
  const locationsMystical = ["Temple Ancien","Forêt Enchantée","Monastère Isolé","Cimetière Hanté","Jardin Secret"];
  const locationsIndustrial = ["Usine Automobile","Laboratoire de Recherche","Centre de Données","Chantier de Construction","Mine Souterraine"];
  const locationsTransport = ["Train de Voyage","Navire de Croisière","Station Spatiale","Aéroport International","Route de Campagne"];
  const locationsLeisure = ["Parc d'Attractions","Stade Sportif","Casino","Festival de Musique","Centre de Loisirs"];
  const themesGeneral = ["Romans et Littérature","Romans d'amour","Science-fiction","Fantasy","Romans historiques","Thrillers psychologiques","Romans policiers","Littérature jeunesse","Romans de développement personnel","Romans d'aventure","Romans biographiques","Bandes Dessinées et Mangas","Shonen","Shojo","Seinen","Josei","Bandes dessinées franco-belges","Comics américains","Webtoons","Livres pour Enfants et Ados","Albums illustrés","Contes et fables","Livres éducatifs","Romans pour adolescents","Livres d'activités et de coloriage","Livres de développement personnel pour ados","Livres de science-fiction pour jeunes","Livres d'aventure pour enfants","Livres sur l'amitié et les relations","Livres de mystère pour jeunes détectives","Livres Scolaires et Éducatifs","Manuels de mathématiques","Livres de grammaire et de conjugaison","Cahiers d'exercices","Livres de préparation aux examens","Manuels de sciences","Livres d'histoire et de géographie","Livres de langues étrangères","Livres de philosophie","Livres de littérature","Livres de méthodologie et d'organisation","Santé et Bien-être","Loisirs et Culture","Développement Personnel et Professionnel","Technologie et Informatique","Gestion de Projet et Méthodologies Agiles","Marketing et Ventes","Finance et Comptabilité","Santé et Bien-être au Travail","Entrepreneuriat et Innovation","Droit et Réglementation","Langues et Communication","Éducation et Formation Continue","Littérature Pornoérotique"];
  const themesSport = ["Guides d'Entraînement","Stratégies de football","Techniques de tennis","Sports de plein air","Sports collectifs","Sports individuels","Sports adaptés","Sports extrêmes"];
  const themesErotic = ["Romans Érotiques Contemporains","Nouvelles érotiques","Érotique LGBTQ+","Guides érotiques","Fantasmes et fétichismes","Rencontres en ligne","Voyages érotiques"];
  const themesProfessional = ["Développement Personnel","Technologie","Gestion de projet","Marketing","Finance","Santé au travail","Entrepreneuriat","Droit","Langues","Éducation"];

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
            <TabsTrigger value="parametres">⚙️ Paramètres</TabsTrigger>
          </TabsList>

          {/* ONGLET HISTOIRE */}
          <TabsContent value="story">
            <Card>
              <CardHeader><CardTitle>Histoire de base</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextWithSuggestion label="Titre du livre" value={story.title} onChange={(v) => setStory({ ...story, title: v })} placeholder="Titre" />
                <SelectMulti label="Genre" value={story.genre} onChange={handleMulti(setStory, 'genre')} options={genres} />
                <SelectMulti label="Amours" value={story.love} onChange={handleMulti(setStory, 'love')} options={loveOptions} />
                <SelectMulti label="Événements" value={story.event} onChange={handleMulti(setStory, 'event')} options={events} />
                <SelectMulti label="Animaux" value={story.animals} onChange={handleMulti(setStory, 'animals')} options={["ferme","jungle","zoo","domestique","dinosaure","sauvage","légendaire","inventé","mythologique","fantastique","dragon","licorne","créatures marines","créatures volantes"]} />
                <SelectMulti label="Créativité" value={[story.creativity]} onChange={(v) => setStory({ ...story, creativity: v[0] })} options={creativityLevels} />
                <SelectMulti label="Public" value={[story.audience]} onChange={(v) => setStory({ ...story, audience: v[0] })} options={["Adulte","Adolescent","Enfant"]} />
                <SelectMulti label="Tranche d'âge" value={[story.ageRange]} onChange={(v) => setStory({ ...story, ageRange: v[0] })} options={["3-5 ans","6-8 ans","9-10 ans","11-13 ans","14-16 ans","17-20 ans","21-25 ans","26-35 ans","36-50 ans","51-65 ans","65+"]} />
                <SelectMulti label="Diversité" value={story.diversity} onChange={handleMulti(setStory, 'diversity')} options={["LGBTQ+","Personnes handicapées","Communautés culturelles","genre","ethnicité","religion","philosophie"]} />
                <SelectMulti label="Perspective" value={story.perspective} onChange={handleMulti(setStory, 'perspective')} options={["Première personne","Deuxième personne","Troisième personne","Omniscient","Flux de conscience","Épistolaire","Perspective multiples","Interactif","Observateur","Œil de caméra","Narrateur peu fiable"]} />
                <Input value={story.forbiddenWords} onChange={(e) => setStory({ ...story, forbiddenWords: e.target.value })} placeholder="Mots interdits" />
                <Input value={story.authorStyle} onChange={(e) => setStory({ ...story, authorStyle: e.target.value })} placeholder="Imiter un auteur" />
                <SelectMulti label="Support final" value={[story.supportType]} onChange={(v) => setStory({ ...story, supportType: v[0] })} options={["Ebook","Livre audio","Podcast","Vidéo","Article de blog","Autre"]} />
                <SelectMulti label="Objectif commercial" value={[story.commercialGoal]} onChange={(v) => setStory({ ...story, commercialGoal: v[0] })} options={["Commercialisable","Création pure","Autre"]} />
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={story.splitAudio} onChange={(e) => setStory({ ...story, splitAudio: e.target.checked })} />
                  Séparer audio pour plusieurs voix
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={story.seo} onChange={(e) => setStory({ ...story, seo: e.target.checked })} />
                  Optimiser SEO (article blog)
                </label>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONGLET PARAMÈTRES AJOUTÉ */} 
          <TabsContent value="parametres">
            <Card>
              <CardHeader><CardTitle>Paramètres de génération</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectMulti label="Longueur" value={[story.duration]} onChange={(v) => setStory({ ...story, duration: v[0] })} options={["500 mots","1000 mots","2000 mots","5000 mots","10000 mots","Court (1-3 pages)","Moyen (4-10 pages)","Long (11-30 pages)","Très long (30+ pages)","Micro-fiction (100-500 mots)","Nouvelle (1000-7500 mots)","Roman court (10000-40000 mots)","Roman (40000+ mots)","Saga (plusieurs tomes)","Série (épisodes)","Chapitres multiples","Actes multiples","Scènes multiples","Séquence narrative","Arc narratif complet"]} />
                
                <SelectMulti label="Style narratif" value={story.style} onChange={handleMulti(setStory, 'style')} options={["Narratif classique","Descriptif","Dialogué","Monologue intérieur","Stream of consciousness","Épistolaire","Journal intime","Chronique","Récit à la première personne","Récit à la troisième personne","Récit omniscient","Récit limité","Récit multiple","Récit non linéaire","Récit enchâssé","Métanarration","Narrateur peu fiable","Narrateur omniscient","Narrateur protagoniste","Narrateur témoin","Narrateur observateur","Récit interactif","Récit immersif","Récit poétique","Récit lyrique","Récit dramatique","Récit humoristique","Récit satirique","Récit ironique","Récit tragique"]} />
                
                <SelectMulti label="Ton général" value={story.tone} onChange={handleMulti(setStory, 'tone')} options={["Sérieux","Humoristique","Ironique","Sarcastique","Mélancolique","Optimiste","Pessimiste","Neutre","Passionné","Réfléchi","Dramatique","Comique","Tragique","Romantique","Mystérieux","Suspense","Émotionnel","Philosophique","Politique","Social","Culturel","Historique","Scientifique","Fantastique","Horrifique","Érotique","Éducationnel","Inspirant","Motivant","Révélateur","Provocateur","Révolutionnaire","Traditionnel","Moderne","Classique","Avant-gardiste","Expérimental"]} />
                
                <SelectMulti label="Chronologie" value={[story.chronology]} onChange={(v) => setStory({ ...story, chronology: v[0] })} options={["Linéaire","Non linéaire","Flashbacks","Anticipations","Récit enchâssé","Timelines parallèles","Sauts temporels","Boucles temporelles","Récit circulaire","Récit en spirale","Structure en miroir","Structure en actes","Structure pyramidale","Structure en cascade","Structure modulaire","Structure fragmentée","Structure kaléidoscopique","Structure labyrinthique"]} />
                
                <SelectMulti label="Niveau de créativité" value={[story.creativityLevel]} onChange={(v) => setStory({ ...story, creativityLevel: v[0] })} options={["Conservateur","Équilibré","Inventif","Expérimental","Traditionnel","Innovant","Classique","Moderne","Avant-gardiste","Éclectique"]} />
                
                <TextWithSuggestion label="Mots à éviter" value={story.forbiddenWords} onChange={(v) => setStory({ ...story, forbiddenWords: v })} placeholder="Liste de mots séparés par des virgules" />
                
                <TextWithSuggestion label="Style d'auteur à imiter" value={story.authorStyle} onChange={(v) => setStory({ ...story, authorStyle: v })} placeholder="Ex: Victor Hugo, Stephen King..." />
                
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={story.avoidRepetition} onChange={(e) => setStory({ ...story, avoidRepetition: e.target.checked })} />
                  Éviter les répétitions
                </label>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONGLET PERSONNAGE */}
          <TabsContent value="character">
            <Card>
              <CardHeader><CardTitle>Fiche personnage complète</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextWithSuggestion label="Nom complet" value={character.name} onChange={(v) => setCharacter({ ...character, name: v })} placeholder="Nom" />
                <TextWithSuggestion label="Surnoms" value={character.nickname} onChange={(v) => setCharacter({ ...character, nickname: v })} placeholder="Surnoms" />
                <Input value={character.age} onChange={(e) => setCharacter({ ...character, age: e.target.value })} placeholder="Âge" />
                <SelectMulti label="Genre" value={[character.gender]} onChange={(v) => setCharacter({ ...character, gender: v[0] })} options={["Masculin","Féminin","Non-binaire"]} />
                <TextWithSuggestion label="Apparence" value={character.appearance} onChange={(v) => setCharacter({ ...character, appearance: v })} placeholder="Apparence physique" />
                <TextWithSuggestion label="Personnalité" value={character.personality} onChange={(v) => setCharacter({ ...character, personality: v })} placeholder="Traits de personnalité" />
                <TextWithSuggestion label="Profession" value={character.profession} onChange={(v) => setCharacter({ ...character, profession: v })} placeholder="Profession actuelle" />
                <TextWithSuggestion label="Compétences" value={character.skills} onChange={(v) => setCharacter({ ...character, skills: v })} placeholder="Compétences spécialisées" />
                <TextWithSuggestion label="Défaut fatal" value={character.fatalFlaw} onChange={(v) => setCharacter({ ...character, fatalFlaw: v })} placeholder="Défaut fatal" />
                <TextWithSuggestion label="Désir principal" value={character.desire} onChange={(v) => setCharacter({ ...character, desire: v })} placeholder="Désir profond" />
                <TextWithSuggestion label="Peur profonde" value={character.fear} onChange={(v) => setCharacter({ ...character, fear: v })} placeholder="Peur" />
                <TextWithSuggestion label="Contexte de naissance" value={character.contextBirth} onChange={(v) => setCharacter({ ...character, contextBirth: v })} placeholder="Lieu de naissance et origine" />
                <TextWithSuggestion label="Éducation" value={character.education} onChange={(v) => setCharacter({ ...character, education: v })} placeholder="Éducation et formation" />
                <TextWithSuggestion label="Enfance" value={character.childhood} onChange={(v) => setCharacter({ ...character, childhood: v })} placeholder="Expériences marquantes" />
                <TextWithSuggestion label="Famille" value={character.family} onChange={(v) => setCharacter({ ...character, family: v })} placeholder="Relations familiales" />
                <TextWithSuggestion label="Trauma" value={character.trauma} onChange={(v) => setCharacter({ ...character, trauma: v })} placeholder="Événements traumatisants" />
                <TextWithSuggestion label="Objectifs courts" value={character.shortGoals} onChange={(v) => setCharacter({ ...character, shortGoals: v })} placeholder="Objectifs à court terme" />
                <TextWithSuggestion label="Objectifs longs" value={character.longGoals} onChange={(v) => setCharacter({ ...character, longGoals: v })} placeholder="Objectifs à long terme" />
                <TextWithSuggestion label="Obstacles" value={character.obstacles} onChange={(v) => setCharacter({ ...character, obstacles: v })} placeholder="Obstacles à surmonter" />
                <TextWithSuggestion label="Secrets" value={character.secrets} onChange={(v) => setCharacter({ ...character, secrets: v })} placeholder="Secrets" />
                <TextWithSuggestion label="Conflit interne" value={character.internalConflict} onChange={(v) => setCharacter({ ...character, internalConflict: v })} placeholder="Conflits internes" />
                <TextWithSuggestion label="Conflit externe" value={character.externalConflict} onChange={(v) => setCharacter({ ...character, externalConflict: v })} placeholder="Conflits externes" />
                <TextWithSuggestion label="Amis proches" value={character.friends} onChange={(v) => setCharacter({ ...character, friends: v })} placeholder="Amis proches" />
                <TextWithSuggestion label="Ennemis" value={character.enemies} onChange={(v) => setCharacter({ ...character, enemies: v })} placeholder="Ennemis ou rivaux" />
                <TextWithSuggestion label="Mentors" value={character.mentors} onChange={(v) => setCharacter({ ...character, mentors: v })} placeholder="Mentors" />
                <TextWithSuggestion label="Arc de croissance" value={character.growthArc} onChange={(v) => setCharacter({ ...character, growthArc: v })} placeholder="Arc de croissance" />
                <TextWithSuggestion label="Dialogue style" value={character.dialogueStyle} onChange={(v) => setCharacter({ ...character, dialogueStyle: v })} placeholder="Style de dialogue" />
                <TextWithSuggestion label="Résidence" value={character.residence} onChange={(v) => setCharacter({ ...character, residence: v })} placeholder="Lieu de résidence" />
                <TextWithSuggestion label="Contexte culturel" value={character.culturalContext} onChange={(v) => setCharacter({ ...character, culturalContext: v })} placeholder="Contexte culturel" />
                <TextWithSuggestion label="Statut économique" value={character.economicStatus} onChange={(v) => setCharacter({ ...character, economicStatus: v })} placeholder="Statut économique" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONGLET CHAPITRES */}
          <TabsContent value="chapter">
            <Card>
              <CardHeader><CardTitle>Planification des chapitres</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectMulti label="Nombre de chapitres" value={[chapters.count]} onChange={(v) => setChapters({ ...chapters, count: v[0] })} options={["1","3","5","7","10"]} />
                <SelectMulti label="Structure" value={[chapters.structure]} onChange={(v) => setChapters({ ...chapters, structure:
