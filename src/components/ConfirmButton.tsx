"use client";

import { useTransition, type ComponentProps } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  description: string;
  confirmLabel: string;
  /** 確定時に呼ぶ Server Action */
  action: () => Promise<void>;
  onDone?: () => void;
  children: React.ReactNode;
  destructive?: boolean;
} & Pick<ComponentProps<typeof Button>, "variant" | "size" | "className" | "aria-label">;

/** 確認ダイアログを挟んでから Server Action を実行するボタン */
export function ConfirmButton({
  title,
  description,
  confirmLabel,
  action,
  onDone,
  children,
  destructive,
  ...buttonProps
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" disabled={pending} {...buttonProps}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            onClick={() =>
              startTransition(async () => {
                await action();
                onDone?.();
              })
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
