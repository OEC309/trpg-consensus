import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
// drizzle-kit からも読み込まれるため相対パスで import する
import { LEVELS, LIST_KINDS } from "../lib/consensus";

const createdAt = () =>
  timestamp("created_at", { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp("updated_at", { withTimezone: true }).notNull().defaultNow();

// ---- ユーザー / 認証 ----

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  // ログインに使う。小文字に正規化して保存する
  email: text("email").notNull().unique(),
  // 表示用の名前。重複可
  handle: text("handle").notNull(),
  passwordHash: text("password_hash").notNull(),
  // 成人フラグ（自己申告）。成人向けリストの表示・編集可否に使う
  isAdult: boolean("is_adult").notNull().default(false),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const authSessions = pgTable(
  "auth_sessions",
  {
    // Cookie に入れるトークンそのものではなく SHA-256 ハッシュを保存する
    id: text("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (t) => [index("auth_sessions_user_idx").on(t.userId)],
);

// ---- コンセンサスリスト ----

export const listKind = pgEnum("list_kind", LIST_KINDS);
export const consentLevel = pgEnum("consent_level", LEVELS);

// ユーザーごとに「通常」「成人向け」を1つずつ持つ
export const consensusLists = pgTable(
  "consensus_lists",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: listKind("kind").notNull(),
    // 共有URL用のランダムトークン（128bit, base64url）。再発行で旧URLを無効化できる
    shareToken: text("share_token").notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("consensus_lists_user_kind_uq").on(t.userId, t.kind)],
);

// デフォルト項目（src/lib/presets.ts）への回答。未回答の項目は行が存在しない
export const presetAnswers = pgTable(
  "preset_answers",
  {
    listId: uuid("list_id")
      .notNull()
      .references(() => consensusLists.id, { onDelete: "cascade" }),
    itemKey: text("item_key").notNull(),
    level: consentLevel("level").notNull(),
    updatedAt: updatedAt(),
  },
  (t) => [primaryKey({ columns: [t.listId, t.itemKey] })],
);

// ユーザーが追加したオリジナル項目
export const customItems = pgTable(
  "custom_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    listId: uuid("list_id")
      .notNull()
      .references(() => consensusLists.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    // normalizeLabel() の結果。比較時はこれが同じ項目を同一とみなす
    labelKey: text("label_key").notNull(),
    level: consentLevel("level").notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("custom_items_list_label_uq").on(t.listId, t.labelKey)],
);

export type User = typeof users.$inferSelect;
export type ConsensusList = typeof consensusLists.$inferSelect;
