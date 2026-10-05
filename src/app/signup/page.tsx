import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
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
    <section className="card">
      <h1>新規登録</h1>
      <SignupForm next={next} />
      <p className="muted">
        登録済みの方は <Link href={`/login?next=${encodeURIComponent(next)}`}>ログイン</Link>
      </p>
    </section>
  );
}
