import Link from "next/link";
import { notFound } from "next/navigation";
import { TableIcon } from "lucide-react";
import { AdSlot } from "@/components/AdSlot";
import { AdultGate } from "@/components/AdultGate";
import { LevelBadge } from "@/components/LevelBadge";
import { AdultBadge, PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { LIST_KIND_LABEL, type Level } from "@/lib/consensus";
import { canUseKind, findSharedLists, getListContent } from "@/lib/lists";
import { CUSTOM_CATEGORY, groupByCategory, PRESETS } from "@/lib/presets";

function ItemList({ title, items }: { title: string; items: { key: string; label: string; level: Level | null }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="divide-y">
          {items.map((item) => (
            <li key={item.key} className="flex items-center justify-between gap-4 py-2.5 text-sm">
              <span>{item.label}</span>
              <LevelBadge level={item.level} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// 共有URLのページ。ログイン不要（成人向けリストのみ成人フラグのあるログインユーザーに限定）
export default async function SharedListPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const [list] = await findSharedLists([token]);
  if (!list) notFound();

  const viewer = await getCurrentUser();
  if (!canUseKind(viewer, list.kind)) return <AdultGate viewer={viewer} next={`/s/${token}`} />;

  const content = await getListContent(list.id);
  const isAdult = list.kind === "adult";

  return (
    <>
      <PageHeader
        title={<>{list.ownerHandle} さんの{LIST_KIND_LABEL[list.kind]} {isAdult && <AdultBadge />}</>}
        description={`最終更新: ${list.updatedAt.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}`}
      >
        <Button asChild>
          <Link href={`/compare?t=${list.shareToken}`}>
            <TableIcon data-icon="inline-start" />他の人と比較する
          </Link>
        </Button>
      </PageHeader>

      <div className="grid items-start gap-4 md:grid-cols-2">
        {groupByCategory(PRESETS[list.kind]).map(([category, presets]) => (
          <ItemList
            key={category}
            title={category}
            items={presets.map((p) => ({ key: p.key, label: p.label, level: content.presets.get(p.key) ?? null }))}
          />
        ))}
        {content.customs.length > 0 && (
          <ItemList
            title={CUSTOM_CATEGORY}
            items={content.customs.map((c) => ({ key: c.id, label: c.label, level: c.level }))}
          />
        )}
      </div>

      <AdSlot adultContext={isAdult} />
    </>
  );
}
