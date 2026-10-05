import { requireUser } from "@/lib/auth";
import { AdultForm, HandleForm, PasswordForm } from "./SettingsForms";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <>
      <h1>設定</h1>
      <section className="card">
        <h2>メールアドレス</h2>
        <p>{user.email}</p>
      </section>
      <section className="card">
        <h2>ハンドル</h2>
        <HandleForm handle={user.handle} />
      </section>
      <section className="card">
        <h2>成人フラグ</h2>
        <AdultForm isAdult={user.isAdult} />
      </section>
      <section className="card">
        <h2>パスワード</h2>
        <PasswordForm />
      </section>
    </>
  );
}
