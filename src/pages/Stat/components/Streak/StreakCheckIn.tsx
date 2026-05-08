// src/pages/Stats/components/Streak/StreakCheckIn.tsx
import React from 'react';
import { Check, Flame, Snowflake } from 'lucide-react';

interface DayStatus {
  date: string;
  dayOfWeek: number;
  isActive: boolean;
}

interface StreakProps {
  status: DayStatus[];
  currentStreak?: number; 
  longestStreak?: number; 
}

export const StreakCheckIn = ({ status, currentStreak = 0, longestStreak = 0 }: StreakProps) => {
  // Map ký hiệu ngày giống ảnh thiết kế (Bắt đầu là CN = Su, T2 = M,...)
  const dayLabels = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
  
  return (
    <div className="relative w-full p-8 rounded-[10px] flex flex-col md:flex-row items-center justify-between bg-[#B8BEF6] text-white shadow-sm mb-8 overflow-hidden font-['Archivo']">
      
      {/* HIỆU ỨNG: Thêm 'animate-pulse' cho ngọn lửa nền để nó sáng tối nhẹ nhàng */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none animate-pulse duration-1000">
        <Flame size={320} fill="currentColor" strokeWidth={0} />
      </div>

      {/* --- CỤM BÊN TRÁI: THÔNG TIN TỔNG QUAN --- */}
      <div className="relative z-10 flex flex-col justify-center w-full md:w-auto mb-6 md:mb-0">
        
        {/* Hàng 1: Icon Lửa + Tag */}
        <div className="flex items-center gap-3 mb-3">
          {/* HIỆU ỨNG: Lửa nhỏ xoay nhẹ liên tục hoặc hover nảy */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-lg shadow-pink-500/30 hover:scale-110 transition-transform cursor-default">
            <Flame size={24} className="text-white" fill="currentColor" strokeWidth={1.5} />
          </div>
          <div className="px-3.5 py-1.5 rounded-full text-[11px] font-[900] bg-gradient-to-r from-[#A855F7] to-[#EC4899] tracking-wider shadow-sm">
            Kỉ lục
          </div>
        </div>
        
        {/* Hàng 2: Text số ngày */}
        <div>
          <div className="text-[54px] font-[900] leading-none tracking-tight">
            {longestStreak} ngày
          </div>
          <div className="text-[16px] font-[700] mt-1.5 opacity-90">
            Duy trì liên tục!
          </div>
        </div>
      </div>

      {/* --- CỤM BÊN PHẢI: LỊCH SỬ 7 NGÀY --- */}
      <div className="relative z-10 flex flex-col items-center md:pl-8">
        
        {/* Dải 7 ngày */}
        <div className="flex gap-4 sm:gap-5 mb-5">
          {status.slice(0, 7).map((day, idx) => (
            // HIỆU ỨNG: Hover vào từng ngày sẽ nảy lên (hover:-translate-y-1 hover:scale-110)
            <div key={idx} className="flex flex-col items-center gap-2 transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-110 cursor-pointer">
              {/* Ký hiệu ngày nằm ở trên */}
              <span className="text-[13px] font-[800] opacity-80">
                {dayLabels[day.dayOfWeek]}
              </span>
              
              {/* Icon ngày */}
              {day.isActive ? (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-md shadow-pink-500/30">
                  <Check size={22} strokeWidth={4} />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                  {/* Icon Bông tuyết màu xanh dương cho ngày đứt streak */}
                  <Snowflake size={26} className="text-[#3B82F6]" strokeWidth={2.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Thông điệp Streak bên dưới */}
        <div className="text-center mt-1">
          <div className="text-[28px] font-[900] tracking-wide mb-1.5 drop-shadow-sm">
            Bạn hiện đang có {currentStreak} ngày streak !
          </div>
          <div className="text-[13px] font-[700] opacity-90 drop-shadow-sm">
            You're on fire ! Keep the flame lit every day!
          </div>
        </div>
      </div>

    </div>
  );
};