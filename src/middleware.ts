import { NextResponse, type NextRequest } from "next/server";

// ログイン必須ページの入口チェック。Cookie の有無だけを見る軽量な判定で、
// セッションの有効性は各ページの requireUser() で検証する。
// Cookie 名は src/lib/auth.ts の SESSION_COOKIE と揃えること（auth.ts は Node 専用のため import しない）。
const SESSION_COOKIE = "session";

export function middleware(req: NextRequest) {
  if (req.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const url = new URL("/login", req.url);
  url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/my/:path*", "/settings/:path*"],
};
