import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { LogOutIcon } from "lucide-react";
import { ThemeProvider, ThemeToggle } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { logout } from "./actions";
import "./globals.css";

// Geist は欧文のみ。和文は globals.css の --font-sans でシステムフォントにフォールバックする
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

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
    // next-themes が html の class を書き換えるため suppressHydrationWarning が必要
    <html lang="ja" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className="flex min-h-svh flex-col bg-muted/40 antialiased">
        {ADSENSE_CLIENT && (
          <Script
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          />
        )}
        <ThemeProvider>
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4">
              <Link href={user ? "/my" : "/"} className="mr-auto font-heading text-base font-semibold tracking-tight text-foreground hover:no-underline">
                卓コンセンサス
              </Link>
              <nav className="flex items-center gap-1">
                {user ? (
                  <>
                    <Button variant="ghost" size="sm" asChild><Link href="/my">マイリスト</Link></Button>
                    <Button variant="ghost" size="sm" asChild><Link href="/compare">比較</Link></Button>
                    <Button variant="ghost" size="sm" asChild><Link href="/settings">設定</Link></Button>
                    <span className="hidden max-w-32 truncate px-2 text-sm text-muted-foreground md:inline">{user.handle}</span>
                    <form action={logout}>
                      <Button type="submit" variant="ghost" size="icon" aria-label="ログアウト">
                        <LogOutIcon />
                      </Button>
                    </form>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" asChild><Link href="/login">ログイン</Link></Button>
                    <Button size="sm" asChild><Link href="/signup">新規登録</Link></Button>
                  </>
                )}
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
          <footer className="border-t bg-background">
            <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-6 text-sm text-muted-foreground">
              <Link href="/terms" className="text-muted-foreground">利用規約</Link>
              <Link href="/privacy" className="text-muted-foreground">プライバシーポリシー</Link>
              <span>© 卓コンセンサス</span>
            </div>
          </footer>
          <Toaster richColors position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
