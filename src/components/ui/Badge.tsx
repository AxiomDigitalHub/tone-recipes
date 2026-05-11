interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "outline";
  className?: string;
}

export default function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-[var(--paper-2)] text-[var(--ink-muted)]",
    accent: "bg-[var(--amber)]/10 text-[var(--amber-2)]",
    outline: "border border-[var(--ink)]/15 text-[var(--ink-muted)]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
