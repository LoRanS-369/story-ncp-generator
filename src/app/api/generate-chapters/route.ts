import { NextRequest, NextResponse } from 'next/server';
import { ChapterPlanConfig, Chapter } from '@/types/ncp';

// Fonction de génération de plan de chapitres
function generateChapterPlan(config: ChapterPlanConfig): Chapter[] {
  const chapters: Chapter[] = [];

  // Templates de structures narratives
  const structures = {
    three_act: {
      act1: Math.ceil(config.total_chapters * 0.25),
      act2: Math.ceil(config.total_chapters * 0.5),
      act3: Math.ceil(config.total_chapters * 0.25)
    },
    five_act: {
      exposition: Math.ceil(config.total_chapters * 0.15),
      rising_action: Math.ceil(config.total_chapters * 0.25),
      climax: Math.ceil(config.total_chapters * 0.2),
      falling_action: Math.ceil(config.total_chapters * 0.25),
      resolution: Math.ceil(config.total_chapters * 0.15)
    },
    heros_journey: {
      ordinary_world: Math.ceil(config.total_chapters * 0.1),
      call_to_adventure: Math.ceil(config.total_chapters * 0.15),
      tests_allies: Math.ceil(config.total_chapters * 0.35),
      ordeal: Math.ceil(config.total_chapters * 0.2),
      return: Math.ceil(config.total_chapters * 0.2)
    }
  };

  // Calcul des mots par chapitre selon la longueur cible
  const totalWords = {
    novella: 35000,
    novel: 75000,
    epic: 120000
  };
  const wordsPerChapter = Math.floor(totalWords[config.target_length] / config.total_chapters);

  // Événements et développements par genre
  const genreEvents = {
    fantasy: [
      'Découverte de pouvoirs magiques', 'Rencontre avec un mentor', 'Première quête',
      'Révélation sur l\'origine', 'Combat avec une créature', 'Alliance inattendue',
      'Trahison d\'un proche', 'Perte d\'un allié', 'Affrontement final', 'Nouvelle harmonie'
    ],
    'science-fiction': [
      'Découverte technologique', 'Premier contact alien', 'Voyage spatial',
      'Révélation sur l\'humanité', 'Conflit intergalactique', 'Alliance inter-espèces',
      'Sabotage technologique', 'Sacrifice héroïque', 'Bataille spatiale', 'Nouvelle ère'
    ],
    mystère: [
      'Découverte du crime', 'Premiers indices', 'Interrogatoires',
      'Fausse piste', 'Révélation cruciale', 'Mise en danger',
      'Piège du coupable', 'Confrontation', 'Résolution', 'Épilogue'
    ],
    romance: [
      'Première rencontre', 'Attirance mutuelle', 'Premier baiser',
      'Malentendu', 'Séparation', 'Réalisation des sentiments',
      'Grand geste romantique', 'Réconciliation', 'Déclaration d\'amour', 'Happy ending'
    ],
    default: [
      'Mise en place', 'Développement des personnages', 'Premier conflit',
      'Complications', 'Point de non-retour', 'Révélations',
      'Climax émotionnel', 'Résolution des conflits', 'Transformation', 'Conclusion'
    ]
  };

  const events = genreEvents[config.genre as keyof typeof genreEvents] || genreEvents.default;

  // Génération des chapitres
  for (let i = 1; i <= config.total_chapters; i++) {
    const chapterId = `chapter_${Date.now()}_${i}`;

    // Détermination de la phase narrative
    let phase = '';
    let phaseDescription = '';

    if (config.structure_type === 'three_act') {
      if (i <= structures.three_act.act1) {
        phase = 'Acte I';
        phaseDescription = 'Mise en place et présentation';
      } else if (i <= structures.three_act.act1 + structures.three_act.act2) {
        phase = 'Acte II';
        phaseDescription = 'Développement et complications';
      } else {
        phase = 'Acte III';
        phaseDescription = 'Résolution et conclusion';
      }
    }

    // Sélection d'événements appropriés selon la progression
    const progressRatio = (i - 1) / (config.total_chapters - 1);
    const eventIndex = Math.floor(progressRatio * events.length);
    const mainEvent = events[eventIndex] || `Développement ${i}`;

    // Génération du titre
    const titles = [
      `Le ${mainEvent}`,
      `${mainEvent}`,
      `Chapitre ${i}: ${mainEvent}`,
      `${phase} - ${mainEvent}`,
      mainEvent
    ];
    const title = titles[Math.floor(Math.random() * titles.length)];

    // Génération de l'objectif du chapitre
    const purposes = [
      `Développer ${mainEvent.toLowerCase()}`,
      `Révéler des informations importantes sur ${config.central_conflict.split(' ')[0].toLowerCase()}`,
      `Faire progresser l'arc de ${config.main_characters[0] || 'personnage principal'}`,
      `Intensifier le conflit principal`,
      `Explorer les thèmes de ${config.themes[0] || 'transformation'}`,
      `Préparer les événements du chapitre suivant`
    ];
    const purpose = purposes[Math.floor(Math.random() * purposes.length)];

    // Génération du résumé
    const summaries = [
      `Dans ce chapitre, ${mainEvent.toLowerCase()} change la donne pour ${config.main_characters[0] || 'le protagoniste'}. Les événements révèlent des aspects cruciaux du conflit central et poussent l'histoire vers sa résolution.`,
      `${config.main_characters[0] || 'Le protagoniste'} fait face à ${mainEvent.toLowerCase()}, ce qui l'oblige à prendre des décisions difficiles. Ce chapitre explore les thèmes de ${config.themes[0] || 'courage'} et ${config.themes[1] || 'sacrifice'}.`,
      `Les tensions montent alors que ${mainEvent.toLowerCase()} se produit. Les personnages doivent naviguer dans cette nouvelle situation tout en gardant à l'esprit leur objectif principal concernant ${config.central_conflict.split(' ')[0].toLowerCase()}.`
    ];
    const summary = summaries[Math.floor(Math.random() * summaries.length)];

    // Génération des événements clés
    const keyEvents = [
      mainEvent,
      `Dialogue important avec ${config.main_characters[1] || 'un allié'}`,
      `Révélation sur ${config.central_conflict.split(' ')[0].toLowerCase()}`,
      `Développement de personnage`,
      `Progression de l'intrigue`
    ].slice(0, Math.min(3, config.detailed_outlines ? 4 : 2));

    // Développements de personnages
    const characterDevelopments = config.character_arc_tracking ? [
      `Évolution de ${config.main_characters[0] || 'protagoniste'}`,
      `Relation avec ${config.main_characters[1] || 'deutéragoniste'}`,
      `Révélation personnelle`
    ].slice(0, 2) : [];

    // Progression de l'intrigue
    const plotAdvancement = `Ce chapitre fait progresser l'intrigue principale en ${mainEvent.toLowerCase()}, rapprochant les personnages de la résolution du conflit central.`;

    // Détermination du rythme
    const pacings: Array<'slow' | 'moderate' | 'fast' | 'intense'> = ['slow', 'moderate', 'fast', 'intense'];
    let pacing: 'slow' | 'moderate' | 'fast' | 'intense';

    if (i <= Math.ceil(config.total_chapters * 0.2)) {
      pacing = 'moderate'; // Début
    } else if (i >= Math.ceil(config.total_chapters * 0.8)) {
      pacing = 'intense'; // Fin
    } else if (i === Math.ceil(config.total_chapters * 0.5)) {
      pacing = 'fast'; // Milieu
    } else {
      pacing = pacings[Math.floor(Math.random() * 2) + 1]; // moderate ou fast
    }

    // Intégration NCP
    const ncpElements = config.ncp_integration ? {
      storybeat_references: [`storybeat_${chapterId}`, `beat_${phase.toLowerCase()}_${i}`],
      thematic_focus: config.themes.slice(0, 2),
      character_arcs_involved: config.main_characters.slice(0, 2)
    } : undefined;

    // Création du chapitre
    const chapter: Chapter = {
      id: chapterId,
      number: i,
      title,
      purpose,
      pov_character: config.pov_rotation ?
        config.main_characters[i % config.main_characters.length] || 'Narrateur' :
        config.main_characters[0] || 'Narrateur',
      setting: {
        location: `Lieu ${i}`,
        time_period: 'Présent narratif',
        atmosphere: pacing === 'intense' ? 'Tendue' : pacing === 'fast' ? 'Dynamique' : 'Contemplative'
      },
      summary,
      key_events: keyEvents,
      character_developments: characterDevelopments,
      plot_advancement: plotAdvancement,
      target_word_count: config.chapter_length_consistency ? wordsPerChapter :
        Math.floor(wordsPerChapter * (0.8 + Math.random() * 0.4)),
      estimated_pages: Math.ceil(wordsPerChapter / 250),
      tone: config.genre === 'horror' ? 'Sombre' :
            config.genre === 'romance' ? 'Romantique' :
            config.genre === 'comedy' ? 'Léger' : 'Adapté au genre',
      pacing,
      ncp_elements: ncpElements,
      status: 'planned',
      notes: config.detailed_outlines ?
        `Chapitre ${phase} - Focus sur ${mainEvent.toLowerCase()}` : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    chapters.push(chapter);
  }

  // Ajustements pour les cliffhangers
  if (config.cliffhanger_frequency && config.cliffhanger_frequency !== 'none') {
    const cliffhangerChapters = config.cliffhanger_frequency === 'every_chapter' ?
      chapters.filter((_, i) => i < chapters.length - 1) : // Tous sauf le dernier
      config.cliffhanger_frequency === 'many' ?
      chapters.filter((_, i) => i % 2 === 0 && i < chapters.length - 1) : // Un sur deux
      chapters.filter((_, i) => [Math.floor(chapters.length * 0.3), Math.floor(chapters.length * 0.7)].includes(i)); // Quelques-uns

    cliffhangerChapters.forEach(chapter => {
      chapter.key_events.push('Cliffhanger');
      chapter.notes = (chapter.notes || '') + ' - Se termine sur un suspense';
    });
  }

  return chapters;
}

export async function POST(request: NextRequest) {
  try {
    const config: ChapterPlanConfig = await request.json();

    // Validation
    if (!config.story_title || config.story_title.trim().length === 0) {
      return NextResponse.json(
        { error: "Le titre de l'histoire est requis" },
        { status: 400 }
      );
    }

    if (!config.central_conflict || config.central_conflict.trim().length === 0) {
      return NextResponse.json(
        { error: "Le conflit central est requis" },
        { status: 400 }
      );
    }

    if (config.total_chapters < 1 || config.total_chapters > 100) {
      return NextResponse.json(
        { error: "Le nombre de chapitres doit être entre 1 et 100" },
        { status: 400 }
      );
    }

    // Générer le plan de chapitres
    const chapters = generateChapterPlan(config);

    return NextResponse.json(chapters);

  } catch (error) {
    console.error("Erreur lors de la génération du plan de chapitres:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// Documentation API
export async function GET() {
  const documentation = {
    endpoint: "/api/generate-chapters",
    method: "POST",
    description: "Génère un plan de chapitres structuré avec intégration NCP",
    content_type: "application/json",
    parameters: {
      story_title: { type: "string", required: true, description: "Titre de l'ouvrage" },
      total_chapters: { type: "number", required: true, description: "Nombre total de chapitres" },
      target_length: { type: "string", required: true, options: ["novella", "novel", "epic"] },
      structure_type: { type: "string", required: true, options: ["three_act", "five_act", "heros_journey", "custom"] },
      genre: { type: "string", required: true, description: "Genre littéraire" },
      central_conflict: { type: "string", required: true, description: "Description du conflit central" },
      main_characters: { type: "array", optional: true, description: "Liste des personnages principaux" },
      themes: { type: "array", optional: true, description: "Thèmes principaux à explorer" },
      chapter_length_consistency: { type: "boolean", default: false },
      include_subplots: { type: "boolean", default: false },
      pov_rotation: { type: "boolean", default: false },
      cliffhanger_frequency: { type: "string", optional: true, options: ["none", "some", "many", "every_chapter"] },
      detailed_outlines: { type: "boolean", default: true },
      character_arc_tracking: { type: "boolean", default: true },
      theme_progression: { type: "boolean", default: true },
      ncp_integration: { type: "boolean", default: true }
    },
    response_format: "Array of Chapter objects",
    n8n_integration: {
      webhook_url: "Utiliser cette URL dans votre workflow n8n",
      http_method: "POST",
      headers: { "Content-Type": "application/json" }
    }
  };

  return NextResponse.json(documentation);
}
