import Dexie, { type EntityTable } from "dexie";

// 즐겨찾기 라이브러리
export interface FavoriteLibrary {
  id?: number;
  libraryId: string;
  addedAt: Date;
}

// 즐겨찾기 Web API
export interface FavoriteWebApi {
  id?: number;
  apiId: string;
  addedAt: Date;
}

// 사용자 설정
export interface UserSettings {
  id: number; // 항상 1 (싱글톤)
  theme: "light" | "dark" | "system";
  language: "ko" | "en";
  updatedAt: Date;
}

// 최근 본 항목
export interface RecentView {
  id?: number;
  type: "library" | "webapi";
  itemId: string;
  viewedAt: Date;
}

// Typed Dexie database class
class PermissiveDatabase extends Dexie {
  favoriteLibraries!: EntityTable<FavoriteLibrary, "id">;
  favoriteWebApis!: EntityTable<FavoriteWebApi, "id">;
  settings!: EntityTable<UserSettings, "id">;
  recentViews!: EntityTable<RecentView, "id">;

  constructor() {
    super("PermissiveDB");
    this.version(1).stores({
      favoriteLibraries: "++id, libraryId, addedAt",
      favoriteWebApis: "++id, apiId, addedAt",
      settings: "id",
      recentViews: "++id, [type+itemId], viewedAt",
    });
  }
}

const db = new PermissiveDatabase();

export { db };

// Input validation constants
const MAX_ID_LENGTH = 100;

// Validate ID input to prevent abuse
function validateId(id: string, fieldName: string): void {
  if (!id || typeof id !== "string") {
    throw new Error(`${fieldName} is required`);
  }
  if (id.length > MAX_ID_LENGTH) {
    throw new Error(`${fieldName} exceeds maximum length of ${MAX_ID_LENGTH}`);
  }
  // Prevent prototype pollution attempts
  if (id === "__proto__" || id === "constructor" || id === "prototype") {
    throw new Error(`Invalid ${fieldName}`);
  }
}

// 라이브러리 즐겨찾기 헬퍼
export const favoriteLibraries = {
  async add(libraryId: string) {
    validateId(libraryId, "libraryId");
    const exists = await db.favoriteLibraries
      .where("libraryId")
      .equals(libraryId)
      .first();
    if (exists) return exists.id;
    return db.favoriteLibraries.add({ libraryId, addedAt: new Date() });
  },

  async remove(libraryId: string) {
    validateId(libraryId, "libraryId");
    return db.favoriteLibraries.where("libraryId").equals(libraryId).delete();
  },

  async toggle(libraryId: string) {
    validateId(libraryId, "libraryId");
    const exists = await db.favoriteLibraries
      .where("libraryId")
      .equals(libraryId)
      .first();
    if (exists) {
      await db.favoriteLibraries.delete(exists.id!);
      return false;
    }
    await db.favoriteLibraries.add({ libraryId, addedAt: new Date() });
    return true;
  },

  async isFavorite(libraryId: string) {
    validateId(libraryId, "libraryId");
    const exists = await db.favoriteLibraries
      .where("libraryId")
      .equals(libraryId)
      .first();
    return !!exists;
  },

  async getAll() {
    return db.favoriteLibraries.orderBy("addedAt").reverse().toArray();
  },

  async count() {
    return db.favoriteLibraries.count();
  },
};

// Web API 즐겨찾기 헬퍼
export const favoriteWebApis = {
  async add(apiId: string) {
    validateId(apiId, "apiId");
    const exists = await db.favoriteWebApis
      .where("apiId")
      .equals(apiId)
      .first();
    if (exists) return exists.id;
    return db.favoriteWebApis.add({ apiId, addedAt: new Date() });
  },

  async remove(apiId: string) {
    validateId(apiId, "apiId");
    return db.favoriteWebApis.where("apiId").equals(apiId).delete();
  },

  async toggle(apiId: string) {
    validateId(apiId, "apiId");
    const exists = await db.favoriteWebApis
      .where("apiId")
      .equals(apiId)
      .first();
    if (exists) {
      await db.favoriteWebApis.delete(exists.id!);
      return false;
    }
    await db.favoriteWebApis.add({ apiId, addedAt: new Date() });
    return true;
  },

  async isFavorite(apiId: string) {
    validateId(apiId, "apiId");
    const exists = await db.favoriteWebApis
      .where("apiId")
      .equals(apiId)
      .first();
    return !!exists;
  },

  async getAll() {
    return db.favoriteWebApis.orderBy("addedAt").reverse().toArray();
  },

  async count() {
    return db.favoriteWebApis.count();
  },
};

// 사용자 설정 헬퍼
export const settings = {
  async get(): Promise<UserSettings> {
    const s = await db.settings.get(1);
    return (
      s || {
        id: 1,
        theme: "system",
        language: "ko",
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
};

// 최근 본 항목 헬퍼
export const recentViews = {
  async add(type: RecentView["type"], itemId: string) {
    validateId(itemId, "itemId");
    // 기존 기록 삭제 후 새로 추가 (최신으로 업데이트)
    await db.recentViews.where({ type, itemId }).delete();
    return db.recentViews.add({ type, itemId, viewedAt: new Date() });
  },

  async getRecent(type?: RecentView["type"], limit = 20) {
    let query = db.recentViews.orderBy("viewedAt").reverse();
    if (type) {
      const items = await query.toArray();
      return items.filter((item) => item.type === type).slice(0, limit);
    }
    return query.limit(limit).toArray();
  },

  async clear(type?: RecentView["type"]) {
    if (type) {
      const items = await db.recentViews.toArray();
      const idsToDelete = items
        .filter((item) => item.type === type)
        .map((item) => item.id!);
      return db.recentViews.bulkDelete(idsToDelete);
    }
    return db.recentViews.clear();
  },
};
