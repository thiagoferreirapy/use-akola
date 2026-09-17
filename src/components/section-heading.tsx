export function SectionHeading({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-akola-text">{title}</h2>
        {description && <p className="mt-1 text-sm text-akola-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
