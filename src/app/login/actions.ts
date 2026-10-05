"use server";

import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword, verifyPassword } from "@/lib/auth";
import { loginSchema, safeNext, type FormState } from "@/lib/validation";

const INVALID = { error: "メールアドレスまたはパスワードが違います" };

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return INVALID;

  const { email, password } = parsed.data;
  const [user] = await db
    .select({ id: users.id, passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.email, email));

  if (!user) {
    // ユーザーの有無を応答時間から推測されにくくするため、同程度の計算を行う
    await hashPassword(password);
    return INVALID;
  }
  if (!(await verifyPassword(user.passwordHash, password))) return INVALID;

  await createSession(user.id);
  redirect(safeNext(formData.get("next")));
}
