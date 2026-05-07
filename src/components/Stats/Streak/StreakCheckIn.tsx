import { Check } from 'lucide-react';

interface DayStatus {
  date: string;
  dayOfWeek: number;
  isActive: boolean;
}

export const StreakCheckIn = ({ status }: { status: DayStatus[] }) => {
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  return (
    <div className="bg-white p-7 rounded-3xl shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
      <h3 className="text-[17px] font-bold text-slate-800 mb-6">7 ngày gần nhất</h3>
      <div className="flex justify-between items-center">
        {status.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">{days[day.dayOfWeek]}</span>
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
                ${day.isActive 
                  ? 'bg-green-500 text-white shadow-[0_4px_12px_rgba(34,197,94,0.3)]' 
                  : 'bg-slate-100 text-transparent'}`}
            >
              {day.isActive && <Check size={20} strokeWidth={3} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
