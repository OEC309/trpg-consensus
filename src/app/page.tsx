import type { Metadata } from "next";
import Link from "next/link";
import { ListChecksIcon, Share2Icon, TableIcon } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { LevelBadge } from "@/components/LevelBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { LEVELS, rowStatus, type Level } from "@/lib/consensus";
import { STATUS_ROW_CLASS } from "@/lib/level-styles";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { robots: { index: true, follow: true } };

const FEATURES = [
  {
    icon: ListChecksIcon,
    title: "5段階で回答",
    body: "流血・ホラー・恋愛ロールなどの題材を「大歓迎」から「NG」まで5段階で。オリジナル項目も追加できます。",
  },
  {
    icon: Share2Icon,
    title: "URL で共有",
    body: "推測できないランダムな共有URLを発行。URL を知っている人だけが閲覧できます。",
  },
  {
    icon: TableIcon,
    title: "全員分を比較",
    body: "メンバーの共有URLを並べるだけで一覧表に。NG は赤、要相談は黄、全員が好きなら緑で一目瞭然です。",
  },
];

// トップページの説明用サンプル
const SAMPLE: { label: string; levels: (Level | null)[] }[] = [
  { label: "PC 間の恋愛ロール", levels: ["love", "like", "like"] },
  { label: "流血・負傷の描写", levels: ["like", "neutral", "ask"] },
  { label: "虫・蜘蛛", levels: ["neutral", "ng", "like"] },
  { label: "時間ループもの", levels: ["love", null, "like"] },
];

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 pt-4 md:grid-cols-2">
        <div className="space-y-5">
          <h1 className="font-heading text-3xl font-bold tracking-tight md:text-4xl">
            卓の「好き」と「NG」を、
            <br />
            始まる前にそろえよう。
          </h1>
          <p className="text-muted-foreground">
            TRPG で扱う題材について自分のコンセンサス表を作り、共有URLで卓のメンバーと見せ合えるサービスです。
          </p>
          <div className="flex flex-wrap gap-1.5">
            {LEVELS.map((lv) => (
              <LevelBadge key={lv} level={lv} />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {user ? (
              <Button size="lg" asChild><Link href="/my">マイリストへ</Link></Button>
            ) : (
              <>
                <Button size="lg" asChild><Link href="/signup">無料で始める</Link></Button>
                <Button size="lg" variant="outline" asChild><Link href="/login">ログイン</Link></Button>
              </>
            )}
          </div>
        </div>

        <Card aria-label="比較表のサンプル">
          <CardHeader>
            <CardTitle>比較表のイメージ</CardTitle>
            <CardDescription>NG があれば赤、要相談があれば黄、全員が好き以上なら緑</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto px-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-2 font-medium">項目</th>
                  {["あかね", "ゆう", "そら"].map((n) => (
                    <th key={n} className="px-2 py-2 font-medium">{n}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SAMPLE.map((row) => (
                  <tr key={row.label} className={cn("border-b last:border-0", STATUS_ROW_CLASS[rowStatus(row.levels)])}>
                    <td className="px-4 py-2">{row.label}</td>
                    {row.levels.map((lv, i) => (
                      <td key={i} className="px-2 py-2"><LevelBadge level={lv} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <Card key={title}>
            <CardHeader>
              <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{body}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>

      <AdSlot adultContext={false} />
    </div>
  );
}
