import React from 'react';
import StatCard from './StatCard';
import { Progress } from 'antd';
// Import đúng type từ repo gốc
import type { OverviewResponse } from '../../../types/stat.type';

interface OverviewGridProps {
  overview: OverviewResponse | null;
}

export const OverviewGrid: React.FC<OverviewGridProps> = ({ overview }) => {
  // Bóc tách an toàn từ overview
  const {
    total = 0,
    completed = 0,
    pending = 0,
    overdue = 0,
    important = 0,
    completionRate = 0
  } = overview || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 font-['Archivo']">
      {/* Cột trái: Tỷ lệ hoàn thành */}
      <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-50 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-full mb-6 text-left">
          <h1 className="text-xl font-[800] text-indigo-900">Tỷ lệ hoàn thành</h1>
          <p className="text-indigo-400 text-sm font-medium">Tiến độ đạt được tính đến thời điểm hiện tại</p>
        </div>
        
        <div className="relative flex items-center justify-center">
          <Progress
            type="circle"
            percent={completionRate}
            strokeColor={{
              '0%': '#60A5FA',
              '100%': '#8B5CF6',
            }}
            strokeWidth={12}
            size={200}
            railColor="#F3F4F6"
            format={(percent) => (
              <div className="flex flex-col items-center">
                <span className="text-4xl font-[900] text-slate-800 tracking-tighter">{percent}%</span>
                <span className="text-[11px] font-[800] text-slate-400 uppercase tracking-widest mt-1">Hoàn thành</span>
              </div>
            )}
          />
        </div>
      </div>

      {/* Cột phải: Thẻ chỉ số phụ */}
      <div className="flex flex-col gap-4">
        <StatCard 
          label="Quá Hạn" 
          value={overdue} 
          subLabel="Cần xử lý ngay" 
          type="overdue" 
        />
        <StatCard 
          label="Quan Trọng" 
          value={important} 
          subLabel="Có gắn dấu sao" 
          type="important" 
        />
        <StatCard 
          label="Tiến độ" 
          value={`${completed}/${total}`} 
          subLabel={`${pending} việc đang chờ hoàn thành`} 
          type="progress" 
        />
      </div>
    </div>
  );
};