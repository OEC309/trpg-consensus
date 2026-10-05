import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { AdultGate } from "@/components/AdultGate";
import { LevelBadge } from "@/components/LevelBadge";
import { getCurrentUser } from "@/lib/auth";
import { LIST_KIND_LABEL } from "@/lib/consensus";
import { canUseKind, findSharedLists, getListContent } from "@/lib/lists";
import { CUSTOM_CATEGORY, groupByCategory, PRESETS } from "@/lib/presets";

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
      <section className="card">
        <h1>
          {list.ownerHandle} さんの{LIST_KIND_LABEL[list.kind]}{" "}
          {isAdult && <span className="badge adult">成人向け</span>}
        </h1>
        <p className="muted">最終更新: {list.updatedAt.toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}</p>
        <p>
          <Link href={`/compare?t=${list.shareToken}`}>このリストを他の人と比較する</Link>
        </p>
      </section>

      {groupByCategory(PRESETS[list.kind]).map(([category, presets]) => (
        <section key={category} className="card">
          <h2>{category}</h2>
          <table>
            <tbody>
              {presets.map((p) => (
                <tr key={p.key}>
                  <td>{p.label}</td>
                  <td className="level-cell"><LevelBadge level={content.presets.get(p.key) ?? null} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}

      {content.customs.length > 0 && (
        <section className="card">
          <h2>{CUSTOM_CATEGORY}</h2>
          <table>
            <tbody>
              {content.customs.map((c) => (
                <tr key={c.id}>
                  <td>{c.label}</td>
                  <td className="level-cell"><LevelBadge level={c.level} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <AdSlot adultContext={isAdult} />
    </>
  );
}
