import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "./actions";
import "./globals.css";

export const metadata: Metadata = {
  title: "卓コンセンサス",
  description: "TRPG のコンセンサス（好きな題材・NG な題材）を共有・比較するサービス",
  // 既定は検索エンジンに載せない。公開ページ（トップ・ログイン・規約など）だけ個別に index を許可する
  robots: { index: false, follow: false },
};

const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  return (
    <html lang="ja">
      <body>
        {ADSENSE_CLIENT && (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
        <header className="site">
          <Link href="/" className="brand">卓コンセンサス</Link>
          <nav>
            {user ? (
              <>
                <Link href="/my">マイリスト</Link>
                <Link href="/compare">比較</Link>
                <Link href="/settings">設定</Link>
                <span className="muted">{user.handle}</span>
                <form action={logout}>
                  <button className="link" type="submit">ログアウト</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login">ログイン</Link>
                <Link href="/signup">新規登録</Link>
              </>
            )}
          </nav>
        </header>
        <main>{children}</main>
        <footer className="site">
          <Link href="/terms">利用規約</Link>
          <Link href="/privacy">プライバシーポリシー</Link>
        </footer>
      </body>
    </html>
  );
}
