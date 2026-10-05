import Link from "next/link";
import { ArrowRightIcon, ShieldAlertIcon } from "lucide-react";
import { CompareForm } from "@/components/CompareForm";
import { CopyField } from "@/components/CopyField";
import { AdultBadge, PageHeader } from "@/components/PageHeader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { LIST_KIND_LABEL, LIST_KINDS } from "@/lib/consensus";
import { getListContent, getOwnList, shareUrl } from "@/lib/lists";
import { PRESETS } from "@/lib/presets";

export default async function MyPage() {
  const user = await requireUser();
  const kinds = LIST_KINDS.filter((k) => k === "general" || user.isAdult);

  const cards = await Promise.all(
    kinds.map(async (kind) => {
      const list = (await getOwnList(user, kind))!;
      const content = await getListContent(list.id);
      return {
        kind,
        url: await shareUrl(list.shareToken),
        answered: content.presets.size,
        total: PRESETS[kind].length,
        customCount: content.customs.length,
      };
    }),
  );

  return (
    <>
      <PageHeader title="マイリスト" description={`${user.handle} さんのコンセンサスリスト`} />

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => {
          const percent = Math.round((c.answered / c.total) * 100);
          return (
            <Card key={c.kind}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  {LIST_KIND_LABEL[c.kind]} {c.kind === "adult" && <AdultBadge />}
                </CardTitle>
                <CardDescription>
                  デフォルト項目 {c.answered} / {c.total} 回答済み・オリジナル項目 {c.customCount} 件
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div
                  className="h-2 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-valuenow={percent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="回答の進み具合"
                >
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">共有URL（このURLを知っている人は閲覧できます）</p>
                  <CopyField value={c.url} />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="ml-auto">
                  <Link href={`/my/${c.kind}`}>
                    リストを編集する <ArrowRightIcon data-icon="inline-end" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          );
        })}

        {!user.isAdult && (
          <Alert className="self-start">
            <ShieldAlertIcon />
            <AlertTitle>成人向けリストは無効です</AlertTitle>
            <AlertDescription>
              18歳以上（高校生を除く）の方は <Link href="/settings">設定</Link> で成人フラグを有効にすると利用できます。
            </AlertDescription>
          </Alert>
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">メンバーのリストと比較</CardTitle>
          <CardDescription>卓のメンバーから共有URLを集めて貼り付けてください。自分のURLは入力済みです。</CardDescription>
        </CardHeader>
        <CardContent>
          <CompareForm defaultValue={cards[0] ? `${cards[0].url}\n` : ""} />
        </CardContent>
      </Card>
    </>
  );
}
