import Link from "next/link";
import { Fragment } from "react";
import { AdSlot } from "@/components/AdSlot";
import { AdultGate } from "@/components/AdultGate";
import { CompareForm } from "@/components/CompareForm";
import { LevelBadge } from "@/components/LevelBadge";
import { getCurrentUser } from "@/lib/auth";
import { LIST_KIND_LABEL, MAX_COMPARE } from "@/lib/consensus";
import { buildComparison, canUseKind, findSharedLists, getListContent, shareUrl } from "@/lib/lists";

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
    <section className="card">
      <h2>{lists.length > 0 ? "比較する人を変更" : "共有URLで比較"}</h2>
      <CompareForm defaultValue={urls.map((u) => `${u}\n`).join("")} />
    </section>
  );

  if (lists.length === 0) {
    return (
      <>
        <h1>コンセンサス比較</h1>
        {requested.length > 0 && <p className="error">指定されたリストが見つかりませんでした。</p>}
        {form}
      </>
    );
  }
  if (kinds.size > 1) {
    return (
      <>
        <h1>コンセンサス比較</h1>
        <p className="error">通常リストと成人向けリストは同時に比較できません。</p>
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
      <h1>
        コンセンサス比較（{LIST_KIND_LABEL[kind]}） {isAdult && <span className="badge adult">成人向け</span>}
      </h1>
      {missing > 0 && <p className="error">見つからないリストが {missing} 件ありました（URLが再発行された可能性があります）。</p>}

      <section className="card">
        <ul className="legend">
          <li><span className="swatch st-ng" />1人でも NG</li>
          <li><span className="swatch st-ask" />1人でも要相談</li>
          <li><span className="swatch st-good" />全員が好き以上</li>
          <li><span className="swatch st-neutral" />上記以外</li>
          <li><span className="swatch st-missing" />未回答・未設定の人がいる（判定なし）</li>
        </ul>
        <div className="table-scroll">
          <table className="compare">
            <thead>
              <tr>
                <th>項目</th>
                {lists.map((l, i) => (
                  <th key={l.id}>
                    <Link href={`/s/${l.shareToken}`}>{l.ownerHandle}</Link>
                    {lists.findIndex((o) => o.ownerHandle === l.ownerHandle) !== i && <span className="muted"> ({i + 1})</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <Fragment key={row.key}>
                  {row.category !== rows[i - 1]?.category && (
                    <tr className="category">
                      <th colSpan={lists.length + 1}>{row.category}</th>
                    </tr>
                  )}
                  <tr className={`st-${row.status}`}>
                    <td>{row.label}</td>
                    {row.levels.map((lv, j) => (
                      <td key={j}><LevelBadge level={lv} /></td>
                    ))}
                  </tr>
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {form}
      <AdSlot adultContext={isAdult} />
    </>
  );
}
