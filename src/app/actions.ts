"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";

export async function logout(): Promise<void> {
  await destroySession();
  redirect("/");
}
