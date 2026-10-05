import { CircleAlertIcon } from "lucide-react";

/** フォームのエラー表示（成功時はトーストで通知する） */
export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
      <CircleAlertIcon className="size-4 shrink-0" />
      {message}
    </p>
  );
}
