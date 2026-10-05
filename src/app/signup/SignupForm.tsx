"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "./actions";

export function SignupForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <form action={action} className="stack">
      {next && <input type="hidden" name="next" value={next} />}
      <label>
        メールアドレス（ログインに使います。他の人には表示されません）
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label>
        ハンドル（表示名。30文字以内、あとから変更できます）
        <input name="handle" autoComplete="nickname" maxLength={30} required />
      </label>
      <label>
        パスワード（10文字以上）
        <input name="password" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <label className="inline">
        <input name="isAdult" type="checkbox" />
        私は18歳以上です（高校生を除く）。成人向けリストを利用します。（あとから変更できます）
      </label>
      <label className="inline">
        <input name="agreed" type="checkbox" required />
        <span>
          <Link href="/terms" target="_blank">利用規約</Link>と
          <Link href="/privacy" target="_blank">プライバシーポリシー</Link>に同意します
        </span>
      </label>
      {state?.error && <p className="error">{state.error}</p>}
      <button type="submit" disabled={pending}>
        {pending ? "登録中…" : "登録する"}
      </button>
    </form>
  );
}
