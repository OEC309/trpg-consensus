import Link from "next/link";
import type { SessionUser } from "@/lib/auth";

/** 成人向けリストを成人フラグのない閲覧者に見せる代わりに表示する案内 */
export function AdultGate({ viewer, next }: { viewer: SessionUser | null; next: string }) {
  return (
    <section className="card">
      <h1>成人向けリスト</h1>
      {viewer ? (
        <p>
          このリストは成人向けのため、成人フラグが有効なアカウントでのみ閲覧できます。
          18歳以上（高校生を除く）の方は <Link href="/settings">設定</Link> から成人フラグを有効にしてください。
        </p>
      ) : (
        <p>
          このリストは成人向けのため、成人フラグが有効なアカウントでのみ閲覧できます。
          <Link href={`/login?next=${encodeURIComponent(next)}`}>ログイン</Link>してください。
        </p>
      )}
    </section>
  );
}
