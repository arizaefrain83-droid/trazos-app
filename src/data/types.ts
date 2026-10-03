export type Difficulty = "Básico" | "Intermedio" | "Avanzado";

export interface Step {
  instruction: string;
  tip?: string;
  /** SVG path data (viewBox 0 0 200 200) added in this step. */
  paths: string[];
}

export interface Lesson {
  id: string;
  title: string;
  difficulty: Difficulty;
  skill: { name: string; description: string };
  steps: Step[];
  checklist: string[];
  extraPractice: string;
}

export interface Course {
  id: string;
  kind: "intro" | "path";
  name: string;
  tagline: string;
  color: string;
  soft: string;
  lessons: Lesson[];
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  stars: number;
  completedAt?: string;
}

export interface JournalEntry {
  id: string;
  uri: string;
  lessonId: string;
  courseId: string;
  createdAt: string;
}

export interface Settings {
  onboarded: boolean;
  name: string;
  interests: string[];
}
