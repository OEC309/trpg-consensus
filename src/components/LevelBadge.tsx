import { LEVEL_LABEL, type Level } from "@/lib/consensus";

export function LevelBadge({ level }: { level: Level | null }) {
  if (!level) return <span className="muted">未回答</span>;
  return <span className={`badge lv-${level}`}>{LEVEL_LABEL[level]}</span>;
}
