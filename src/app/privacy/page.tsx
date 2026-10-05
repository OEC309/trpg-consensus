import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";

export const metadata: Metadata = { title: "プライバシーポリシー | 卓コンセンサス", robots: { index: true, follow: true } };

// TODO: 公開前に運営者の連絡先・広告配信事業者の記載などを実態に合わせて確定させること
export default function PrivacyPage() {
  return (
    <LegalDocument title="プライバシーポリシー">

      <h2>1. 取得する情報</h2>
      <ul>
        <li>登録時に入力されたメールアドレス、ハンドル、パスワード（ハッシュ化して保存し、運営者も元のパスワードは知り得ません）、成人フラグ</li>
        <li>コンセンサスリストの回答内容とオリジナル項目</li>
        <li>ログイン状態を維持するための Cookie</li>
      </ul>

      <h2>2. 利用目的</h2>
      <ul>
        <li>本サービスの提供（ログイン、リストの保存・共有・比較）</li>
        <li>不正利用の防止とお問い合わせへの対応</li>
      </ul>

      <h2>3. 公開される情報</h2>
      <p>
        共有URLを知っている人には、ハンドルとリストの内容が表示されます。メールアドレスが他の利用者に表示されることはありません。
      </p>

      <h2>4. 広告</h2>
      <p>
        本サービスは第三者配信の広告サービス（Google AdSense）を利用する場合があり、広告配信事業者は Cookie を使用して
        利用者の興味に応じた広告を表示することがあります。成人向けリストを表示するページには広告を掲載しません。
      </p>

      <h2>5. 第三者提供</h2>
      <p>法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。</p>
    </LegalDocument>
  );
}
