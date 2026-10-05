import Link from "next/link";
import { LockIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SessionUser } from "@/lib/auth";

/** 成人向けリストを成人フラグのない閲覧者に見せる代わりに表示する案内 */
export function AdultGate({ viewer, next }: { viewer: SessionUser | null; next: string }) {
  return (
    <div className="mx-auto max-w-md py-8">
      <Card className="text-center">
        <CardHeader className="justify-items-center">
          <div className="mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <LockIcon className="size-5 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">成人向けリスト</CardTitle>
          <CardDescription>
            このリストは成人向けのため、成人フラグが有効なアカウントでのみ閲覧できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          {viewer ? (
            <p className="text-sm text-muted-foreground">
              18歳以上（高校生を除く）の方は <Link href="/settings">設定</Link> から成人フラグを有効にしてください。
            </p>
          ) : (
            <Button asChild>
              <Link href={`/login?next=${encodeURIComponent(next)}`}>ログインして閲覧</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
