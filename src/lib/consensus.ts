// サーバー・クライアント両方から使う定数と純粋関数（DB に依存しない）

export const LEVELS = ["love", "like", "neutral", "ask", "ng"] as const;
export type Level = (typeof LEVELS)[number];

export const LEVEL_LABEL: Record<Level, string> = {
  love: "大歓迎",
  like: "好き",
  neutral: "普通",
  ask: "要相談",
  ng: "NG",
};

export const LIST_KINDS = ["general", "adult"] as const;
export type ListKind = (typeof LIST_KINDS)[number];

export const LIST_KIND_LABEL: Record<ListKind, string> = {
  general: "通常リスト",
  adult: "成人向けリスト",
};

/** 一度に比較できるリストの最大数 */
export const MAX_COMPARE = 12;

/**
 * オリジナル項目の同一判定用キー。
 * 全角/半角・大文字/小文字・前後や連続する空白の違いは同じ名称として扱う。
 */
export function normalizeLabel(label: string): string {
  return label.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

/**
 * 比較表の行の判定。
 * - missing: 回答していない人がいる（比較評価しない）
 * - ng: 1人でも NG
 * - ask: 1人でも要相談
 * - good: 全員が好き以上
 * - neutral: それ以外（普通が含まれる）
 */
export type RowStatus = "missing" | "ng" | "ask" | "good" | "neutral";

export function rowStatus(levels: readonly (Level | null)[]): RowStatus {
  if (levels.some((l) => l === null)) return "missing";
  if (levels.includes("ng")) return "ng";
  if (levels.includes("ask")) return "ask";
  if (levels.every((l) => l === "love" || l === "like")) return "good";
  return "neutral";
}
