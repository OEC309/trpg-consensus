"use client";

import { startTransition, useActionState, useState } from "react";
import { FormError } from "@/components/FormMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFormToast } from "@/hooks/use-form-toast";
import { changePassword, updateAdult, updateHandle } from "./actions";

export function HandleForm({ handle }: { handle: string }) {
  const [state, action, pending] = useActionState(updateHandle, undefined);
  useFormToast(state);
  return (
    <form action={action} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="handle">ハンドル（30文字以内）</Label>
        <Input id="handle" name="handle" defaultValue={handle} maxLength={30} required />
      </div>
      <FormError message={state?.error} />
      <Button type="submit" disabled={pending} className="justify-self-end">変更する</Button>
    </form>
  );
}

export function AdultForm({ isAdult }: { isAdult: boolean }) {
  const [state, action, pending] = useActionState(updateAdult, undefined);
  useFormToast(state);
  return (
    // action 属性で送ると React が送信後にフォームをリセットし、Radix の Checkbox が
    // マウント時の値に戻ってしまうため、onSubmit から送信する
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => action(formData));
      }}
      className="grid gap-3"
    >
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <Checkbox id="isAdult" name="isAdult" defaultChecked={isAdult} className="mt-0.5" />
        <div className="grid gap-1">
          <Label htmlFor="isAdult">私は18歳以上です（高校生を除く）</Label>
          <p className="text-xs text-muted-foreground">
            無効にすると、自分の成人向けリストの編集と、その共有URLでの閲覧ができなくなります（内容は保持されます）。
            他の人の成人向けリストも閲覧できなくなります。
          </p>
        </div>
      </div>
      <FormError message={state?.error} />
      <Button type="submit" disabled={pending} className="justify-self-end">保存する</Button>
    </form>
  );
}

export function PasswordForm() {
  const [formKey, setFormKey] = useState(0);
  const [state, action, pending] = useActionState(changePassword, undefined);
  useFormToast(state, () => setFormKey((k) => k + 1));
  return (
    <form key={formKey} action={action} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="currentPassword">現在のパスワード</Label>
        <Input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="newPassword">新しいパスワード（10文字以上）</Label>
        <Input id="newPassword" name="newPassword" type="password" autoComplete="new-password" minLength={10} required />
      </div>
      <FormError message={state?.error} />
      <Button type="submit" disabled={pending} className="justify-self-end">変更する</Button>
    </form>
  );
}
