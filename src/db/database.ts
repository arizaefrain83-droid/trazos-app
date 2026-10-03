import * as SQLite from "expo-sqlite";
import { JournalEntry, LessonProgress, Settings } from "../data/types";

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync("trazos.db");
      // Table and column names are kept from the first MVP so existing installs keep their data.
      await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS level_progress (
          level_id TEXT PRIMARY KEY,
          completed INTEGER NOT NULL DEFAULT 0,
          stars INTEGER NOT NULL DEFAULT 0,
          completed_at TEXT
        );
        CREATE TABLE IF NOT EXISTS gallery_photos (
          id TEXT PRIMARY KEY,
          uri TEXT NOT NULL,
          level_id TEXT NOT NULL,
          category_id TEXT NOT NULL,
          created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);
      return db;
    })();
  }
  return dbPromise;
}

type ProgressRow = { level_id: string; completed: number; stars: number; completed_at: string | null };
type PhotoRow = { id: string; uri: string; level_id: string; category_id: string; created_at: string };

export async function loadProgress(): Promise<LessonProgress[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ProgressRow>("SELECT * FROM level_progress");
  return rows.map((r) => ({
    lessonId: r.level_id,
    completed: r.completed === 1,
    stars: r.stars,
    completedAt: r.completed_at ?? undefined,
  }));
}

export async function saveProgress(p: LessonProgress): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT OR REPLACE INTO level_progress (level_id, completed, stars, completed_at) VALUES (?, ?, ?, ?)",
    p.lessonId,
    p.completed ? 1 : 0,
    p.stars,
    p.completedAt ?? null
  );
}

export async function loadJournal(): Promise<JournalEntry[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<PhotoRow>("SELECT * FROM gallery_photos ORDER BY created_at DESC");
  return rows.map((r) => ({
    id: r.id,
    uri: r.uri,
    lessonId: r.level_id,
    courseId: r.category_id,
    createdAt: r.created_at,
  }));
}

export async function insertJournalEntry(e: JournalEntry): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    "INSERT INTO gallery_photos (id, uri, level_id, category_id, created_at) VALUES (?, ?, ?, ?, ?)",
    e.id,
    e.uri,
    e.lessonId,
    e.courseId,
    e.createdAt
  );
}

export async function deleteJournalEntry(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM gallery_photos WHERE id = ?", id);
}

export const DEFAULT_SETTINGS: Settings = { onboarded: false, name: "", interests: [] };

export async function loadSettings(): Promise<Settings> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ value: string }>("SELECT value FROM settings WHERE key = 'app'");
  if (!row) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...(JSON.parse(row.value) as Partial<Settings>) };
}

export async function saveSettings(s: Settings): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("INSERT OR REPLACE INTO settings (key, value) VALUES ('app', ?)", JSON.stringify(s));
}
