"use client";

import { Trash2Icon } from "lucide-react";
import { useActionState } from "react";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Button } from "@/components/ui/button";
import { useFormToast } from "@/hooks/use-form-toast";
import type { ListKind } from "@/lib/consensus";
import { deleteCustomItem, regenerateShareToken, saveList } from "./actions";

/** 回答をまとめて保存するフォーム。中身（項目の行）はサーバー側で描画して children で受け取る */
export function SaveListForm({ kind, children }: { kind: ListKind; children: React.ReactNode }) {
  const [state, action, pending] = useActionState(saveList.bind(null, kind), undefined);
  useFormToast(state);

  return (
    <form action={action} className="space-y-6">
      {children}
      <div className="sticky bottom-4 z-30 flex justify-end">
        <Button type="submit" size="lg" disabled={pending} className="shadow-lg">
          {pending ? "保存中…" : "回答を保存する"}
        </Button>
      </div>
    </form>
  );
}

export function DeleteCustomItemButton({ kind, id, label }: { kind: ListKind; id: string; label: string }) {
  return (
    <ConfirmButton
      variant="ghost"
      size="icon-sm"
      aria-label={`「${label}」を削除`}
      title={`「${label}」を削除しますか？`}
      description="この項目と回答が削除されます。元に戻せません。"
      confirmLabel="削除する"
      destructive
      action={deleteCustomItem.bind(null, kind, id)}
    >
      <Trash2Icon className="text-muted-foreground" />
    </ConfirmButton>
  );
}

export function RegenerateShareTokenButton({ kind }: { kind: ListKind }) {
  return (
    <ConfirmButton
      variant="link"
      size="sm"
      className="h-auto px-0 text-muted-foreground"
      title="共有URLを再発行しますか？"
      description="新しいURLが発行され、今までのURLは使えなくなります。共有済みの相手には新しいURLを伝え直してください。"
      confirmLabel="再発行する"
      destructive
      action={regenerateShareToken.bind(null, kind)}
    >
      共有URLを再発行する
    </ConfirmButton>
  );
}
