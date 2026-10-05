"use server";

import { redirect } from "next/navigation";
import { db, isUniqueViolation } from "@/db";
import { consensusLists, users } from "@/db/schema";
import { createSession, hashPassword } from "@/lib/auth";
import { LIST_KINDS } from "@/lib/consensus";
import { newShareToken } from "@/lib/lists";
import { firstError, safeNext, signupSchema, type FormState } from "@/lib/validation";

export async function signup(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    handle: formData.get("handle"),
    password: formData.get("password"),
    isAdult: formData.get("isAdult") === "on",
    agreed: formData.get("agreed") === "on",
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const { email, handle, password, isAdult } = parsed.data;
  const passwordHash = await hashPassword(password);

  try {
    const userId = await db.transaction(async (tx) => {
      const [user] = await tx
        .insert(users)
        .values({ email, handle, passwordHash, isAdult })
        .returning({ id: users.id });
      // 成人フラグの有無に関わらず両方のリストを作っておく（成人向けはフラグがないと表示されない）
      await tx
        .insert(consensusLists)
        .values(LIST_KINDS.map((kind) => ({ userId: user!.id, kind, shareToken: newShareToken() })));
      return user!.id;
    });
    await createSession(userId);
  } catch (e) {
    if (isUniqueViolation(e)) return { error: "そのメールアドレスは既に登録されています" };
    throw e;
  }
  redirect(safeNext(formData.get("next")));
}
