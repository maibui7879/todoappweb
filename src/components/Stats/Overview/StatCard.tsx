import type { OverviewStatCardProps } from '../../../types/stat.type';

export const StatCard = ({
  title,
  value,
  color, // Ví dụ: 'text-violet-600' hoặc 'text-red-500'
  description,
  icon,
  progress,
}: OverviewStatCardProps) => (
  <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
    {/* Header: Title & Progress % */}
    <div className="flex items-center justify-between gap-4 mb-2">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
    </div>

    {/* Value Section */}
    <div className="flex items-end gap-2 mb-1">
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>

    {/* Progress Bar (Chỉ hiện nếu có) */}
    {typeof progress === 'number' && (
      <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}

    {/* Description & Icon Group (Gom nhóm nằm ngang cạnh nhau) */}
    {(description || icon) && (
      <div className={`mt-auto pt-4 flex items-center gap-1.5 ${color}`}>
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {description && (
          <p className="text-xs font-medium leading-none">
            {description}
          </p>
        )}
      </div>
    )}
  </div>
);