import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "./PageHeader";

/** 利用規約・プライバシーポリシーなどの文書ページ */
export function LegalDocument({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={title} />
      <Card>
        <CardContent className="space-y-4 text-sm leading-relaxed [&_h2]:mt-8 [&_h2]:mb-2 [&_h2]:font-heading [&_h2]:text-base [&_h2]:font-semibold [&_h2:first-child]:mt-0 [&_li]:mt-1 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </CardContent>
      </Card>
    </div>
  );
}
