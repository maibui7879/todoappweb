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
    // THAY ĐỔI: p-5 sm:p-8 (padding nhỏ trên mobile)
    <div className="relative w-full p-6 sm:p-8 rounded-[20px] sm:rounded-[32px] flex flex-col xl:flex-row items-center justify-between bg-[#B8BEF6] text-white shadow-sm mb-6 sm:mb-8 overflow-hidden font-['Archivo']">
      
      {/* Ẩn bớt lửa trên mobile để đỡ lấn chiếm text */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 opacity-[0.05] sm:opacity-10 pointer-events-none animate-pulse duration-1000">
        <Flame className="w-[200px] h-[200px] sm:w-[320px] sm:h-[320px]" fill="currentColor" strokeWidth={0} />
      </div>

      <div className="relative z-10 flex flex-col items-center xl:items-start text-center xl:text-left w-full xl:w-auto mb-8 xl:mb-0">
        <div className="flex items-center gap-3 mb-2 sm:mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-lg shadow-pink-500/30 hover:scale-110 transition-transform cursor-default">
            <Flame size={20} className="text-white sm:w-6 sm:h-6" fill="currentColor" strokeWidth={1.5} />
          </div>
          <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-[900] bg-gradient-to-r from-[#A855F7] to-[#EC4899] tracking-wider shadow-sm">
            Kỉ lục
          </div>
        </div>
        
        <div>
          {/* Chữ nhỏ hơn trên mobile */}
          <div className="text-4xl sm:text-[54px] font-[900] leading-none tracking-tight">
            {longestStreak} ngày
          </div>
          <div className="text-sm sm:text-[16px] font-[700] mt-1 sm:mt-1.5 opacity-90">
            Duy trì liên tục!
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center xl:pl-8 w-full xl:w-auto">
        {/* flex-wrap để 7 ngày rớt dòng trên màn hình cực nhỏ (như iPhone SE) */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 lg:gap-5 mb-4 sm:mb-5">
          {status.slice(0, 7).map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform duration-300 ease-out hover:-translate-y-1 hover:scale-110 cursor-pointer">
              <span className="text-[11px] sm:text-[13px] font-[800] opacity-80">
                {dayLabels[day.dayOfWeek]}
              </span>
              {day.isActive ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-md shadow-pink-500/30">
                  <Check className="w-4 h-4 sm:w-[22px] sm:h-[22px]" strokeWidth={4} />
                </div>
              ) : (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center">
                  <Snowflake className="w-5 h-5 sm:w-[26px] sm:h-[26px] text-[#3B82F6]" strokeWidth={2.5} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-1">
          <div className="text-xl sm:text-[28px] font-[900] tracking-wide mb-1 sm:mb-1.5 drop-shadow-sm">
            Bạn hiện đang có {currentStreak} ngày streak !
          </div>
          <div className="text-[11px] sm:text-[13px] font-[700] opacity-90 drop-shadow-sm">
            You're on fire ! Keep the flame lit every day!
          </div>
        </div>
      </div>

    </div>
  );
};