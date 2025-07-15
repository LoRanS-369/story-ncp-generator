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

          {/* ONGLET CHAPITRES */}
          <TabsContent value="chapter">
            <Card>
              <CardHeader><CardTitle>Planification des chapitres</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectMulti label="Nombre de chapitres" value={[chapters.count]} onChange={(v) => setChapters({ ...chapters, count: v[0] })} options={["1","3","5","7","10"]} />
                <SelectMulti label="Structure" value={[chapters.structure]} onChange={(v) => setChapters({ ...chapters, structure: v[0] })} options={["Acte 3","Acte 5","Hero's Journey","Freytag","Save the Cat!"]} />
<SelectMulti label="Pacing" value={[chapters.pacing]} onChange={(v) => setChapters({ ...chapters, pacing: v[0] })} options={["Lent","Modéré","Rapide","Variable"]} />
<SelectMulti label="Timeline style" value={[chapters.timelineStyle]} onChange={(v) => setChapters({ ...chapters, timelineStyle: v[0] })} options={["Linéaire","Non linéaire","Flashbacks","Récits parallèles","Complexe","Imbriqués","Sauts temporels"]} />
<SelectMulti label="Global Arc" value={chapters.globalArc} onChange={handleMulti(setChapters, 'globalArc')} options={["Voyage du Héros","Chute et Rédemption","Quête","Transformation","Découverte de Soi","Révolte","Survie","Ascension et Chute","Quête de Vérité","Réconciliation"]} />
<SelectMulti label="Arc type" value={chapters.arcType} onChange={handleMulti(setChapters, 'arcType')} options={["Arc principal","Arc secondaire","Sous-arc"]} />
<TextWithSuggestion label="Twist du milieu" value={chapters.midpoint} onChange={(v) => setChapters({ ...chapters, midpoint: v })} placeholder="Twist central" />
<TextWithSuggestion label="Climax" value={chapters.climax} onChange={(v) => setChapters({ ...chapters, climax: v })} placeholder="Climax" />
<TextWithSuggestion label="Résolution" value={chapters.resolution} onChange={(v) => setChapters({ ...chapters, resolution: v })} placeholder="Résolution finale" />
<label className="flex items-center gap-2">
<label className="flex items-center gap-2">
<label className="flex items-center gap-2">
      {/* Reste des onglets... */}
      <TabsContent value="links">
        <Card>
          <CardHeader><CardTitle>Liens & intrigues entre personnages</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["loyaltyConflict","redemptionQuest","raceAgainstTime","betrayal","familySecret","forbiddenLove","powerCorruption","survival","rivalry","truthQuest"].map(key => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" checked={(links as any)[key]} onChange={(e) => setLinks({ ...links, [key]: e.target.checked })} />
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </label>
            ))}
            <SelectMulti label="Niveau d'intrigue" value={links.intrigueLevel} onChange={handleMulti(setLinks, 'intrigueLevel')} options={["Intrigue principale","Intrigue secondaire","Sous-intrigue"]} />
            <TextWithSuggestion label="Arbre généalogique" value={links.genealogy} onChange={(v) => setLinks({ ...links, genealogy: v })} placeholder="Arbre généalogique" />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="locations">
        <Card>
          <CardHeader><CardTitle>Lieux des actions</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectMulti label="Urbain" value={locations.urban} onChange={handleMulti(setLocations, 'urban')} options={locationsUrban} />
            <SelectMulti label="Rural" value={locations.rural} onChange={handleMulti(setLocations, 'rural')} options={locationsRural} />
            <SelectMulti label="Côtier" value={locations.coastal} onChange={handleMulti(setLocations, 'coastal')} options={locationsCoastal} />
            <SelectMulti label="Fantastique" value={locations.fantasy} onChange={handleMulti(setLocations, 'fantasy')} options={locationsFantasy} />
            <SelectMulti label="Historique" value={locations.historical} onChange={handleMulti(setLocations, 'historical')} options={locationsHistorical} />
            <SelectMulti label="Futuriste" value={locations.futuristic} onChange={handleMulti(setLocations, 'futuristic')} options={locationsFuturistic} />
            <SelectMulti label="Mystique" value={locations.mystical} onChange={handleMulti(setLocations, 'mystical')} options={locationsMystical} />
            <SelectMulti label="Industriel" value={locations.industrial} onChange={handleMulti(setLocations, 'industrial')} options={locationsIndustrial} />
            <SelectMulti label="Transport" value={locations.transport} onChange={handleMulti(setLocations, 'transport')} options={locationsTransport} />
            <SelectMulti label="Loisirs" value={locations.leisure} onChange={handleMulti(setLocations, 'leisure')} options={locationsLeisure} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="themes">
        <Card>
          <CardHeader><CardTitle>Thèmes des livres</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectMulti label="Général" value={themes.general} onChange={handleMulti(setThemes, 'general')} options={themesGeneral} />
            <SelectMulti label="Sport" value={themes.sport} onChange={handleMulti(setThemes, 'sport')} options={themesSport} />
            <SelectMulti label="Érotique" value={themes.erotic} onChange={handleMulti(setThemes, 'erotic')} options={themesErotic} />
            <SelectMulti label="Professionnel" value={themes.professional} onChange={handleMulti(setThemes, 'professional')} options={themesProfessional} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="custom">
        <Card>
          <CardHeader><CardTitle>Personnalisation IA</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectMulti label="Niveau de créativité" value={[customization.creativityLevel]} onChange={(v) => setCustomization({ ...customization, creativityLevel: v[0] })} options={creativityLevels} />
            <SelectMulti label="Style d'écriture" value={customization.style} onChange={handleMulti(setCustomization, 'style')} options={styles} />
            <SelectMulti label="Ton" value={customization.tone} onChange={handleMulti(setCustomization, 'tone')} options={tones} />
            <SelectMulti label="Types de mort" value={customization.death} onChange={handleMulti(setCustomization, 'death')} options={["Mort héroïque","Sacrifice","Trahison mortelle","Mort inattendue","Mort symbolique","Mort tragique","Mort mystérieuse","Mort en combat","Mort par maladie","Mort par accident"]} />
            <SelectMulti label="Types de sexe" value={customization.sex} onChange={handleMulti(setCustomization, 'sex')} options={["Scènes de séduction","Scènes d'amour","Scènes érotiques","Scènes de passion","Scènes de désir","Scènes de tentative","Scènes de rencontre","Scènes de relation interdite","Scènes de relation complexe"]} />
            <SelectMulti label="Phrases d'ouverture" value={customization.opening} onChange={handleMulti(setCustomization, 'opening')} options={["Mystérieuse","Intrigante","Dramatique","Poétique","Humouristique","Émotionnelle","Suspense","Réfléchie","Descriptive","Inspirante"]} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    {/* ACTIONS GLOBALES */}
    <div className="mt-6 flex flex-wrap gap-2">
      <Button onClick={generateAll} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
        {loading ? 'Génération en cours...' : 'Générer tout'}
      </Button>
      <Button onClick={async () => alert('Envoyé à n8n !')} disabled={loading} variant="outline">
        📤 Envoyer à n8n
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
  </div>
</div>
);
}
