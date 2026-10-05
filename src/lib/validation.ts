import { z } from "zod";
import { LEVELS, LIST_KINDS } from "./consensus";

export { MAX_COMPARE } from "./consensus";

const email = z.string().trim().toLowerCase().pipe(z.email("メールアドレスの形式が正しくありません").max(254));

export const handleSchema = z
  .string()
  .trim()
  .min(1, "ハンドルを入力してください")
  .max(30, "ハンドルは30文字以内にしてください");

export const passwordSchema = z
  .string()
  .min(10, "パスワードは10文字以上にしてください")
  .max(128, "パスワードは128文字以内にしてください");

export const signupSchema = z.object({
  email,
  handle: handleSchema,
  password: passwordSchema,
  isAdult: z.boolean(),
  agreed: z.literal(true, "利用規約とプライバシーポリシーへの同意が必要です"),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1).max(128),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "現在のパスワードを入力してください").max(128),
  newPassword: passwordSchema,
});

export const customItemSchema = z.object({
  label: z.string().trim().min(1, "項目名を入力してください").max(60, "項目名は60文字以内にしてください"),
  level: z.enum(LEVELS, "評価を選択してください"),
});

export const levelSchema = z.enum(LEVELS);
export const listKindSchema = z.enum(LIST_KINDS);
export const uuidSchema = z.uuid();

// 共有トークンは randomBytes(16) の base64url（22文字）
export const SHARE_TOKEN_RE = /^[A-Za-z0-9_-]{22}$/;

export type FormState = { error?: string; ok?: string } | undefined;

export function firstError(e: z.ZodError): string {
  return e.issues[0]?.message ?? "入力内容を確認してください";
}

/** ログイン後の遷移先。オープンリダイレクトを防ぐため自サイト内の相対パスのみ許可 */
export function safeNext(next: unknown, fallback = "/my"): string {
  if (typeof next !== "string") return fallback;
  if (!next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}

/** 入力されたテキストから共有URL（またはトークン単体）を抜き出す */
export function extractShareTokens(input: string): string[] {
  const tokens = new Set<string>();
  for (const piece of input.split(/[\s,、]+/)) {
    const m = /(?:^|\/s\/)([A-Za-z0-9_-]{22})(?=$|[?#/])/.exec(piece);
    if (m) tokens.add(m[1]!);
  }
  return [...tokens];
}
