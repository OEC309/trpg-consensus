"use client";

import { useState } from "react";

export function CopyField({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // クリップボードが使えない環境では手動でコピーしてもらう
    }
  }

  return (
    <div className="row">
      <input readOnly value={value} onFocus={(e) => e.currentTarget.select()} style={{ flex: 1, minWidth: 0 }} />
      <button type="button" onClick={copy}>{copied ? "コピーしました" : "コピー"}</button>
    </div>
  );
}
