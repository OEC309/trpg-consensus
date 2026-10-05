import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/AuthCard";
import { getCurrentUser } from "@/lib/auth";
import { safeNext } from "@/lib/validation";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = { title: "新規登録 | 卓コンセンサス", robots: { index: true, follow: true } };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const next = safeNext((await searchParams).next);
  if (await getCurrentUser()) redirect(next);

  return (
    <AuthCard
      title="新規登録"
      description="登録すると、通常リストと成人向けリストが作成されます"
      footer={
        <p>
          登録済みの方は <Link href={`/login?next=${encodeURIComponent(next)}`}>ログイン</Link>
        </p>
      }
    >
      <SignupForm next={next} />
    </AuthCard>
  );
}
