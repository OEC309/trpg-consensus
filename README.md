# 卓コンセンサス

TRPG で扱う題材について「大歓迎・好き・普通・要相談・NG」の5段階でコンセンサス表を作り、共有URLで見せ合い・比較するサービスです。

## 構成

| 役割 | 採用技術 |
| --- | --- |
| フレームワーク | Next.js 15（App Router, Server Actions）+ TypeScript |
| DB | PostgreSQL（本番: Neon または Supabase / ローカル: Docker） |
| ORM / マイグレーション | Drizzle ORM + drizzle-kit |
| 認証 | 自前のセッション認証（Argon2id + DB セッション + httpOnly Cookie） |
| UI | Tailwind CSS v4 + shadcn/ui（Radix UI, `src/components/ui/`）、lucide-react、sonner、next-themes |
| バリデーション | Zod |
| ホスティング | Vercel |
| 広告 | Google AdSense（成人向けページでは非表示） |

## セットアップ

```sh
cp .env.example .env.local
docker compose up -d
npm install
npm run db:generate   # src/db/schema.ts からマイグレーションSQLを生成
npm run db:migrate
npm run dev
```

## 仕様

### アカウント
- 登録項目: ハンドル（表示名・重複可）、メールアドレス（ログイン用・重複不可）、パスワード、成人フラグ
- ハンドル・成人フラグ・パスワードは `/settings` から変更可能。パスワード変更時は他端末のセッションを全て無効化する

### コンセンサスリスト
- ユーザーごとに「通常リスト」「成人向けリスト」を1つずつ持つ（`consensus_lists`、`(user_id, kind)` で一意）
- 成人向けリストは成人フラグがないと、自分のものも含め表示・編集できない（判定は `src/lib/lists.ts` の `canUseKind()` でサーバー側）
- 持ち主が成人フラグを外した成人向けリストは、共有URLからも見つからない扱いになる（データは保持）
- 評価は5段階（`src/lib/consensus.ts` の `LEVELS`）
- デフォルト項目は `src/lib/presets.ts`。回答は `preset_answers` に `item_key` で保存するため、key は公開後に変更しないこと
- オリジナル項目は `custom_items`。`label_key`（NFKC・小文字化・空白正規化した名称）で同一判定する

### 共有URL・比較
- 共有URLは `/s/<share_token>`。トークンは 128bit のランダム値（base64url 22文字）で、編集画面から再発行できる（旧URLは無効化）
- `/compare?t=<token>&t=<token>...` で最大12人分を並べて比較。通常と成人向けは混ぜられない
- 行の背景色: 1人でも NG → 赤 / 1人でも要相談 → 黄 / 全員が好き以上 → 緑 / それ以外 → 白
- 誰かが未回答のデフォルト項目、誰かが設定していないオリジナル項目は薄灰色で、判定しない

### アクセス制御・検索エンジン対策
| パス | ログイン | インデックス |
| --- | --- | --- |
| `/`, `/login`, `/signup`, `/terms`, `/privacy` | 不要 | 可 |
| `/s/*`, `/compare` | 不要（成人向けは成人フラグのあるログインが必要） | 不可 |
| `/my/*`, `/settings` | 必須（`src/middleware.ts` + 各ページの `requireUser()`） | 不可 |

- 既定で `<meta name="robots" content="noindex,nofollow">`（`layout.tsx`）、公開ページのみ個別に index を許可
- 非公開パスには `X-Robots-Tag: noindex` を付与し、共有ページは `Referrer-Policy: no-referrer` でトークン漏えいを防ぐ（`next.config.ts`）
- `robots.txt` は公開ページ以外を Disallow（`src/app/robots.ts`）

## 本番化までの TODO

- メールアドレス確認・パスワードリセット（Resend などで送信）
- 登録・ログインのレート制限と Bot 対策（Cloudflare Turnstile / Upstash Ratelimit）
- 退会機能（`ON DELETE CASCADE` で関連データは削除される）
- 利用規約・プライバシーポリシーの確定、AdSense 用の `public/ads.txt`
