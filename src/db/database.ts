import * as SQLite from "expo-sqlite";
import { LevelProgress, GalleryPhoto } from "../data/types";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("trazos.db");
    await initDatabase(db);
  }
  return db;
}

async function initDatabase(db: SQLite.SQLiteDatabase) {
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
  `);
}

export async function getLevelProgress(levelId: string): Promise<LevelProgress | null> {
  const database = await getDatabase();
  const row = await database.getFirstAsync<{
    level_id: string;
    completed: number;
    stars: number;
    completed_at: string | null;
  }>("SELECT * FROM level_progress WHERE level_id = ?", levelId);

  if (!row) return null;
  return {
    levelId: row.level_id,
    completed: row.completed === 1,
    stars: row.stars,
    completedAt: row.completed_at ?? undefined,
  };
}

export async function getAllLevelProgress(): Promise<LevelProgress[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{
    level_id: string;
    completed: number;
    stars: number;
    completed_at: string | null;
  }>("SELECT * FROM level_progress");

  return rows.map((row) => ({
    levelId: row.level_id,
    completed: row.completed === 1,
    stars: row.stars,
    completedAt: row.completed_at ?? undefined,
  }));
}

export async function saveLevelProgress(progress: LevelProgress): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT OR REPLACE INTO level_progress (level_id, completed, stars, completed_at)
     VALUES (?, ?, ?, ?)`,
    progress.levelId,
    progress.completed ? 1 : 0,
    progress.stars,
    progress.completedAt ?? null
  );
}

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const database = await getDatabase();
  const rows = await database.getAllAsync<{
    id: string;
    uri: string;
    level_id: string;
    category_id: string;
    created_at: string;
  }>("SELECT * FROM gallery_photos ORDER BY created_at DESC");

  return rows.map((row) => ({
    id: row.id,
    uri: row.uri,
    levelId: row.level_id,
    categoryId: row.category_id,
    createdAt: row.created_at,
  }));
}

export async function saveGalleryPhoto(photo: GalleryPhoto): Promise<void> {
  const database = await getDatabase();
  await database.runAsync(
    `INSERT INTO gallery_photos (id, uri, level_id, category_id, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    photo.id,
    photo.uri,
    photo.levelId,
    photo.categoryId,
    photo.createdAt
  );
}

export async function deleteGalleryPhoto(id: string): Promise<void> {
  const database = await getDatabase();
  await database.runAsync("DELETE FROM gallery_photos WHERE id = ?", id);
}
