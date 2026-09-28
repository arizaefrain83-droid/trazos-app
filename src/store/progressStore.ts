import { create } from "zustand";
import { LevelProgress, GalleryPhoto } from "../data/types";
import {
  getAllLevelProgress,
  saveLevelProgress,
  getGalleryPhotos,
  saveGalleryPhoto,
  deleteGalleryPhoto,
} from "../db/database";

interface ProgressState {
  levelProgress: Record<string, LevelProgress>;
  gallery: GalleryPhoto[];
  initialized: boolean;

  init: () => Promise<void>;
  completeLevel: (levelId: string, stars: number) => Promise<void>;
  addPhoto: (photo: GalleryPhoto) => Promise<void>;
  removePhoto: (id: string) => Promise<void>;
  isLevelUnlocked: (categoryId: string, levelIndex: number) => boolean;
  getLevelStars: (levelId: string) => number;
  isLevelCompleted: (levelId: string) => boolean;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  levelProgress: {},
  gallery: [],
  initialized: false,

  init: async () => {
    const [progress, photos] = await Promise.all([
      getAllLevelProgress(),
      getGalleryPhotos(),
    ]);

    const progressMap: Record<string, LevelProgress> = {};
    for (const p of progress) {
      progressMap[p.levelId] = p;
    }

    set({ levelProgress: progressMap, gallery: photos, initialized: true });
  },

  completeLevel: async (levelId: string, stars: number) => {
    const existing = get().levelProgress[levelId];
    const newStars = Math.max(existing?.stars ?? 0, stars);
    const progress: LevelProgress = {
      levelId,
      completed: true,
      stars: newStars,
      completedAt: new Date().toISOString(),
    };
    await saveLevelProgress(progress);
    set((state) => ({
      levelProgress: { ...state.levelProgress, [levelId]: progress },
    }));
  },

  addPhoto: async (photo: GalleryPhoto) => {
    await saveGalleryPhoto(photo);
    set((state) => ({ gallery: [photo, ...state.gallery] }));
  },

  removePhoto: async (id: string) => {
    await deleteGalleryPhoto(id);
    set((state) => ({ gallery: state.gallery.filter((p) => p.id !== id) }));
  },

  isLevelUnlocked: (categoryId: string, levelIndex: number) => {
    if (levelIndex === 0) return true;
    const { levelProgress } = get();
    // Build the levelId for the previous level in this category
    const { CATEGORIES } = require("../data/categories");
    const category = CATEGORIES.find((c: { id: string }) => c.id === categoryId);
    if (!category) return false;
    const prevLevel = category.levels[levelIndex - 1];
    return levelProgress[prevLevel.id]?.completed === true;
  },

  getLevelStars: (levelId: string) => {
    return get().levelProgress[levelId]?.stars ?? 0;
  },

  isLevelCompleted: (levelId: string) => {
    return get().levelProgress[levelId]?.completed === true;
  },
}));
