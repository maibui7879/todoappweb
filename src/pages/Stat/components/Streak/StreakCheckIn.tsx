import React from 'react';
import { Check, Flame, Trophy } from 'lucide-react';

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
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  
  // Điều kiện để bật giao diện rực rỡ (từ 3 ngày trở lên)
  const isHotStreak = currentStreak >= 3;

  return (
<div className={`w-full p-8 rounded-[32px] flex items-center justify-between shadow-sm mb-8 transition-all duration-500 ${
      isHotStreak 
        ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400 text-white shadow-indigo-200/50' 
        : 'bg-[#F1F5F9] text-slate-800 border border-2 border-slate-200 border-[#8B5CF6]/20' 
    }`}>
      {/* Cột trái: Rank (Lấy từ longestStreak) */}
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl backdrop-blur-sm transition-colors ${
          isHotStreak ? 'bg-white/20' : 'bg-slate-100'
        }`}>
          <Trophy size={32} className={isHotStreak ? 'text-yellow-300' : 'text-yellow-500'} />
        </div>
        <div>
          <div className={` py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit transition-colors ${
            isHotStreak ? 'bg-white/30' : 'bg-slate-100 text-slate-500'
          }`}>
            Bảng xếp hạng
          </div>
          <div className="text-3xl font-black mt-1">{longestStreak} ngày!</div>
          <div className={`text-xs font-medium transition-colors ${
            isHotStreak ? 'opacity-80' : 'text-slate-500'
          }`}>Duy trì bền bỉ nhất</div>
        </div>
      </div>

      {/* Cột giữa: Lịch sử 7 ngày */}
      <div className="flex gap-4">
        {status.slice(0, 7).map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border-2 transition-all
              ${day.isActive 
                ? (isHotStreak 
                    ? 'bg-white text-indigo-600 border-white shadow-lg' // Style khi có gradient
                    : 'bg-indigo-500 text-white border-indigo-500 shadow-md') // Style khi nền trắng
                : (isHotStreak 
                    ? 'bg-white/10 border-white/20 text-white/40' 
                    : 'bg-slate-50 border-slate-200 text-slate-400')}`}
            >
              {day.isActive 
                ? <Check size={20} strokeWidth={4} /> 
                : <div className={`w-1.5 h-1.5 rounded-full ${isHotStreak ? 'bg-white/20' : 'bg-slate-300'}`} />}
            </div>
            <span className={`text-[10px] font-bold uppercase transition-colors ${
              isHotStreak ? 'opacity-70' : 'text-slate-400'
            }`}>{days[day.dayOfWeek]}</span>
          </div>
        ))}
      </div>

      {/* Cột phải: Flame (Lấy từ currentStreak) */}
      <div className="text-right flex items-center gap-4">
        <div>
          <div className="text-2xl font-black">{currentStreak} ngày streak!</div>
          <div className={`text-xs italic transition-colors ${
            isHotStreak ? 'opacity-90' : 'text-slate-500'
          }`}>
            {isHotStreak 
              ? "You're on fire! Keep it up!" 
              : "Cố gắng đạt 3 ngày liên tiếp nhé!"}
          </div>
        </div>
        <div className="relative">
           {/* Hiệu ứng sáng chỉ bật khi isHotStreak là true */}
           {isHotStreak && <div className="absolute inset-0 bg-orange-400 blur-xl opacity-50 animate-pulse"></div>}
           <Flame 
              size={48} 
              className={`relative z-10 transition-colors duration-500 ${
                isHotStreak ? 'text-orange-300' : 'text-slate-200'
              }`} 
              fill="currentColor" 
           />
        </div>
      </div>
    </div>
  );
};