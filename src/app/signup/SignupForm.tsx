"use client";

import Link from "next/link";
import { useActionState } from "react";
import { FormError } from "@/components/FormMessage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "./actions";

export function SignupForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="grid gap-4">
      {next && <input type="hidden" name="next" value={next} />}
      <div className="grid gap-2">
        <Label htmlFor="email">メールアドレス</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <p className="text-xs text-muted-foreground">ログインに使います。他の人には表示されません。</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="handle">ハンドル</Label>
        <Input id="handle" name="handle" autoComplete="nickname" maxLength={30} required />
        <p className="text-xs text-muted-foreground">共有したリストに表示される名前です（30文字以内・あとから変更可）。</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="password">パスワード</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" minLength={10} required />
        <p className="text-xs text-muted-foreground">10文字以上</p>
      </div>
      <div className="flex items-start gap-3 rounded-lg border p-3">
        <Checkbox id="isAdult" name="isAdult" className="mt-0.5" />
        <div className="grid gap-1">
          <Label htmlFor="isAdult">私は18歳以上です（高校生を除く）</Label>
          <p className="text-xs text-muted-foreground">成人向けリストを利用できるようになります。あとから変更できます。</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="agreed" name="agreed" required className="mt-0.5" />
        <Label htmlFor="agreed" className="inline leading-relaxed font-normal">
          <Link href="/terms" target="_blank">利用規約</Link>と
          <Link href="/privacy" target="_blank">プライバシーポリシー</Link>に同意します
        </Label>
      </div>
      <FormError message={state?.error} />
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "登録中…" : "登録する"}
      </Button>
    </form>
  );
}
