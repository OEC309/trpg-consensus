import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
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
    <section className="card">
      <h1>ログイン</h1>
      <LoginForm next={next} />
      <p className="muted">
        はじめての方は <Link href={`/signup?next=${encodeURIComponent(next)}`}>新規登録</Link>
      </p>
    </section>
  );
}
