import type { OverviewStatCardProps } from '../../../types/stat.type';

export const StatCard = ({
  title,
  value,
  color,
  description,
  progress,
}: OverviewStatCardProps) => (
  <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
    <div className="flex items-center justify-between gap-4 mb-4">
      <p className="text-sm text-gray-500">{title}</p>
      {typeof progress === 'number' && (
        <span className="text-xs font-medium text-gray-400">{progress}%</span>
      )}
    </div>

    <div className="flex items-end gap-2">
      <p className={`text-3xl font-semibold ${color}`}>{value}</p>
    </div>

    {typeof progress === 'number' && (
      <div className="mt-4 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-violet-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}

    {description && (
      <p className="mt-4 text-xs text-gray-400 leading-relaxed">{description}</p>
    )}
  </div>
);
