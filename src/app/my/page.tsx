import Link from "next/link";
import { CompareForm } from "@/components/CompareForm";
import { CopyField } from "@/components/CopyField";
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
      <h1>マイリスト</h1>
      {cards.map((c) => (
        <section key={c.kind} className="card">
          <h2>
            {LIST_KIND_LABEL[c.kind]} {c.kind === "adult" && <span className="badge adult">成人向け</span>}
          </h2>
          <p className="muted">
            デフォルト項目 {c.answered} / {c.total} 回答済み・オリジナル項目 {c.customCount} 件
          </p>
          <p><Link href={`/my/${c.kind}`}>リストを編集する</Link></p>
          <p className="muted">共有URL（このURLを知っている人は誰でも閲覧できます）</p>
          <CopyField value={c.url} />
        </section>
      ))}
      {!user.isAdult && (
        <p className="muted">
          成人向けリストを使うには <Link href="/settings">設定</Link> で成人フラグを有効にしてください。
        </p>
      )}

      <section className="card">
        <h2>メンバーのリストと比較</h2>
        <CompareForm defaultValue={cards[0] ? `${cards[0].url}\n` : ""} />
      </section>
    </>
  );
}
