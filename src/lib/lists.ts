import "server-only";
import { randomBytes } from "node:crypto";
import { and, asc, eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db";
import { consensusLists, customItems, presetAnswers, users, type ConsensusList } from "@/db/schema";
import type { SessionUser } from "./auth";
import { rowStatus, type Level, type ListKind, type RowStatus } from "./consensus";
import { CUSTOM_CATEGORY, PRESETS } from "./presets";
import { SHARE_TOKEN_RE } from "./validation";

export function newShareToken(): string {
  return randomBytes(16).toString("base64url");
}

/** 共有URLの絶対URL。APP_URL 未設定時はリクエストのホストから組み立てる */
export async function shareUrl(token: string): Promise<string> {
  let base = process.env.APP_URL?.replace(/\/+$/, "");
  if (!base) {
    const h = await headers();
    const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
    base = `${proto}://${host}`;
  }
  return `${base}/s/${token}`;
}

/** そのユーザーが閲覧・編集してよいリスト種別か（成人フラグの判定は必ずサーバー側で行う） */
export function canUseKind(user: Pick<SessionUser, "isAdult"> | null, kind: ListKind): boolean {
  return kind === "general" || !!user?.isAdult;
}

/** 自分のリストを取得する。存在しなければ作成する。成人向けで成人フラグがなければ null */
export async function getOwnList(user: SessionUser, kind: ListKind): Promise<ConsensusList | null> {
  if (!canUseKind(user, kind)) return null;

  const find = () =>
    db
      .select()
      .from(consensusLists)
      .where(and(eq(consensusLists.userId, user.id), eq(consensusLists.kind, kind)));

  let [list] = await find();
  if (!list) {
    await db
      .insert(consensusLists)
      .values({ userId: user.id, kind, shareToken: newShareToken() })
      .onConflictDoNothing();
    [list] = await find();
  }
  return list ?? null;
}

export type CustomItem = { id: string; label: string; labelKey: string; level: Level };
export type ListContent = { presets: Map<string, Level>; customs: CustomItem[] };

export async function getListContent(listId: string): Promise<ListContent> {
  const [answers, customs] = await Promise.all([
    db
      .select({ itemKey: presetAnswers.itemKey, level: presetAnswers.level })
      .from(presetAnswers)
      .where(eq(presetAnswers.listId, listId)),
    db
      .select({
        id: customItems.id,
        label: customItems.label,
        labelKey: customItems.labelKey,
        level: customItems.level,
      })
      .from(customItems)
      .where(eq(customItems.listId, listId))
      .orderBy(asc(customItems.createdAt)),
  ]);
  return { presets: new Map(answers.map((a) => [a.itemKey, a.level])), customs };
}

export type SharedList = {
  id: string;
  kind: ListKind;
  shareToken: string;
  updatedAt: Date;
  ownerHandle: string;
};

/**
 * 共有トークンからリストを取得する（指定順を保つ）。
 * 成人向けリストは持ち主が成人フラグを外していると見つからない扱いにする。
 * 閲覧者側の成人フラグ判定は呼び出し側で canUseKind() を使って行う。
 */
export async function findSharedLists(tokens: readonly string[]): Promise<SharedList[]> {
  const valid = tokens.filter((t) => SHARE_TOKEN_RE.test(t));
  if (valid.length === 0) return [];

  const rows = await db
    .select({
      id: consensusLists.id,
      kind: consensusLists.kind,
      shareToken: consensusLists.shareToken,
      updatedAt: consensusLists.updatedAt,
      ownerHandle: users.handle,
      ownerIsAdult: users.isAdult,
    })
    .from(consensusLists)
    .innerJoin(users, eq(users.id, consensusLists.userId))
    .where(inArray(consensusLists.shareToken, valid));

  const byToken = new Map(
    rows
      .filter((r) => r.kind === "general" || r.ownerIsAdult)
      .map(({ ownerIsAdult: _, ...r }) => [r.shareToken, r]),
  );
  return valid.flatMap((t) => byToken.get(t) ?? []);
}

export type ComparisonRow = {
  key: string;
  category: string;
  label: string;
  levels: (Level | null)[];
  status: RowStatus;
};

/**
 * 比較表を組み立てる。
 * デフォルト項目は key で、オリジナル項目は正規化した名称で同一判定する。
 * 誰かが未回答・未設定の項目は status = "missing"（比較評価しない）。
 */
export function buildComparison(kind: ListKind, contents: readonly ListContent[]): ComparisonRow[] {
  const rows: ComparisonRow[] = PRESETS[kind].map((p) => {
    const levels = contents.map((c) => c.presets.get(p.key) ?? null);
    return { key: `p:${p.key}`, category: p.category, label: p.label, levels, status: rowStatus(levels) };
  });

  // オリジナル項目は最初に現れた人の表記を表示名にする
  const customLabels = new Map<string, string>();
  for (const c of contents) {
    for (const item of c.customs) {
      if (!customLabels.has(item.labelKey)) customLabels.set(item.labelKey, item.label);
    }
  }
  const customLevels = contents.map((c) => new Map(c.customs.map((i) => [i.labelKey, i.level])));
  for (const [labelKey, label] of customLabels) {
    const levels = customLevels.map((m) => m.get(labelKey) ?? null);
    rows.push({ key: `c:${labelKey}`, category: CUSTOM_CATEGORY, label, levels, status: rowStatus(levels) });
  }
  return rows;
}
