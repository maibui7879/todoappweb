// src/components/Stats/StatHeader.tsx
import { useState } from "react";
import { Calendar } from "lucide-react";
import dayjs from "dayjs";
import { useAuth } from "../../../contexts/AuthContext";

// Import popup lịch mới tạo
import StatCalendarPopup from "./StatCalendarPopup"; 

interface StatHeaderProps {
  type: 'week' | 'month' | 'year';
  setType: (type: 'week' | 'month' | 'year') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
}

export const StatHeader = ({ type, setType, selectedDate, setSelectedDate }: StatHeaderProps) => {
  const { user } = useAuth();
  
  // State bật/tắt popup lịch
  const [showCalendar, setShowCalendar] = useState(false);

  // Tính toán dải ngày hiển thị
  const startDate = dayjs(selectedDate).startOf(type).format('DD/MM/YYYY');
  const endDate = dayjs(selectedDate).endOf(type).format('DD/MM/YYYY');

  const tabs = [
    { id: 'week', label: 'Tuần' },
    { id: 'month', label: 'Tháng' },
    { id: 'year', label: 'Năm' },
  ] as const;

  // Định nghĩa mã màu Gradient chung để tái sử dụng
  const gradientBg = "bg-gradient-to-r from-[#60A5FA] to-[#8B5CF6]"; // Xanh lam (blue-400) sang Tím (violet-500)
  const gradientText = "bg-gradient-to-r from-[#60A5FA] to-[#8B5CF6] text-transparent bg-clip-text";

  return (
    <div className="flex flex-col gap-5 sm:gap-6 mb-6 sm:mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
        <div>
          {/* THAY ĐỔI: Chữ text-2xl trên mobile, text-[32px] trên PC */}
          <h1 className={`text-2xl sm:text-[32px] font-[900] tracking-tight ${gradientText}`}>
            Hiệu suất công việc
          </h1>
          <p className="text-[#60A5FA] text-xs sm:text-sm mt-1 sm:mt-1.5 font-medium">
            Phân tích chi tiết và theo dõi tiến độ công việc hàng ngày của bạn.
          </p>
        </div>
        
        {/* THAY ĐỔI: w-full để đẩy dàn trải trên mobile */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
          {/* Tabs: overflow-x-auto để tránh vỡ nếu màn hình quá hẹp */}
          <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setType(tab.id)}
                className={`flex-1 sm:flex-none px-4 sm:px-7 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 whitespace-nowrap ${
                  type === tab.id 
                    ? `${gradientBg} text-white shadow-md shadow-indigo-200/50` 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-auto">
            <button 
              onClick={() => setShowCalendar(true)}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 ${gradientBg} hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-200/50`}
            >
              Ngày mốc : {dayjs(selectedDate).format('DD/MM/YYYY')}
              <Calendar size={18} className="ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Dải ngày trung tâm */}
      <div className="flex justify-center">
        <div className={`${gradientBg} text-white px-6 sm:px-8 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold shadow-md shadow-indigo-200/50 tracking-wide`}>
          {startDate}-{endDate}
        </div>
      </div>

      {/* Gọi Modal Lịch chuyên biệt */}
      {showCalendar && (
        <StatCalendarPopup
          value={dayjs(selectedDate)}
          onChange={(d) => setSelectedDate(d.format('YYYY-MM-DD'))}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
};