import { NextRequest, NextResponse } from 'next/server';
import { StoryGenerationConfig, GeneratedStory, NCPStory } from '@/types/ncp';

// Simuler la génération d'histoire pour la démo
// Dans une version production, ceci utiliserait OpenAI/Claude/Gemini
function generateStoryIdea(config: StoryGenerationConfig): GeneratedStory {
  const storyId = `story_${Date.now()}`;
  const narrativeId = `narrative_${Date.now()}`;

  // Génération d'idée basée sur le prompt et la configuration
  const title = generateTitle(config);
  const logline = generateLogline(config);
  const summary = generateSummary(config);
  const characters = generateCharacters(config);
  const themes = generateThemes(config);
  const plotOutline = generatePlotOutline(config);

  const story: NCPStory = {
    id: storyId,
    title,
    genre: config.genre,
    logline,
    created_at: new Date().toISOString(),
    narratives: [
      {
        id: narrativeId,
        title: "Narrative Principale",
        subtext: {
          perspectives: config.include_subtext ? generatePerspectives(config) : [],
          players: config.include_subtext ? generatePlayers(characters) : [],
          storypoints: config.include_subtext ? generateStorypoints(themes) : [],
          storybeats: config.include_subtext ? generateStorybeats(config) : [],
          dynamics: config.include_subtext ? generateDynamics(config) : [],
        },
        storytelling: {
          overviews: config.include_storytelling ? generateOverviews(config, summary) : [],
          moments: config.include_storytelling ? generateMoments(config) : [],
        }
      }
    ]
  };

  return {
    story,
    generated_content: {
      idea: config.prompt,
      summary,
      characters,
      plot_outline: plotOutline,
      themes,
    },
    metadata: {
      generation_time: new Date().toISOString(),
      config_used: config,
      version: "1.0.0"
    }
  };
}

function generateTitle(config: StoryGenerationConfig): string {
  const titles = {
    fantasy: ["L'Épée de Lumière", "Le Royaume Oublié", "Les Gardiens de l'Ancien Monde"],
    'science-fiction': ["Les Voyageurs du Temps", "L'Étoile Perdue", "Le Dernier Android"],
    mystery: ["L'Énigme du Manoir", "Le Secret de Willowbrook", "L'Affaire des Roses Noires"],
    thriller: ["La Course Contre le Temps", "L'Ombre du Passé", "Le Piège Parfait"],
    romance: ["Un Amour Inattendu", "Les Chemins du Cœur", "Rendez-vous au Coucher du Soleil"],
    drama: ["Les Liens Brisés", "La Voie de la Rédemption", "Un Nouveau Départ"],
    horror: ["La Maison des Murmures", "L'Éveil des Ténèbres", "Le Cauchemar Éternel"],
  };

  const genreList = titles[config.genre as keyof typeof titles] || titles.drama;
  return genreList[Math.floor(Math.random() * genreList.length)];
}

