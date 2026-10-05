"use client";

import { useActionState } from "react";
import { LEVEL_LABEL, LEVELS, type ListKind } from "@/lib/consensus";
import { addCustomItem } from "./actions";

export function AddCustomItemForm({ kind }: { kind: ListKind }) {
  const [state, action, pending] = useActionState(addCustomItem.bind(null, kind), undefined);

  return (
    <form action={action} className="stack">
      <div className="row">
        <input name="label" placeholder="項目名（例: 時間ループもの）" maxLength={60} required style={{ flex: 1, minWidth: 200 }} />
        <select name="level" required defaultValue="">
          <option value="" disabled>評価</option>
          {LEVELS.map((lv) => (
            <option key={lv} value={lv}>{LEVEL_LABEL[lv]}</option>
          ))}
        </select>
        <button type="submit" disabled={pending}>追加</button>
      </div>
      {state?.error && <p className="error">{state.error}</p>}
      {state?.ok && <p className="success">{state.ok}</p>}
    </form>
  );
}
