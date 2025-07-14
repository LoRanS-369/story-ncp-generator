import { NextRequest, NextResponse } from 'next/server';
import { CharacterGenerationConfig, CharacterProfile } from '@/types/ncp';

// Fonction de génération de personnages (simulation pour la démo)
function generateCharacter(config: CharacterGenerationConfig): CharacterProfile {
  const characterId = `character_${Date.now()}`;

  // Génération du nom si non fourni
  const names = {
    fantasy: {
      male: ['Aldric', 'Theron', 'Kael', 'Darius', 'Gareth'],
      female: ['Lyra', 'Seraphina', 'Aria', 'Elena', 'Nyx'],
      neutral: ['Sage', 'River', 'Phoenix', 'Storm', 'Ember']
    },
    'science-fiction': {
      male: ['Zeke', 'Orion', 'Marcus', 'Nova', 'Vex'],
      female: ['Zara', 'Nova', 'Lyanna', 'Echo', 'Vera'],
      neutral: ['Code', 'Binary', 'Synth', 'Pulse', 'Matrix']
    },
    default: {
      male: ['Alexandre', 'Julien', 'Gabriel', 'Antoine', 'Nicolas'],
      female: ['Marie', 'Sophie', 'Camille', 'Julie', 'Emma'],
      neutral: ['Alex', 'Morgan', 'Jordan', 'Casey', 'Taylor']
    }
  };

  const genreNames = names[config.genre as keyof typeof names] || names.default;
  const genderKey = config.gender_preference === 'male' ? 'male' :
                   config.gender_preference === 'female' ? 'female' :
                   config.gender_preference === 'non-binary' ? 'neutral' :
                   Math.random() > 0.5 ? 'male' : 'female';

  const generatedName = config.name || genreNames[genderKey][Math.floor(Math.random() * genreNames[genderKey].length)];

  // Génération de l'âge
  const minAge = config.age_range?.min || 18;
  const maxAge = config.age_range?.max || 45;
  const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;

  // Génération du genre
  const genders = {
    male: ['Homme', 'Masculin'],
    female: ['Femme', 'Féminin'],
    'non-binary': ['Non-binaire', 'Fluide']
  };
  const gender = config.gender_preference === 'any' ?
    Object.keys(genders)[Math.floor(Math.random() * Object.keys(genders).length)] :
    config.gender_preference;

  // Génération de la profession selon le genre et le contexte
  const occupations = {
    fantasy: ['Mage', 'Guerrier', 'Voleur', 'Guérisseur', 'Noble', 'Forgeron', 'Érudit'],
    'science-fiction': ['Pilote spatial', 'Scientifique', 'Ingénieur', 'Commandant', 'Médecin', 'Hacker'],
    mystère: ['Détective', 'Journaliste', 'Avocat', 'Médecin légiste', 'Professeur'],
    default: ['Professeur', 'Médecin', 'Ingénieur', 'Artiste', 'Entrepreneur', 'Écrivain']
  };
  const occupation = occupations[config.genre as keyof typeof occupations]?.[Math.floor(Math.random() * occupations[config.genre as keyof typeof occupations].length)] ||
                    occupations.default[Math.floor(Math.random() * occupations.default.length)];

  // Génération des traits de personnalité selon le focus
  const personalityTraits = {
    heroic: ['Courageux', 'Loyal', 'Déterminé', 'Protecteur', 'Noble'],
    complex: ['Ambigu', 'Introspectif', 'Contradictoire', 'Fascinant', 'Nuancé'],
    mysterious: ['Énigmatique', 'Réservé', 'Observateur', 'Insondable', 'Secret'],
    comedic: ['Drôle', 'Spontané', 'Optimiste', 'Sarcastique', 'Léger'],
    tragic: ['Mélancolique', 'Tourmenté', 'Passionné', 'Sombre', 'Intense']
  };

  const baseTraits = personalityTraits[config.personality_focus || 'complex'];
  const additionalTraits = ['Intelligent', 'Empathique', 'Créatif', 'Pragmatique', 'Passionné', 'Réfléchi'];
  const traits = [...baseTraits.slice(0, 3), ...additionalTraits.slice(0, 2)];

  // Génération des forces
  const strengths = [
    'Leadership naturel', 'Empathie profonde', 'Intelligence stratégique',
    'Créativité débordante', 'Résilience', 'Charisme', 'Intuition aiguisée'
  ].slice(0, 3);

  // Génération des faiblesses (si activé)
  const weaknesses = config.include_flaws ? [
    'Orgueil', 'Impulsivité', 'Méfiance excessive', 'Perfectionnisme',
    'Colère', 'Naïveté', 'Obsession'
  ].slice(0, 3) : [];

  // Génération des peurs
  const fears = [
    'Perte des êtres chers', 'Échec', 'Abandon', 'Trahison',
    'Perte de contrôle', 'Solitude', 'Mort'
  ].slice(0, 2);

  // Génération des désirs
  const desires = [
    'Reconnaissance', 'Amour véritable', 'Justice', 'Liberté',
    'Connaissance', 'Pouvoir', 'Paix', 'Aventure'
  ].slice(0, 2);

  // Génération de l'apparence physique
  const heights = ['Petit', 'Moyen', 'Grand', 'Très grand'];
  const builds = ['Mince', 'Athlétique', 'Robuste', 'Imposant'];
  const hairColors = ['Noir', 'Brun', 'Blond', 'Roux', 'Gris', 'Blanc'];
  const eyeColors = ['Marron', 'Bleu', 'Vert', 'Gris', 'Noisette'];

  const physicalDescription = {
    height: heights[Math.floor(Math.random() * heights.length)],
    build: builds[Math.floor(Math.random() * builds.length)],
    hair: hairColors[Math.floor(Math.random() * hairColors.length)],
    eyes: eyeColors[Math.floor(Math.random() * eyeColors.length)],
    distinctive_features: ['Cicatrice sur la joue', 'Tatouage au poignet', 'Regard perçant']
  };

  // Génération de l'arc narratif (si activé)
  const characterArc = config.include_arc ? {
    starting_point: `Au début, ${generatedName} est ${traits[0].toLowerCase()} mais ${weaknesses[0]?.toLowerCase() || 'hésitant'}.`,
    transformation: `À travers les épreuves, ${generatedName} apprend à surmonter ${weaknesses[0]?.toLowerCase() || 'ses doutes'} et développe ${strengths[0].toLowerCase()}.`,
    ending_point: `À la fin, ${generatedName} devient une version plus forte et sage de lui-même, ayant trouvé l'équilibre.`,
    key_moments: [
      'Révélation de son passé',
      'Première épreuve majeure',
      'Moment de faiblesse',
      'Prise de conscience',
      'Transformation finale'
    ]
  } : {
    starting_point: '',
    transformation: '',
    ending_point: '',
    key_moments: []
  };

  // Génération du background (si activé)
  const background = config.include_backstory ?
    `${generatedName} a grandi dans ${config.story_context}. Son passé de ${occupation.toLowerCase()} l'a marqué profondément, forgeant sa personnalité ${traits[0].toLowerCase()}. Les événements de sa jeunesse expliquent à la fois ses forces (${strengths[0].toLowerCase()}) et ses faiblesses (${weaknesses[0]?.toLowerCase() || 'incertitudes'}).` :
    undefined;

  // Génération des relations (si activé)
  const relationships = config.include_relationships ? [
    {
      character_id: 'mentor_character',
      relationship_type: 'Mentor',
      description: 'Figure paternelle qui guide le personnage'
    },
    {
      character_id: 'rival_character',
      relationship_type: 'Rival',
      description: 'Antagoniste personnel qui pousse le personnage à évoluer'
    }
  ] : [];

  return {
    id: characterId,
    name: generatedName,
    role: config.role,
    age,
    gender: typeof gender === 'string' ? genders[gender as keyof typeof genders][0] : 'Non spécifié',
    occupation,
    background,
    physical_description: physicalDescription,
    personality: {
      traits,
      strengths,
      weaknesses,
      fears,
      desires,
      moral_alignment: config.role === 'protagonist' ? 'good' :
                      config.role === 'antagonist' ? 'evil' : 'neutral'
    },
    character_arc: characterArc,
    relationships,
    ncp_role: {
      perspective_id: `perspective_${characterId}`,
      player_function: config.role === 'protagonist' ? 'driver' :
                      config.role === 'antagonist' ? 'opponent' : 'support',
      thematic_significance: `Représente ${traits[0].toLowerCase()} dans l'exploration thématique`
    },
    created_at: new Date().toISOString()
  };
}

