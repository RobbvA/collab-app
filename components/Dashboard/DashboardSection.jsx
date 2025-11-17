// components/Dashboard/DashboardSection.jsx

export default function DashboardSection({
  title,
  count,
  children,
  defaultOpen = false,
}) {
  return (
    <section>
      <details
        className="rounded-lg border border-neutral-800 bg-neutral-900/40"
        open={defaultOpen}
      >
        <summary className="flex cursor-pointer items-center justify-between px-4 py-3 text-xs text-neutral-300 select-none">
          <span className="font-medium">{title}</span>
          <span className="flex items-center gap-2 text-[11px] text-neutral-500">
            {count === 0 ? "None" : `${count} items`}
            <span className="text-neutral-700">▾</span>
          </span>
        </summary>

        <div className="border-t border-neutral-800">{children}</div>
      </details>
    </section>
  );
}
