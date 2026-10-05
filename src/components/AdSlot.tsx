"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

type Props = {
  slot?: string;
  /**
   * そのページに性的示唆を含むコンテンツが表示される場合は true。
   * Google AdSense は性的コンテンツと同じページへの掲載がポリシー上問題になるため、
   * true のときは AdSense ユニットを出さない（成人向けに許可されたネットワークへ差し替える場所）。
   */
  adultContext: boolean;
};

export function AdSlot({ slot = process.env.NEXT_PUBLIC_ADSENSE_SLOT_DEFAULT, adultContext }: Props) {
  const enabled = !adultContext && !!CLIENT && !!slot;

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // 広告ブロッカー等で失敗しても画面は壊さない
    }
  }, [enabled]);

  if (adultContext) {
    // TODO: 成人向け可の広告ネットワークを使う場合はここで描画する
    return null;
  }
  if (!enabled) return null;

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", margin: "16px 0" }}
      data-ad-client={CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
