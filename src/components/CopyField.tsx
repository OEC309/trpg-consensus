"use client";

import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CopyField({ value, label = "共有URL" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success(`${label}をコピーしました`);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("コピーできませんでした。手動で選択してコピーしてください");
    }
  }

  return (
    <div className="flex gap-2">
      <Input
        readOnly
        value={value}
        aria-label={label}
        onFocus={(e) => e.currentTarget.select()}
        className="min-w-0 flex-1 font-mono text-xs"
      />
      <Button type="button" variant="outline" onClick={copy}>
        {copied ? <CheckIcon /> : <CopyIcon />}
        コピー
      </Button>
    </div>
  );
}
