// src/pages/Stats/components/Overview/StatCard.tsx
import React from 'react';
import { TriangleAlert, Star, ListTodo } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  type: 'overdue' | 'important' | 'progress';
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subLabel, type }) => {
  const config = {
    overdue: {
      // Dùng TriangleAlert (tam giác) và đổ màu fill cho giống ảnh
      icon: <TriangleAlert size={24} className="text-red-500"  />,
      textColor: 'text-red-500',
      borderColor: 'border-red-500'
    },
    important: {
      icon: <Star size={24} className="text-orange-400" fill="currentColor" />,
      textColor: 'text-orange-400',
      borderColor: 'border-orange-400'
    },
    progress: {
      // Đổi thành ListTodo cho giống icon danh sách check trong ảnh
      icon: <ListTodo size={24} className="text-[#2DD4BF]" />,
      textColor: 'text-[#2DD4BF]',
      borderColor: 'border-[#2DD4BF]'
    },
  };

  const { icon, textColor, borderColor } = config[type];

  return (
    
    <div className={`group flex items-center gap-4 bg-white p-5 rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] cursor-pointer`}>
      
      <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110 ${borderColor}`}>
        {icon}
      </div>
      
      
      <div className="flex flex-col justify-center">
        <span className={`text-[13px] font-[800] ${textColor} uppercase tracking-wide mb-1.5`}>
          {label}
        </span>
        
        {/* Số to nằm ở giữa, sát với các dòng chữ để không bị rời rạc */}
        <span className={`text-[28px] font-[900] ${textColor} leading-tight`}>
          {value}
        </span>
        
        {/* SubLabel nằm dưới cùng */}
        {subLabel && (
          <span className={`text-[12px] font-medium ${textColor} opacity-80`}>
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;