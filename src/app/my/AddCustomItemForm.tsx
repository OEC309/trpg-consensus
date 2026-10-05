"use client";

import { useActionState, useState } from "react";
import { FormError } from "@/components/FormMessage";
import { LevelToggle } from "@/components/LevelToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormToast } from "@/hooks/use-form-toast";
import type { ListKind } from "@/lib/consensus";
import { addCustomItem } from "./actions";

export function AddCustomItemForm({ kind }: { kind: ListKind }) {
  // 追加に成功したらフォームを作り直して入力欄と評価をリセットする
  const [formKey, setFormKey] = useState(0);
  const [state, action, pending] = useActionState(addCustomItem.bind(null, kind), undefined);
  useFormToast(state, () => setFormKey((k) => k + 1));

  return (
    <form key={formKey} action={action} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="custom-label">項目名</Label>
        <Input id="custom-label" name="label" placeholder="例: 時間ループもの" maxLength={60} required />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <LevelToggle name="level" defaultValue={null} label="評価" />
        <Button type="submit" disabled={pending}>追加する</Button>
      </div>
      <FormError message={state?.error} />
    </form>
  );
}
