// FILE: components/Dashboard/DashboardSection.jsx
export default function DashboardSection({
  title,
  count,
  children,
  defaultOpen = false,
}) {
  return (
    <section>
      <details
        className="rounded-2xl border border-white/10 bg-neutral-950/40 backdrop-blur"
        open={defaultOpen}
      >
        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-xs text-neutral-300 select-none">
          <span className="font-medium text-neutral-100">{title}</span>
          <span className="flex items-center gap-2 text-[11px] text-neutral-500">
            {count === 0 ? "None" : `${count} items`}
            <span className="text-neutral-700">▾</span>
          </span>
        </summary>

        <div className="border-t border-white/10">{children}</div>
      </details>
    </section>
  );
}
