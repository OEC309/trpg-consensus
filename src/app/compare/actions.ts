"use server";

import { redirect } from "next/navigation";
import { extractShareTokens, MAX_COMPARE, type FormState } from "@/lib/validation";

export async function startCompare(_prev: FormState, formData: FormData): Promise<FormState> {
  const tokens = extractShareTokens(String(formData.get("urls") ?? ""));
  if (tokens.length === 0) return { error: "共有URLを入力してください" };
  if (tokens.length > MAX_COMPARE) return { error: `一度に比較できるのは${MAX_COMPARE}人までです` };

  const query = new URLSearchParams(tokens.map((t) => ["t", t]));
  redirect(`/compare?${query}`);
}
