"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { FormState } from "@/lib/validation";

/** Server Action の結果（ok）をトーストで通知する。エラーはフォーム内に表示するのでここでは扱わない */
export function useFormToast(state: FormState, onOk?: () => void) {
  useEffect(() => {
    if (state?.ok) {
      toast.success(state.ok);
      onOk?.();
    }
    // state は送信ごとに新しいオブジェクトになるので、同じ文言でも毎回通知される
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
}
