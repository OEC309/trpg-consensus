/** 各ページの見出し */
export function PageHeader({
  title,
  description,
  children,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="flex flex-wrap items-center gap-2 font-heading text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function AdultBadge() {
  return (
    <span className="inline-flex h-5 items-center rounded-4xl bg-fuchsia-100 px-2 text-xs font-medium text-fuchsia-800 dark:bg-fuchsia-900/60 dark:text-fuchsia-200">
      成人向け
    </span>
  );
}
