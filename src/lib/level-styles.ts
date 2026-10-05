import type { Level, RowStatus } from "./consensus";

// Tailwind のクラス名は完全な文字列でソースに書く必要があるため、ここにまとめて定義する

/** 評価バッジ（表示用） */
export const LEVEL_BADGE_CLASS: Record<Level, string> = {
  love: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-emerald-950",
  like: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200",
  neutral: "bg-muted text-muted-foreground",
  ask: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
  ng: "bg-red-600 text-white dark:bg-red-500 dark:text-red-950",
};

/** 評価トグルの選択中スタイル */
export const LEVEL_TOGGLE_ON_CLASS: Record<Level, string> = {
  love: "data-[state=on]:bg-emerald-600 data-[state=on]:text-white data-[state=on]:border-emerald-600 dark:data-[state=on]:bg-emerald-500 dark:data-[state=on]:text-emerald-950",
  like: "data-[state=on]:bg-emerald-100 data-[state=on]:text-emerald-800 data-[state=on]:border-emerald-300 dark:data-[state=on]:bg-emerald-900/60 dark:data-[state=on]:text-emerald-200 dark:data-[state=on]:border-emerald-700",
  neutral: "data-[state=on]:bg-zinc-200 data-[state=on]:text-zinc-800 data-[state=on]:border-zinc-300 dark:data-[state=on]:bg-zinc-700 dark:data-[state=on]:text-zinc-100 dark:data-[state=on]:border-zinc-600",
  ask: "data-[state=on]:bg-amber-100 data-[state=on]:text-amber-800 data-[state=on]:border-amber-300 dark:data-[state=on]:bg-amber-900/60 dark:data-[state=on]:text-amber-200 dark:data-[state=on]:border-amber-700",
  ng: "data-[state=on]:bg-red-600 data-[state=on]:text-white data-[state=on]:border-red-600 dark:data-[state=on]:bg-red-500 dark:data-[state=on]:text-red-950",
};

/** 比較表の行の背景。1列目を sticky にしているので、透過しない色にすること */
export const STATUS_ROW_CLASS: Record<RowStatus, string> = {
  ng: "bg-red-50 dark:bg-red-950",
  ask: "bg-amber-50 dark:bg-amber-950",
  good: "bg-emerald-50 dark:bg-emerald-950",
  neutral: "bg-card",
  missing: "bg-zinc-100 text-muted-foreground dark:bg-zinc-800",
};

/** 凡例の色見本 */
export const STATUS_SWATCH_CLASS: Record<RowStatus, string> = {
  ng: "bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-800",
  ask: "bg-amber-100 border-amber-300 dark:bg-amber-950 dark:border-amber-800",
  good: "bg-emerald-100 border-emerald-300 dark:bg-emerald-950 dark:border-emerald-800",
  neutral: "bg-card border-border",
  missing: "bg-zinc-100 border-zinc-300 dark:bg-zinc-800 dark:border-zinc-600",
};

export const STATUS_LABEL: Record<RowStatus, string> = {
  ng: "1人でも NG",
  ask: "1人でも要相談",
  good: "全員が好き以上",
  neutral: "上記以外",
  missing: "未回答・未設定の人がいる（判定なし）",
};
