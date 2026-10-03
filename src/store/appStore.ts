import { create } from "zustand";
import { JournalEntry, LessonProgress, Settings } from "../data/types";
import * as db from "../db/database";
import { deletePhotoFile, persistPhoto } from "../db/photos";

interface AppState {
  ready: boolean;
  settings: Settings;
  progress: Record<string, LessonProgress>;
  journal: JournalEntry[];

  init: () => Promise<void>;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
  completeLesson: (lessonId: string, stars: number) => Promise<void>;
  addJournalEntry: (photoUri: string, lessonId: string, courseId: string) => Promise<void>;
  removeJournalEntry: (id: string) => Promise<void>;
}

const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const useAppStore = create<AppState>((set, get) => ({
  ready: false,
  settings: db.DEFAULT_SETTINGS,
  progress: {},
  journal: [],

  init: async () => {
    const [settings, rows, journal] = await Promise.all([db.loadSettings(), db.loadProgress(), db.loadJournal()]);
    const progress: Record<string, LessonProgress> = {};
    for (const p of rows) progress[p.lessonId] = p;
    set({ settings, progress, journal, ready: true });
  },

  updateSettings: async (patch) => {
    const settings = { ...get().settings, ...patch };
    await db.saveSettings(settings);
    set({ settings });
  },

  completeLesson: async (lessonId, stars) => {
    const prev = get().progress[lessonId];
    const p: LessonProgress = {
      lessonId,
      completed: true,
      stars: Math.max(prev?.stars ?? 0, stars),
      completedAt: new Date().toISOString(),
    };
    await db.saveProgress(p);
    set((s) => ({ progress: { ...s.progress, [lessonId]: p } }));
  },

  addJournalEntry: async (photoUri, lessonId, courseId) => {
    const id = newId();
    const uri = await persistPhoto(photoUri, id);
    const entry: JournalEntry = { id, uri, lessonId, courseId, createdAt: new Date().toISOString() };
    await db.insertJournalEntry(entry);
    set((s) => ({ journal: [entry, ...s.journal] }));
  },

  removeJournalEntry: async (id) => {
    const entry = get().journal.find((e) => e.id === id);
    await db.deleteJournalEntry(id);
    if (entry) deletePhotoFile(entry.uri);
    set((s) => ({ journal: s.journal.filter((e) => e.id !== id) }));
  },
}));
