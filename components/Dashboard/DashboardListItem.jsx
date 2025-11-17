// components/Dashboard/DashboardListItem.jsx

export default function DashboardListItem({ title, metaLeft, metaRight }) {
  return (
    <li className="px-4 py-3 text-xs hover:bg-neutral-900 cursor-pointer transition-colors">
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-neutral-100 line-clamp-1">{title}</p>
          {metaRight && (
            <span className="text-[10px] text-neutral-500 whitespace-nowrap">
              {metaRight}
            </span>
          )}
        </div>

        {metaLeft && (
          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            {metaLeft}
          </div>
        )}
      </div>
    </li>
  );
}
