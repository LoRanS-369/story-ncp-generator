// Types pour la configuration de génération d'histoires
export interface StoryGenerationConfig {
  prompt: string;
  product_theme: string;
  book_type: string;
  genre: string;
  tone: string;
  style: string;
  length: string;
  format: string;
  narrative_perspective: string;
  structure_type: string;
  target_audience: string;
  reading_level: string;
  content_maturity: string;
  thematic_focus: string[];
  conflict_type: string;
  character_arc_type: string;
  market_positioning: string;
  creativity_level: string;
  writing_style: string;
  include_subtext: boolean;
  include_storytelling: boolean;
  generate_full_ncp: boolean;
  include_character_sheets: boolean;
  include_world_building: boolean;
  include_chapter_outline: boolean;
  primary_language: string;
}

// Types pour la configuration de génération de personnages
export interface CharacterGenerationConfig {
  name?: string;
  role: string;
  genre: string;
  gender: string;
  detail_level: string;
  personality_type: string;
  creativity: string;
}

// Types pour la configuration de planification de chapitres
export interface ChapterPlanConfig {
  title: string;
  genre: string;
  length: string;
  target_length: string; // Alias pour compatibilité
  structure: string;
  target_audience: string;
  chapters_count: number;
  total_chapters: number; // Alias pour compatibilité
  brief_description: string;
}

// Types de base pour les histoires NCP
export interface NCPStory {
  id: string;
  title: string;
  genre?: string;
  logline?: string;
  narratives: NCPNarrative[];
  created_at: string;
}

export interface NCPNarrative {
  id: string;
  title: string;
  subtext: NCPSubtext;
  storytelling: NCPStorytelling;
}

export interface NCPSubtext {
  perspectives: NCPPerspective[];
  players: NCPPlayer[];
  storypoints: NCPStorypoint[];
  storybeats: NCPStorybeat[];
  dynamics: NCPDynamic[];
}

export interface NCPStorytelling {
  id: string;
  title: string;
  format: string;
  elements: NCPElement[];
}

export interface NCPPerspective {
  id: string;
  title: string;
  description: string;
  point_of_view: string;
}

export interface NCPPlayer {
  id: string;
  name: string;
  role: string;
  description: string;
  motivation: string;
}

export interface NCPStorypoint {
  id: string;
  title: string;
  description: string;
  act: number;
}

export interface NCPStorybeat {
  id: string;
  title: string;
  description: string;
  emotional_value: string;
  storypoint_id: string;
}

export interface NCPDynamic {
  id: string;
  type: string;
  description: string;
  influence: string;
}

export interface NCPElement {
  id: string;
  type: string;
  content: string;
  position: number;
}

// Types pour les résultats générés
export interface GeneratedStory {
  story: NCPStory;
  generated_content: {
    idea: string;
    summary: string;
    characters: string[];
    plot_outline: string;
    themes: string[];
  };
  metadata: {
    generation_time: string;
    config_used: StoryGenerationConfig;
    version: string;
  };
}

export interface GeneratedCharacter {
  id: string;
  name: string;
  role: string;
  background: string;
  personality: string;
  goals: string;
  conflicts: string;
  arc: string;
  physical_description: string;
  relationships: string[];
  generated_at: string;
}

export interface Chapter {
  id: string;
  title: string;
  synopsis: string;
  word_count_target: number;
  themes: string[];
  key_events: string[];
  character_development: string;
  pacing_notes: string;
}

export interface ChapterPlan {
  overall_structure: string;
  chapters: Chapter[];
  total_word_count: number;
  estimated_pages: number;
  generated_at: string;
}
