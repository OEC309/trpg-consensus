import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/AdSlot";
import { ConfirmButton } from "@/components/ConfirmButton";
import { CopyField } from "@/components/CopyField";
import { requireUser } from "@/lib/auth";
import { LEVEL_LABEL, LEVELS, LIST_KIND_LABEL, type Level } from "@/lib/consensus";
import { getListContent, getOwnList, shareUrl } from "@/lib/lists";
import { CUSTOM_CATEGORY, groupByCategory, PRESETS } from "@/lib/presets";
import { listKindSchema } from "@/lib/validation";
import { deleteCustomItem, regenerateShareToken, saveList } from "../actions";
import { AddCustomItemForm } from "../AddCustomItemForm";

function LevelSelect({ name, value, allowEmpty }: { name: string; value: Level | null; allowEmpty: boolean }) {
  return (
    <select name={name} defaultValue={value ?? ""} required={!allowEmpty}>
      {allowEmpty && <option value="">未回答</option>}
      {LEVELS.map((lv) => (
        <option key={lv} value={lv}>{LEVEL_LABEL[lv]}</option>
      ))}
    </select>
  );
}

export default async function EditListPage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ kind: rawKind }, { saved }] = await Promise.all([params, searchParams]);
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
      <p><Link href="/my">← マイリスト</Link></p>
      <section className="card">
        <h1>
          {LIST_KIND_LABEL[list.kind]} {isAdult && <span className="badge adult">成人向け</span>}
        </h1>
        <p className="muted">共有URL</p>
        <CopyField value={url} />
        <form action={regenerateShareToken.bind(null, list.kind)} style={{ marginTop: 8 }}>
          <ConfirmButton
            type="submit"
            className="link"
            message="共有URLを作り直します。今までのURLは使えなくなります。よろしいですか？"
          >
            共有URLを再発行する
          </ConfirmButton>
        </form>
      </section>

      {saved && <p className="success">保存しました。</p>}

      <form action={saveList.bind(null, list.kind)}>
        {groupByCategory(PRESETS[list.kind]).map(([category, presets]) => (
          <section key={category} className="card">
            <h2>{category}</h2>
            <table>
              <tbody>
                {presets.map((p) => (
                  <tr key={p.key}>
                    <td>{p.label}</td>
                    <td className="level-cell">
                      <LevelSelect name={`p:${p.key}`} value={content.presets.get(p.key) ?? null} allowEmpty />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}

        <section className="card">
          <h2>{CUSTOM_CATEGORY}</h2>
          {content.customs.length === 0 ? (
            <p className="muted">オリジナル項目はまだありません。下のフォームから追加できます。</p>
          ) : (
            <table>
              <tbody>
                {content.customs.map((c) => (
                  <tr key={c.id}>
                    <td>{c.label}</td>
                    <td className="level-cell">
                      <div className="row">
                        <LevelSelect name={`c:${c.id}`} value={c.level} allowEmpty={false} />
                        <ConfirmButton
                          type="submit"
                          className="link danger"
                          formAction={deleteCustomItem.bind(null, list.kind, c.id)}
                          formNoValidate
                          message={`「${c.label}」を削除しますか？`}
                        >
                          削除
                        </ConfirmButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <div className="save-bar">
          <button type="submit">保存する</button>
        </div>
      </form>

      <section className="card">
        <h2>オリジナル項目を追加</h2>
        <p className="muted">
          他の人と同じ名前の項目は、比較時に同じ項目として並べられます（全角/半角・大文字/小文字の違いは無視）。
        </p>
        <AddCustomItemForm kind={list.kind} />
      </section>

      {/* 成人向けリストのページには AdSense を出さない */}
      <AdSlot adultContext={isAdult} />
    </>
  );
}
