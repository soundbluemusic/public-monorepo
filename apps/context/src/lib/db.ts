import Dexie, { type EntityTable } from "dexie";
import { validateId } from "@soundblue/shared";

// 즐겨찾기 단어
export interface FavoriteEntry {
  id?: number;
  entryId: string;
  addedAt: Date;
}

// 학습 기록
export interface StudyRecord {
  id?: number;
  entryId: string;
  studiedAt: Date;
  correct: boolean;
}

// 사용자 설정
export interface UserSettings {
  id: number; // 항상 1 (싱글톤)
  theme: "light" | "dark" | "system";
  language: "ko" | "en" | "ja";
  fontSize: "small" | "medium" | "large";
  updatedAt: Date;
}

// Typed Dexie database class
class ContextDatabase extends Dexie {
  favorites!: EntityTable<FavoriteEntry, "id">;
  studyRecords!: EntityTable<StudyRecord, "id">;
  settings!: EntityTable<UserSettings, "id">;

  constructor() {
    super("ContextDB");
    this.version(1).stores({
      favorites: "++id, entryId, addedAt",
      studyRecords: "++id, entryId, studiedAt",
      settings: "id",
    });
  }
}

const db = new ContextDatabase();

export { db };

// 헬퍼 함수들
export const favorites = {
  async add(entryId: string) {
    validateId(entryId, "entryId");
    const exists = await db.favorites.where("entryId").equals(entryId).first();
    if (exists) return exists.id;
    return db.favorites.add({ entryId, addedAt: new Date() });
  },

  async remove(entryId: string) {
    validateId(entryId, "entryId");
    return db.favorites.where("entryId").equals(entryId).delete();
  },

  async toggle(entryId: string) {
    validateId(entryId, "entryId");
    const exists = await db.favorites.where("entryId").equals(entryId).first();
    if (exists) {
      await db.favorites.delete(exists.id!);
      return false;
    }
    await db.favorites.add({ entryId, addedAt: new Date() });
    return true;
  },

  async isFavorite(entryId: string) {
    validateId(entryId, "entryId");
    const exists = await db.favorites.where("entryId").equals(entryId).first();
    return !!exists;
  },

  async getAll() {
    return db.favorites.orderBy("addedAt").reverse().toArray();
  },

  async count() {
    return db.favorites.count();
  },
};

export const studyRecords = {
  async add(entryId: string, correct: boolean) {
    validateId(entryId, "entryId");
    return db.studyRecords.add({
      entryId,
      studiedAt: new Date(),
      correct,
    });
  },

  async getByEntry(entryId: string) {
    validateId(entryId, "entryId");
    return db.studyRecords.where("entryId").equals(entryId).toArray();
  },

  async getRecent(limit = 50) {
    return db.studyRecords.orderBy("studiedAt").reverse().limit(limit).toArray();
  },

  async getStats(entryId: string) {
    validateId(entryId, "entryId");
    const records = await db.studyRecords
      .where("entryId")
      .equals(entryId)
      .toArray();
    const total = records.length;
    const correct = records.filter((r) => r.correct).length;
    return {
      total,
      correct,
      accuracy: total > 0 ? (correct / total) * 100 : 0,
    };
  },
};

export const settings = {
  async get(): Promise<UserSettings> {
    const s = await db.settings.get(1);
    return (
      s || {
        id: 1,
        theme: "system",
        language: "ko",
        fontSize: "medium",
        updatedAt: new Date(),
      }
    );
  },

  async update(updates: Partial<Omit<UserSettings, "id">>) {
    const current = await this.get();
    return db.settings.put({
      ...current,
      ...updates,
      id: 1,
      updatedAt: new Date(),
    });
  },

  async setTheme(theme: UserSettings["theme"]) {
    return this.update({ theme });
  },

  async setLanguage(language: UserSettings["language"]) {
    return this.update({ language });
  },

  async setFontSize(fontSize: UserSettings["fontSize"]) {
    return this.update({ fontSize });
  },
};
