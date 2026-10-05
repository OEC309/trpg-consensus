import type { Metadata } from "next";
import Link from "next/link";
import { AdSlot } from "@/components/AdSlot";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = { robots: { index: true, follow: true } };

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <>
      <section className="card">
        <h1>卓コンセンサス</h1>
        <p>
          TRPG で扱う題材について「大歓迎・好き・普通・要相談・NG」の5段階で自分のコンセンサス表を作り、
          共有URLで卓のメンバーと見せ合うためのサービスです。
        </p>
        <ul>
          <li>デフォルト項目に加えて、自分だけのオリジナル項目を追加できます。</li>
          <li>メンバーの共有URLを並べると、全員分を一覧で比較できます。NG がある項目は赤、要相談は黄、全員が好き以上なら緑で表示されます。</li>
          <li>共有URLは推測できないランダムな文字列です。URL を知っている人だけが閲覧できます。</li>
        </ul>
        {user ? (
          <Link href="/my">マイリストへ</Link>
        ) : (
          <p className="row">
            <Link href="/signup">新規登録</Link>
            <Link href="/login">ログイン</Link>
          </p>
        )}
      </section>
      <AdSlot adultContext={false} />
    </>
  );
}
