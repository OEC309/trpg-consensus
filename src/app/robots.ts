import type { MetadataRoute } from "next";

// 公開してよいのはトップ・ログイン・新規登録・利用規約・プライバシーポリシーのみ。
// それ以外のページはメタタグと X-Robots-Tag（next.config.ts）でも noindex にしている。
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      // /_next/static は公開ページのレンダリング（CSS / JS）に必要
      allow: ["/$", "/login", "/signup", "/terms", "/privacy", "/_next/static/"],
      disallow: "/",
    },
  };
}
