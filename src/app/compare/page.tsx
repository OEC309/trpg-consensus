import Link from "next/link";
import { Fragment } from "react";
import { AdSlot } from "@/components/AdSlot";
import { AdultGate } from "@/components/AdultGate";
import { CompareForm } from "@/components/CompareForm";
import { FormError } from "@/components/FormMessage";
import { LevelBadge } from "@/components/LevelBadge";
import { AdultBadge, PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { LIST_KIND_LABEL, MAX_COMPARE, type RowStatus } from "@/lib/consensus";
import { STATUS_LABEL, STATUS_ROW_CLASS, STATUS_SWATCH_CLASS } from "@/lib/level-styles";
import { buildComparison, canUseKind, findSharedLists, getListContent, shareUrl } from "@/lib/lists";
import { cn } from "@/lib/utils";

const LEGEND_ORDER: RowStatus[] = ["ng", "ask", "good", "neutral", "missing"];

// 共有URLを並べて比較するページ。ログイン不要（成人向けリストのみ成人フラグのあるログインユーザーに限定）
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string | string[] }>;
}) {
  const { t } = await searchParams;
  const requested = [...new Set(Array.isArray(t) ? t : t ? [t] : [])].slice(0, MAX_COMPARE);
  const [lists, viewer] = await Promise.all([findSharedLists(requested), getCurrentUser()]);

  const missing = requested.length - lists.length;
  const kinds = new Set(lists.map((l) => l.kind));
  const urls = await Promise.all(lists.map((l) => shareUrl(l.shareToken)));
  const form = (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>{lists.length > 0 ? "比較する人を変更" : "共有URLで比較"}</CardTitle>
        <CardDescription>メンバーの共有URLを追加・削除して「比較する」を押してください。</CardDescription>
      </CardHeader>
      <CardContent>
        <CompareForm defaultValue={urls.map((u) => `${u}\n`).join("")} />
      </CardContent>
    </Card>
  );

  if (lists.length === 0 || kinds.size > 1) {
    return (
      <>
        <PageHeader title="コンセンサス比較" description="メンバーの共有URLを並べて、全員分のコンセンサスを一覧で比較します。" />
        {requested.length > 0 && lists.length === 0 && <FormError message="指定されたリストが見つかりませんでした。" />}
        {kinds.size > 1 && <FormError message="通常リストと成人向けリストは同時に比較できません。" />}
        {form}
      </>
    );
  }

  const kind = lists[0]!.kind;
  if (!canUseKind(viewer, kind)) {
    const query = new URLSearchParams(lists.map((l) => ["t", l.shareToken]));
    return <AdultGate viewer={viewer} next={`/compare?${query}`} />;
  }

  const contents = await Promise.all(lists.map((l) => getListContent(l.id)));
  const rows = buildComparison(kind, contents);
  const isAdult = kind === "adult";

  return (
    <>
      <PageHeader
        title={<>コンセンサス比較 <span className="text-base font-normal text-muted-foreground">{LIST_KIND_LABEL[kind]}・{lists.length}人</span> {isAdult && <AdultBadge />}</>}
      />
      {missing > 0 && (
        <div className="mb-4">
          <FormError message={`見つからないリストが ${missing} 件ありました（URLが再発行された可能性があります）。`} />
        </div>
      )}

      <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        {LEGEND_ORDER.map((s) => (
          <li key={s} className="flex items-center gap-2">
            <span className={cn("inline-block size-4 rounded border", STATUS_SWATCH_CLASS[s])} />
            {STATUS_LABEL[s]}
          </li>
        ))}
      </ul>

      <Card className="py-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b bg-card">
                <th className="sticky left-0 z-10 min-w-44 bg-card px-4 py-3 text-left font-medium">項目</th>
                {lists.map((l, i) => (
                  <th key={l.id} className="px-3 py-3 text-left font-medium whitespace-nowrap">
                    <Link href={`/s/${l.shareToken}`}>{l.ownerHandle}</Link>
                    {/* 同名のハンドルがいる場合は列番号で区別する */}
                    {lists.findIndex((o) => o.ownerHandle === l.ownerHandle) !== i && (
                      <span className="text-muted-foreground"> ({i + 1})</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <Fragment key={row.key}>
                  {row.category !== rows[i - 1]?.category && (
                    <tr className="border-b bg-muted">
                      <th
                        colSpan={lists.length + 1}
                        className="sticky left-0 px-4 py-2 text-left text-xs font-semibold tracking-wide text-muted-foreground"
                      >
                        {row.category}
                      </th>
                    </tr>
                  )}
                  <tr className={cn("border-b last:border-0", STATUS_ROW_CLASS[row.status])}>
                    <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5">{row.label}</td>
                    {row.levels.map((lv, j) => (
                      <td key={j} className="px-3 py-2.5">
                        <LevelBadge level={lv} />
                      </td>
                    ))}
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {form}
      <AdSlot adultContext={isAdult} />
    </>
  );
}
