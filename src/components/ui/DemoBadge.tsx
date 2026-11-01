export default function DemoBadge({ label = "Données de démonstration", className = "" }: { label?: string; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border border-dashed border-current px-3 py-1 text-[0.68rem] font-medium uppercase tracking-[0.14em] ${className}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {label}
    </span>
  );
}
