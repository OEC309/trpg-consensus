import type { NextConfig } from "next";

// ログイン必須ページと共有URLのページは検索エンジンに載せない
const NOINDEX = { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" };
// 共有トークンが Referer ヘッダー経由で外部サイトに漏れないようにする
const NO_REFERRER = { key: "Referrer-Policy", value: "no-referrer" };

const nextConfig: NextConfig = {
  // ネイティブバイナリを含むためバンドル対象から外す
  serverExternalPackages: ["@node-rs/argon2"],

  async headers() {
    return [
      { source: "/my/:path*", headers: [NOINDEX] },
      { source: "/settings/:path*", headers: [NOINDEX] },
      { source: "/s/:path*", headers: [NOINDEX, NO_REFERRER] },
      { source: "/compare", headers: [NOINDEX, NO_REFERRER] },
    ];
  },
};

export default nextConfig;
