import { Badge } from "@/components/ui/badge";
import { LEVEL_LABEL, type Level } from "@/lib/consensus";
import { LEVEL_BADGE_CLASS } from "@/lib/level-styles";
import { cn } from "@/lib/utils";

export function LevelBadge({ level }: { level: Level | null }) {
  if (!level) return <span className="text-xs text-muted-foreground">未回答</span>;
  return <Badge className={cn("min-w-14", LEVEL_BADGE_CLASS[level])}>{LEVEL_LABEL[level]}</Badge>;
}
