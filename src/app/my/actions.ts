"use server";

import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import { db, isUniqueViolation } from "@/db";
import { consensusLists, customItems, presetAnswers } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { normalizeLabel, type Level } from "@/lib/consensus";
import { getOwnList, newShareToken } from "@/lib/lists";
import { PRESETS } from "@/lib/presets";
import {
  customItemSchema,
  firstError,
  levelSchema,
  listKindSchema,
  uuidSchema,
  type FormState,
} from "@/lib/validation";

const MAX_CUSTOM_ITEMS = 100;

/** 自分のリストを取得。成人向けリストに成人フラグなしでアクセスした場合も 404 にする */
async function requireOwnList(kind: string) {
  const user = await requireUser();
  const k = listKindSchema.safeParse(kind);
  if (!k.success) notFound();
  const list = await getOwnList(user, k.data);
  if (!list) notFound();
  return list;
}

function touch(listId: string) {
  return db.update(consensusLists).set({ updatedAt: new Date() }).where(eq(consensusLists.id, listId));
}

export async function saveList(kind: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const list = await requireOwnList(kind);

  const upserts: { listId: string; itemKey: string; level: Level }[] = [];
  const cleared: string[] = [];
  for (const p of PRESETS[list.kind]) {
    const value = formData.get(`p:${p.key}`);
    const level = levelSchema.safeParse(value);
    if (level.success) upserts.push({ listId: list.id, itemKey: p.key, level: level.data });
    else if (value === "") cleared.push(p.key);
  }

  const customs = await db
    .select({ id: customItems.id })
    .from(customItems)
    .where(eq(customItems.listId, list.id));
  const customUpdates = customs.flatMap(({ id }) => {
    const level = levelSchema.safeParse(formData.get(`c:${id}`));
    return level.success ? [{ id, level: level.data }] : [];
  });

  await db.transaction(async (tx) => {
    if (upserts.length > 0) {
      await tx
        .insert(presetAnswers)
        .values(upserts)
        .onConflictDoUpdate({
          target: [presetAnswers.listId, presetAnswers.itemKey],
          set: { level: sql`excluded.level`, updatedAt: sql`now()` },
        });
    }
    if (cleared.length > 0) {
      await tx
        .delete(presetAnswers)
        .where(and(eq(presetAnswers.listId, list.id), inArray(presetAnswers.itemKey, cleared)));
    }
    for (const { id, level } of customUpdates) {
      await tx
        .update(customItems)
        .set({ level })
        .where(and(eq(customItems.id, id), eq(customItems.listId, list.id)));
    }
    await tx.update(consensusLists).set({ updatedAt: new Date() }).where(eq(consensusLists.id, list.id));
  });

  revalidatePath(`/my/${list.kind}`);
  return { ok: "保存しました" };
}

export async function addCustomItem(kind: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const list = await requireOwnList(kind);
  const parsed = customItemSchema.safeParse({
    label: formData.get("label"),
    level: formData.get("level"),
  });
  if (!parsed.success) return { error: firstError(parsed.error) };

  const labelKey = normalizeLabel(parsed.data.label);
  if (PRESETS[list.kind].some((p) => normalizeLabel(p.label) === labelKey)) {
    return { error: "同じ名前のデフォルト項目があります" };
  }

  const existing = await db.$count(customItems, eq(customItems.listId, list.id));
  if (existing >= MAX_CUSTOM_ITEMS) {
    return { error: `オリジナル項目は${MAX_CUSTOM_ITEMS}件までです` };
  }

  try {
    await db.insert(customItems).values({ listId: list.id, label: parsed.data.label, labelKey, level: parsed.data.level });
  } catch (e) {
    if (isUniqueViolation(e)) return { error: "同じ名前のオリジナル項目が既にあります" };
    throw e;
  }
  await touch(list.id);
  revalidatePath(`/my/${list.kind}`);
  return { ok: `「${parsed.data.label}」を追加しました` };
}

export async function deleteCustomItem(kind: string, itemId: string): Promise<void> {
  const list = await requireOwnList(kind);
  const id = uuidSchema.safeParse(itemId);
  if (!id.success) return;

  await db.delete(customItems).where(and(eq(customItems.id, id.data), eq(customItems.listId, list.id)));
  await touch(list.id);
  revalidatePath(`/my/${list.kind}`);
}

/** 共有URLを作り直す。旧URLは即座に無効になる */
export async function regenerateShareToken(kind: string): Promise<void> {
  const list = await requireOwnList(kind);
  await db.update(consensusLists).set({ shareToken: newShareToken() }).where(eq(consensusLists.id, list.id));
  revalidatePath("/my", "layout");
}