function generateLogline(config: StoryGenerationConfig): string {
  const templates = [
    `Un ${getProtagonistType(config)} découvre ${getConflictElement(config)} et doit ${getGoal(config)} avant que ${getThreat(config)}.`,
    `Quand ${getIncitingIncident(config)}, un ${getProtagonistType(config)} se lance dans ${getJourney(config)} pour ${getGoal(config)}.`,
    `Dans un monde où ${getWorldBuilding(config)}, ${getProtagonistType(config)} doit affronter ${getAntagonist(config)} pour ${getGoal(config)}.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
}

function generateSummary(config: StoryGenerationConfig): string {
  return `Cette histoire ${config.genre} de ${config.length === 'short' ? 'format court' : config.length === 'novel' ? 'format roman' : 'format moyen'} explore les thèmes de ${config.thematic_focus.join(', ') || 'transformation personnelle et découverte de soi'}. Le récit est raconté avec un ton ${config.tone} et un style ${config.style}, s'adressant à un public ${config.target_audience}. L'intrigue suit une structure ${config.structure_type.replace('_', ' ')} et met l'accent sur les conflits ${config.conflict_type === 'both' ? 'internes et externes' : config.conflict_type + 's'} du protagoniste.`;
}

function generateCharacters(config: StoryGenerationConfig): string[] {
  const protagonists = ["Elena", "Marcus", "Aria", "Thomas", "Luna", "Gabriel"];
  const antagonists = ["Le Baron Noir", "Dr. Vex", "Lady Serpentia", "Le Collecteur"];
  const supports = ["Sage Mentor", "Fidèle Ami", "Mystérieux Guide", "Allié Inattendu"];

  return [
    protagonists[Math.floor(Math.random() * protagonists.length)],
    antagonists[Math.floor(Math.random() * antagonists.length)],
    supports[Math.floor(Math.random() * supports.length)]
  ];
}

function generateThemes(config: StoryGenerationConfig): string[] {
  if (config.thematic_focus.length > 0) {
    return config.thematic_focus;
  }

  const themes = {
    fantasy: ["Magie vs Technologie", "Prophétie", "Sacrifice", "Transformation"],
    'science-fiction': ["Humanité vs IA", "Exploration", "Evolution", "Éthique"],
    mystery: ["Vérité cachée", "Justice", "Secrets de famille", "Rédemption"],
    thriller: ["Survie", "Trahison", "Paranoia", "Course contre le temps"],
    romance: ["Amour véritable", "Second chance", "Sacrifice", "Destins croisés"],
    drama: ["Famille", "Pardon", "Résilience", "Croissance personnelle"],
    horror: ["Peur de l'inconnu", "Corruption", "Survie", "Psychologie humaine"]
  };

  const genreThemes = themes[config.genre as keyof typeof themes] || themes.drama;
  return genreThemes.slice(0, 3);
}

function generatePlotOutline(config: StoryGenerationConfig): string {
  const structures = {
    three_act: "Acte I (Mise en place) → Acte II (Développement et confrontation) → Acte III (Résolution)",
    five_act: "Exposition → Action montante → Climax → Action descendante → Dénouement",
    heros_journey: "Monde ordinaire → Appel à l'aventure → Refus → Mentor → Seuil → Tests → Épreuve → Récompense → Retour",
    save_the_cat: "Image d'ouverture → Setup → Catalyseur → Débat → Break into Two → B Story → Midpoint → All Is Lost → Finale"
  };

  return structures[config.structure_type as keyof typeof structures] || structures.three_act;
}

function generatePerspectives(config: StoryGenerationConfig) {
  return [
    {
      id: `perspective_${Date.now()}_1`,
      title: "Perspective du Protagoniste",
      description: "Point de vue principal du héros",
      viewpoint: "Comment le protagoniste perçoit le conflit central"
    },
    {
      id: `perspective_${Date.now()}_2`,
      title: "Perspective de l'Antagoniste",
      description: "Point de vue de l'opposition",
      viewpoint: "La justification morale de l'antagoniste"
    }
  ];
}

function generatePlayers(characters: string[]) {
  return characters.map((char, index) => ({
    id: `player_${Date.now()}_${index}`,
    name: char,
    role: index === 0 ? "Protagoniste" : index === 1 ? "Antagoniste" : "Support",
    description: `Personnage clé de l'histoire`,
    function: index === 0 ? "Moteur de l'action" : index === 1 ? "Opposition" : "Aide et révélation"
  }));
}

function generateStorypoints(themes: string[]) {
  return themes.map((theme, index) => ({
    id: `storypoint_${Date.now()}_${index}`,
    title: theme,
    concept: `Exploration thématique de ${theme}`,
    thematic_meaning: `Signification profonde liée à ${theme}`
  }));
}

function generateStorybeats(config: StoryGenerationConfig) {
  const beats = [
    { title: "Inciting Incident", description: "Événement déclencheur de l'histoire" },
    { title: "First Plot Point", description: "Première révélation majeure" },
    { title: "Midpoint", description: "Tournant central de l'intrigue" },
    { title: "Climax", description: "Point culminant du conflit" },
    { title: "Resolution", description: "Résolution des conflits principaux" }
  ];

  return beats.map((beat, index) => ({
    id: `storybeat_${Date.now()}_${index}`,
    title: beat.title,
    description: beat.description,
    sequence_number: index + 1,
    thematic_shift: `Évolution thématique étape ${index + 1}`
  }));
}

function generateDynamics(config: StoryGenerationConfig) {
  return [
    {
      id: `dynamic_${Date.now()}_1`,
      type: "Transformation",
      description: "Force narrative de changement du protagoniste",
      influence: "Guide l'arc de développement personnel"
    },
    {
      id: `dynamic_${Date.now()}_2`,
      type: "Conflit",
      description: "Tension centrale de l'histoire",
      influence: "Maintient l'engagement du lecteur"
    }
  ];
}

function generateOverviews(config: StoryGenerationConfig, summary: string) {
  return [
    {
      id: `overview_${Date.now()}_1`,
      type: "plot_summary" as const,
      title: "Résumé de l'intrigue",
      description: summary
    },
    {
      id: `overview_${Date.now()}_2`,
      type: "throughline" as const,
      title: "Ligne narrative principale",
      description: `L'histoire suit ${config.narrative_perspective.replace('_', ' ')} avec un arc ${config.character_arc_type}`
    }
  ];
}

function generateMoments(config: StoryGenerationConfig) {
  const moments = [
    { type: "act", title: "Acte 1", synopsis: "Mise en place du monde et des personnages" },
    { type: "act", title: "Acte 2", synopsis: "Développement du conflit et complications" },
    { type: "act", title: "Acte 3", synopsis: "Résolution et transformation" }
  ];

  return moments.map((moment, index) => ({
    id: `moment_${Date.now()}_${index}`,
    type: moment.type as "act",
    title: moment.title,
    synopsis: moment.synopsis,
    storybeat_references: [`storybeat_${Date.now()}_${index}`]
  }));
}

// Fonctions utilitaires pour la génération de logline
function getProtagonistType(config: StoryGenerationConfig): string {
  const types = ["détective", "héros", "scientifique", "aventurier", "mage", "rebelle"];
  return types[Math.floor(Math.random() * types.length)];
}

function getConflictElement(config: StoryGenerationConfig): string {
  const elements = ["un secret ancien", "une prophétie", "un mystère", "une menace cachée"];
  return elements[Math.floor(Math.random() * elements.length)];
}

function getGoal(config: StoryGenerationConfig): string {
  const goals = ["sauver le monde", "découvrir la vérité", "retrouver l'amour perdu", "vaincre le mal"];
  return goals[Math.floor(Math.random() * goals.length)];
}

function getThreat(config: StoryGenerationConfig): string {
  const threats = ["tout soit perdu", "l'ennemi triomphe", "le temps s'épuise", "l'espoir disparaisse"];
  return threats[Math.floor(Math.random() * threats.length)];
}

function getIncitingIncident(config: StoryGenerationConfig): string {
  const incidents = ["un événement mystérieux survient", "une découverte choquante est faite", "un appel à l'aide arrive"];
  return incidents[Math.floor(Math.random() * incidents.length)];
}

function getJourney(config: StoryGenerationConfig): string {
  const journeys = ["une quête périlleuse", "une enquête approfondie", "un voyage initiatique"];
  return journeys[Math.floor(Math.random() * journeys.length)];
}

function getWorldBuilding(config: StoryGenerationConfig): string {
  const worlds = ["la magie règne", "la technologie domine", "les secrets abondent", "le danger rôde"];
  return worlds[Math.floor(Math.random() * worlds.length)];
}

function getAntagonist(config: StoryGenerationConfig): string {
  const antagonists = ["une force mystérieuse", "un ennemi redoutable", "des obstacles insurmontables"];
  return antagonists[Math.floor(Math.random() * antagonists.length)];
}

export async function POST(request: NextRequest) {
  try {
    const config: StoryGenerationConfig = await request.json();

    // Validation basique
    if (!config.prompt || config.prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Le prompt est requis" },
        { status: 400 }
      );
    }

    // Générer l'histoire
    const result = generateStoryIdea(config);

    return NextResponse.json(result);

  } catch (error) {
    console.error("Erreur lors de la génération:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// Endpoint GET pour la documentation API (utile pour n8n)
export async function GET() {
  const documentation = {
    endpoint: "/api/generate-story",
    method: "POST",
    description: "Génère une idée d'histoire structurée selon le Narrative Context Protocol (NCP)",
    content_type: "application/json",
    parameters: {
      prompt: { type: "string", required: true, description: "Idée de base de l'histoire" },
      genre: { type: "string", default: "fantasy", options: ["fantasy", "science-fiction", "mystery", "thriller", "romance", "drama", "horror", "adventure", "comedy"] },
      length: { type: "string", default: "medium", options: ["short", "medium", "long", "novel"] },
      tone: { type: "string", default: "neutral" },
      style: { type: "string", default: "descriptive" },
      narrative_perspective: { type: "string", default: "third_person_limited" },
      structure_type: { type: "string", default: "three_act" },
      target_audience: { type: "string", default: "adult" },
      thematic_focus: { type: "array", description: "Liste des thèmes à explorer" },
      conflict_type: { type: "string", default: "both", options: ["internal", "external", "both"] },
      character_arc_type: { type: "string", default: "positive", options: ["positive", "negative", "flat"] },
      creativity_level: { type: "string", default: "standard", options: ["low", "standard", "high", "maximum"] },
      include_subtext: { type: "boolean", default: true, description: "Inclure la structure NCP Subtext" },
      include_storytelling: { type: "boolean", default: true, description: "Inclure la structure NCP Storytelling" },
      generate_full_ncp: { type: "boolean", default: true, description: "Générer le format NCP complet" }
    },
    response_format: "JSON NCP compliant",
    n8n_integration: {
      webhook_url: "Utiliser cette URL dans votre workflow n8n",
      http_method: "POST",
      headers: { "Content-Type": "application/json" }
    }
  };

  return NextResponse.json(documentation);
}
