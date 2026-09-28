export type DifficultyLevel = "Básico" | "Intermedio" | "Avanzado";

export interface Step {
  id: number;
  instruction: string;
  imageKey: string; // placeholder key for image
}

export interface Level {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  steps: Step[];
  stars: number; // 1-3 stars awarded on completion
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  color: string;
  levels: Level[];
}

export interface LevelProgress {
  levelId: string;
  completed: boolean;
  stars: number;
  completedAt?: string;
}

export interface GalleryPhoto {
  id: string;
  uri: string;
  levelId: string;
  categoryId: string;
  createdAt: string;
}
