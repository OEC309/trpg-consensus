import type { ListKind } from "./consensus";

// 各リストのデフォルト項目。
// key は DB（preset_answers.item_key）に保存されるので、一度公開したら変更しないこと。
// 文言（category / label）は自由に変えてよい。
export type Preset = { key: string; category: string; label: string };

export const PRESETS: Record<ListKind, readonly Preset[]> = {
  general: [
    { key: "g.blood", category: "暴力・残酷", label: "流血・負傷の描写" },
    { key: "g.gore", category: "暴力・残酷", label: "グロテスクな描写（身体の欠損など）" },
    { key: "g.torture", category: "暴力・残酷", label: "拷問" },
    { key: "g.pc-death", category: "暴力・残酷", label: "PC の死亡・ロスト" },
    { key: "g.npc-death", category: "暴力・残酷", label: "親しい NPC の死" },
    { key: "g.child-harm", category: "暴力・残酷", label: "子どもへの危害" },
    { key: "g.animal-harm", category: "暴力・残酷", label: "動物への危害" },

    { key: "g.bugs", category: "ホラー", label: "虫・蜘蛛" },
    { key: "g.body-horror", category: "ホラー", label: "身体の変異・寄生" },
    { key: "g.jumpscare", category: "ホラー", label: "突然驚かせる演出" },
    { key: "g.insanity", category: "ホラー", label: "狂気・発狂の演出" },

    { key: "g.self-harm", category: "精神・社会", label: "自傷・自殺" },
    { key: "g.mind-control", category: "精神・社会", label: "洗脳・人格改変・精神操作" },
    { key: "g.abuse", category: "精神・社会", label: "虐待・DV" },
    { key: "g.discrimination", category: "精神・社会", label: "差別的な言動" },
    { key: "g.drugs", category: "精神・社会", label: "薬物・依存症" },
    { key: "g.disease", category: "精神・社会", label: "病気・感染症" },

    { key: "g.romance-npc", category: "人間関係", label: "NPC との恋愛ロール" },
    { key: "g.romance-pc", category: "人間関係", label: "PC 間の恋愛ロール" },
    { key: "g.pvp", category: "人間関係", label: "PC 間の対立・裏切り・PvP" },
    { key: "g.secret", category: "人間関係", label: "秘匿 HO・PL 間の情報格差" },
    { key: "g.npc-betrayal", category: "人間関係", label: "NPC からの裏切り" },

    { key: "g.combat", category: "プレイスタイル", label: "戦闘中心のシナリオ" },
    { key: "g.investigation", category: "プレイスタイル", label: "探索・謎解き中心のシナリオ" },
    { key: "g.roleplay", category: "プレイスタイル", label: "会話・ロールプレイ中心のシナリオ" },
    { key: "g.long-session", category: "プレイスタイル", label: "セッションの長時間化" },
    { key: "g.improv", category: "プレイスタイル", label: "GM のアドリブ・独自解釈" },
    { key: "g.offtopic", category: "プレイスタイル", label: "メタ発言・雑談" },
  ],
  adult: [
    { key: "a.innuendo", category: "性的表現", label: "性的な示唆・ほのめかし" },
    { key: "a.fade", category: "性的表現", label: "性的関係のフェードアウト描写" },
    { key: "a.explicit", category: "性的表現", label: "直接的な性描写" },
    { key: "a.nudity", category: "性的表現", label: "裸体・露出度の高い描写" },
    { key: "a.contact", category: "性的表現", label: "恋愛ロールでの身体的接触の描写" },

    { key: "a.same-sex", category: "関係性", label: "同性間の恋愛・性的関係" },
    { key: "a.multiple", category: "関係性", label: "複数人との恋愛・性的関係" },
    { key: "a.pc-pc", category: "関係性", label: "PC 同士の性的関係" },
    { key: "a.pc-npc", category: "関係性", label: "PC と NPC の性的関係" },

    { key: "a.non-consent", category: "強要・搾取", label: "同意のない性的行為（言及を含む）" },
    { key: "a.coercion", category: "強要・搾取", label: "性的な脅迫・強要" },
    { key: "a.sex-work", category: "強要・搾取", label: "性産業・売買春の描写" },

    { key: "a.pregnancy", category: "その他", label: "妊娠・出産の描写" },
  ],
};

export const CUSTOM_CATEGORY = "オリジナル項目";

/** デフォルト項目をカテゴリごとにまとめる（定義順を保つ） */
export function groupByCategory<T extends { category: string }>(items: readonly T[]) {
  const groups = new Map<string, T[]>();
  for (const item of items) {
    const g = groups.get(item.category);
    if (g) g.push(item);
    else groups.set(item.category, [item]);
  }
  return [...groups];
}