export async function POST(request: NextRequest) {
  try {
    const config: CharacterGenerationConfig = await request.json();

    // Validation
    if (!config.story_context || config.story_context.trim().length === 0) {
      return NextResponse.json(
        { error: "Le contexte de l'histoire est requis" },
        { status: 400 }
      );
    }

    // Générer le personnage
    const character = generateCharacter(config);

    return NextResponse.json(character);

  } catch (error) {
    console.error("Erreur lors de la génération du personnage:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// Documentation API
export async function GET() {
  const documentation = {
    endpoint: "/api/generate-character",
    method: "POST",
    description: "Génère un personnage complexe avec arc narratif intégré",
    content_type: "application/json",
    parameters: {
      role: { type: "string", required: true, options: ["protagonist", "antagonist", "support", "background"] },
      genre: { type: "string", required: true, description: "Genre littéraire du contexte" },
      story_context: { type: "string", required: true, description: "Contexte de l'histoire" },
      name: { type: "string", optional: true, description: "Nom spécifique ou génération automatique" },
      age_range: { type: "object", optional: true, properties: { min: "number", max: "number" } },
      gender_preference: { type: "string", optional: true, options: ["any", "male", "female", "non-binary"] },
      personality_focus: { type: "string", optional: true, options: ["heroic", "complex", "mysterious", "comedic", "tragic"] },
      background_complexity: { type: "string", default: "detailed", options: ["simple", "detailed", "extensive"] },
      include_flaws: { type: "boolean", default: true },
      include_backstory: { type: "boolean", default: true },
      include_relationships: { type: "boolean", default: true },
      include_arc: { type: "boolean", default: true },
      creativity_level: { type: "string", default: "standard", options: ["low", "standard", "high", "maximum"] }
    },
    response_format: "CharacterProfile JSON",
    n8n_integration: {
      webhook_url: "Utiliser cette URL dans votre workflow n8n",
      http_method: "POST",
      headers: { "Content-Type": "application/json" }
    }
  };

  return NextResponse.json(documentation);
}
