import { PageHeader } from "@/components/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { AdultForm, HandleForm, PasswordForm } from "./SettingsForms";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="設定" />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>メールアドレス</CardTitle>
            <CardDescription>ログインに使います。他の人には表示されません。</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-sm">{user.email}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>ハンドル</CardTitle>
            <CardDescription>共有したリストや比較表に表示される名前です。</CardDescription>
          </CardHeader>
          <CardContent>
            <HandleForm handle={user.handle} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>成人フラグ</CardTitle>
            <CardDescription>成人向けリストの利用・閲覧に必要です。</CardDescription>
          </CardHeader>
          <CardContent>
            <AdultForm isAdult={user.isAdult} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>パスワード</CardTitle>
            <CardDescription>変更すると、他の端末ではログアウトされます。</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
