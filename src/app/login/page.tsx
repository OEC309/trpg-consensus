import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";
import { getCurrentUser } from "@/lib/auth";
import { safeNext } from "@/lib/validation";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "ログイン | 卓コンセンサス", robots: { index: true, follow: true } };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNext((await searchParams).next);
  if (await getCurrentUser()) redirect(next);

  return (
    <AuthCard
      title="ログイン"
      description="登録したメールアドレスとパスワードを入力してください"
      footer={
        <p>
          はじめての方は <Link href={`/signup?next=${encodeURIComponent(next)}`}>新規登録</Link>
        </p>
      }
    >
      <LoginForm next={next} />
    </AuthCard>
  );
}
