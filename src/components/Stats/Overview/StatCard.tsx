import React from 'react';
import { AlertCircle, Star, CheckCircle2 } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  type: 'overdue' | 'important' | 'progress';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subLabel, type }) => {
  const config = {
    overdue: {
      icon: <AlertCircle size={24} className="text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-500',
    },
    important: {
      icon: <Star size={24} className="text-orange-400" fill="currentColor" />,
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-400',
    },
    progress: {
      icon: <CheckCircle2 size={24} className="text-emerald-500" />,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-500',
    },
  };

  const { icon, bgColor, textColor } = config[type];

  return (
    <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
      <div className={`w-14 h-14 rounded-2xl ${bgColor} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className={`text-[13px] font-[800] uppercase tracking-wider ${textColor}`}>
          {label}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-[900] text-slate-800">{value}</span>
          {subLabel && (
            <span className={`text-[12px] font-bold ${textColor} opacity-80`}>
              {subLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;