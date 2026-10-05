"use client";

import { useActionState } from "react";
import { startCompare } from "@/app/compare/actions";
import { MAX_COMPARE } from "@/lib/consensus";

export function CompareForm({ defaultValue = "" }: { defaultValue?: string }) {
  const [state, action, pending] = useActionState(startCompare, undefined);

  return (
    <form action={action} className="stack">
      <label>
        比較したい人の共有URL（1行に1つ、最大{MAX_COMPARE}人）
        <textarea name="urls" rows={5} defaultValue={defaultValue} required />
      </label>
      <p className="muted">通常リストと成人向けリストは混ぜずに、同じ種類のリスト同士で比較してください。</p>
      {state?.error && <p className="error">{state.error}</p>}
      <button type="submit" disabled={pending}>比較する</button>
    </form>
  );
}
