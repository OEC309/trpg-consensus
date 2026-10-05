import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { CopyField } from "@/components/CopyField";
import { LevelToggle } from "@/components/LevelToggle";
import { AdultBadge, PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { LIST_KIND_LABEL } from "@/lib/consensus";
import { getListContent, getOwnList, shareUrl } from "@/lib/lists";
import { CUSTOM_CATEGORY, groupByCategory, PRESETS } from "@/lib/presets";
import { listKindSchema } from "@/lib/validation";
import { AddCustomItemForm } from "../AddCustomItemForm";
import { DeleteCustomItemButton, RegenerateShareTokenButton, SaveListForm } from "../ListForms";

/** 項目名と評価ボタンの1行 */
function ItemRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <li className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-sm">{label}</span>
      <div className="flex shrink-0 items-center gap-1">{children}</div>
    </li>
  );
}

export default async function EditListPage({ params }: { params: Promise<{ kind: string }> }) {
  const { kind: rawKind } = await params;
  const user = await requireUser();
  const kind = listKindSchema.safeParse(rawKind);
  if (!kind.success) notFound();
  // 成人フラグがなければ自分の成人向けリストも表示・編集できない
  const list = await getOwnList(user, kind.data);
  if (!list) notFound();

  const [content, url] = await Promise.all([getListContent(list.id), shareUrl(list.shareToken)]);
  const isAdult = list.kind === "adult";

  return (
    <>
      <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
        <Link href="/my"><ArrowLeftIcon data-icon="inline-start" />マイリスト</Link>
      </Button>
      <PageHeader
        title={<>{LIST_KIND_LABEL[list.kind]} {isAdult && <AdultBadge />}</>}
        description="各項目の評価を選んで「回答を保存する」を押してください。選択中のボタンをもう一度押すと未回答に戻せます。"
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>共有URL</CardTitle>
          <CardDescription>このURLを知っている人は、ログインなしでこのリストを閲覧できます。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <CopyField value={url} />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button variant="link" size="sm" asChild className="h-auto px-0">
              <Link href={`/s/${list.shareToken}`} target="_blank">
                共有ページを確認 <ExternalLinkIcon data-icon="inline-end" />
              </Link>
            </Button>
            <RegenerateShareTokenButton kind={list.kind} />
          </div>
        </CardContent>
      </Card>

      <SaveListForm kind={list.kind}>
        {groupByCategory(PRESETS[list.kind]).map(([category, presets]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {presets.map((p) => (
                  <ItemRow key={p.key} label={p.label}>
                    <LevelToggle name={`p:${p.key}`} defaultValue={content.presets.get(p.key) ?? null} allowEmpty label={p.label} />
                  </ItemRow>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>{CUSTOM_CATEGORY}</CardTitle>
            <CardDescription>
              他の人と同じ名前の項目は、比較時に同じ項目として並びます（全角/半角・大文字/小文字の違いは無視）。
            </CardDescription>
          </CardHeader>
          <CardContent>
            {content.customs.length === 0 ? (
              <p className="py-3 text-sm text-muted-foreground">オリジナル項目はまだありません。下のフォームから追加できます。</p>
            ) : (
              <ul className="divide-y">
                {content.customs.map((c) => (
                  <ItemRow key={c.id} label={c.label}>
                    <LevelToggle name={`c:${c.id}`} defaultValue={c.level} label={c.label} />
                    <DeleteCustomItemButton kind={list.kind} id={c.id} label={c.label} />
                  </ItemRow>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </SaveListForm>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>オリジナル項目を追加</CardTitle>
          <CardDescription>追加した項目はすぐに保存されます。</CardDescription>
        </CardHeader>
        <CardContent>
          <AddCustomItemForm kind={list.kind} />
        </CardContent>
      </Card>

      {/* 成人向けリストのページには AdSense を出さない */}
      <AdSlot adultContext={isAdult} />
    </>
  );
}
