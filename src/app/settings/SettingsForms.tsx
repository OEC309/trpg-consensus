"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/validation";
import { changePassword, updateAdult, updateHandle } from "./actions";

function Result({ state }: { state: FormState }) {
  if (state?.error) return <p className="error">{state.error}</p>;
  if (state?.ok) return <p className="success">{state.ok}</p>;
  return null;
}

export function HandleForm({ handle }: { handle: string }) {
  const [state, action, pending] = useActionState(updateHandle, undefined);
  return (
    <form action={action} className="stack">
      <label>
        ハンドル（表示名。30文字以内）
        <input name="handle" defaultValue={handle} maxLength={30} required />
      </label>
      <Result state={state} />
      <button type="submit" disabled={pending}>変更する</button>
    </form>
  );
}

export function AdultForm({ isAdult }: { isAdult: boolean }) {
  const [state, action, pending] = useActionState(updateAdult, undefined);
  return (
    <form action={action} className="stack">
      <label className="inline">
        <input name="isAdult" type="checkbox" defaultChecked={isAdult} />
        私は18歳以上です（高校生を除く）。成人向けリストを利用します。
      </label>
      <p className="muted">
        無効にすると、自分の成人向けリストは編集できなくなり、その共有URLも閲覧できなくなります（内容は保持されます）。
        また、他の人の成人向けリストも閲覧できなくなります。
      </p>
      <Result state={state} />
      <button type="submit" disabled={pending}>保存する</button>
    </form>
  );
}

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="stack">
      <label>
        現在のパスワード
        <input name="currentPassword" type="password" autoComplete="current-password" required />
      </label>
      <label>
        新しいパスワード（10文字以上）
        <input name="newPassword" type="password" autoComplete="new-password" minLength={10} required />
      </label>
      <Result state={state} />
      <button type="submit" disabled={pending}>変更する</button>
    </form>
  );
}
