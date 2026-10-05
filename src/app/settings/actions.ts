"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { hashPassword, requireUser, rotateAllSessions, verifyPassword } from "@/lib/auth";
import { changePasswordSchema, firstError, handleSchema, type FormState } from "@/lib/validation";

export async function updateHandle(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const handle = handleSchema.safeParse(formData.get("handle"));
  if (!handle.success) return { error: firstError(handle.error) };

  await db.update(users).set({ handle: handle.data, updatedAt: new Date() }).where(eq(users.id, user.id));
  revalidatePath("/", "layout");
  return { ok: "ハンドルを変更しました" };
}

export async function updateAdult(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const isAdult = formData.get("isAdult") === "on";

  await db.update(users).set({ isAdult, updatedAt: new Date() }).where(eq(users.id, user.id));
  revalidatePath("/", "layout");
  return { ok: isAdult ? "成人フラグを有効にしました" : "成人フラグを無効にしました" };
}

export async function changePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const [row] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id));
  if (!row || !(await verifyPassword(row.passwordHash, parsed.data.currentPassword))) {
    return { error: "現在のパスワードが違います" };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await db.update(users).set({ passwordHash, updatedAt: new Date() }).where(eq(users.id, user.id));
  // 他の端末のログインは全て解除する
  await rotateAllSessions(user.id);
  return { ok: "パスワードを変更しました。他の端末ではログアウトされます" };
}
