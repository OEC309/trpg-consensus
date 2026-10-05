"use client";

import { useActionState } from "react";
import { startCompare } from "@/app/compare/actions";
import { FormError } from "@/components/FormMessage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MAX_COMPARE } from "@/lib/consensus";

export function CompareForm({ defaultValue = "" }: { defaultValue?: string }) {
  const [state, action, pending] = useActionState(startCompare, undefined);

  return (
    <form action={action} className="grid gap-3">
      <div className="grid gap-2">
        <Label htmlFor="compare-urls">共有URL（1行に1つ、最大{MAX_COMPARE}人）</Label>
        <Textarea
          id="compare-urls"
          name="urls"
          rows={5}
          defaultValue={defaultValue}
          required
          className="font-mono text-xs"
          placeholder="https://example.com/s/xxxxxxxxxxxxxxxxxxxxxx"
        />
        <p className="text-xs text-muted-foreground">通常リストと成人向けリストは混ぜずに、同じ種類のリスト同士で比較してください。</p>
      </div>
      <FormError message={state?.error} />
      <Button type="submit" disabled={pending} className="justify-self-end">比較する</Button>
    </form>
  );
}
