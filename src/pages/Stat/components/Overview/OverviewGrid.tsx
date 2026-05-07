import React, { useState } from 'react';
import StatCard from './StatCard';
import type { OverviewResponse } from '../../../../types/stat.type';

interface OverviewGridProps {
  overview: OverviewResponse | null;
}

export const OverviewGrid: React.FC<OverviewGridProps> = ({ overview }) => {
  // Bóc tách dữ liệu
  const {
    total = 0,
    completed = 0,
    pending = 0,
    overdue = 0,
    important = 0,
    completionRate = 0
  } = overview || {};

  // Trạng thái hover
  const [hoveredPart, setHoveredPart] = useState<'completed' | 'uncompleted' | null>(null);

  // Thông số SVG
  const size = 200;              
  const baseStrokeWidth = 25; 
  const hoverStrokeWidth = 32; 
  
  const center = size / 2;
  const radius = center - baseStrokeWidth;
  const circumference = 2 * Math.PI * radius; 
  const gapLength = 5; 

  let arc1Length = (completionRate / 100) * circumference - gapLength;
  let arc2Length = ((100 - completionRate) / 100) * circumference - gapLength;

  if (arc1Length < 0) arc1Length = 0;
  if (arc2Length < 0) arc2Length = 0;

  const arc1Angle = (gapLength / 2) / circumference * 360;
  const arc2Angle = ((completionRate / 100) * circumference + gapLength / 2) / circumference * 360;

  
  const displayPercent = hoveredPart === 'uncompleted' ? (100 - completionRate) : completionRate;
  const displayLabel = hoveredPart === 'uncompleted' ? 'Chưa xong' : 'Hoàn thành';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 font-['Archivo'] " >
      <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm flex flex-col items-center justify-center min-h-[300px] border border-2 border-[#C4B5FD] transition-all hover:shadow-md">
        <div className="w-full mb-6 text-left">
          <h1 className="text-xl font-[800] text-indigo-900">Tỷ lệ hoàn thành</h1>
          <p className="text-indigo-400 text-sm font-medium">Tiến độ hoàn thành tasks tính đến thời điểm hiện tại</p>
        </div>
        
        <div className="relative flex items-center justify-center flex-1 w-full">
          <div className="relative flex justify-center items-center" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm">
              <defs>
                <linearGradient id="gradientColor" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>

              {/* Phần hoàn thành */}
              {completionRate > 0 && (
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="url(#gradientColor)"
                  strokeWidth={hoveredPart === 'completed' ? hoverStrokeWidth : baseStrokeWidth}
                  strokeDasharray={`${arc1Length} ${circumference}`}
                  transform={`rotate(${arc1Angle} ${center} ${center})`}
                  style={{ 
                    transition: 'all 0.3s ease', 
                    cursor: 'pointer',
                    opacity: hoveredPart === 'uncompleted' ? 0.4 : 1 
                  }}
                  onMouseEnter={() => setHoveredPart('completed')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
              )}

              {/* Phần chưa hoàn thành */}
              {completionRate < 100 && (
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#C4B5FD"
                  strokeWidth={hoveredPart === 'uncompleted' ? hoverStrokeWidth : baseStrokeWidth}
                  strokeDasharray={`${arc2Length} ${circumference}`} 
                  transform={`rotate(${arc2Angle} ${center} ${center})`} 
                  style={{ 
                    transition: 'all 0.3s ease', 
                    cursor: 'pointer',
                    opacity: hoveredPart === 'completed' ? 0.4 : 1
                  }}
                  onMouseEnter={() => setHoveredPart('uncompleted')}
                  onMouseLeave={() => setHoveredPart(null)}
                />
              )}
            </svg>

            {/* Khối văn bản trung tâm */}
            <div className="absolute inset-0 flex flex-col items-center justify-center mt-2 pointer-events-none transition-all duration-300">
              <span className={`text-[30px] font-[900] tracking-tighter leading-none transition-colors ${hoveredPart === 'uncompleted' ? 'text-indigo-400' : 'text-slate-800'}`}>
                {displayPercent}%
              </span>
              <span className="text-[11px] font-[800] text-slate-400 uppercase tracking-widest mt-2">
                {displayLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <StatCard label="Quá Hạn" value={overdue} subLabel="Cần xử lý ngay" type="overdue" />
        <StatCard label="Quan Trọng" value={important} subLabel="Có gắn dấu sao" type="important" />
        <StatCard label="Tiến độ" value={`${completed}/${total}`} subLabel={`${pending} việc đang chờ hoàn thành`} type="progress" />
      </div>
    </div>
  );
};