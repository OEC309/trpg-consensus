"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LEVEL_LABEL, LEVELS, type Level } from "@/lib/consensus";
import { LEVEL_TOGGLE_ON_CLASS } from "@/lib/level-styles";
import { cn } from "@/lib/utils";

type Props = {
  /** フォーム送信時のフィールド名（hidden input で送る） */
  name: string;
  defaultValue: Level | null;
  /** true なら選択中のボタンをもう一度押して「未回答」に戻せる */
  allowEmpty?: boolean;
  label?: string;
};

/** 5段階評価をボタンで選ぶ入力。値は hidden input でフォームに送る */
export function LevelToggle({ name, defaultValue, allowEmpty = false, label }: Props) {
  const [value, setValue] = useState<string>(defaultValue ?? "");

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        spacing={0}
        value={value}
        onValueChange={(v) => {
          if (v || allowEmpty) setValue(v);
        }}
        aria-label={label}
        className="w-full sm:w-auto"
      >
        {LEVELS.map((lv) => (
          <ToggleGroupItem
            key={lv}
            value={lv}
            className={cn("flex-1 px-2 sm:w-16 sm:flex-none", LEVEL_TOGGLE_ON_CLASS[lv])}
          >
            {LEVEL_LABEL[lv]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </>
  );
}
