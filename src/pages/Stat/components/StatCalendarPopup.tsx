import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";

// Cấu hình tiếng Việt cho dayjs
dayjs.locale("vi");

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

interface StatCalendarPopupProps {
  value: dayjs.Dayjs;
  onChange: (d: dayjs.Dayjs) => void;
  onClose: () => void;
}

const StatCalendarPopup = ({ value, onChange, onClose }: StatCalendarPopupProps) => {
  const [view, setView] = useState(value);
  const [selected, setSelected] = useState(value);

  // Tính toán ngày bắt đầu của tháng để vẽ grid
  const startWeekday = (view.startOf("month").day() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: view.daysInMonth() }, (_, i) => i + 1),
  ];

  const handleSelect = (day: number) => {
    setSelected(view.date(day));
  };

  const handleConfirm = () => {
    onChange(selected);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-[24px] shadow-2xl shadow-blue-900/10 border border-slate-100 p-5" 
        style={{ width: 300 }}
        onClick={(e) => e.stopPropagation()} // Ngăn click bên trong làm đóng popup
      >
        {/* Header: Tháng / Năm và Nút điều hướng */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-[15px] font-bold text-slate-800 capitalize">
            {view.format("MMMM - YYYY")}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setView((v) => v.subtract(1, "month"))}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setView((v) => v.add(1, "month"))}
              className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Lịch Grid */}
        <div className="grid grid-cols-7 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs text-slate-400 font-bold py-1">
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-y-1.5 gap-x-1.5">
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const date = view.date(day);
            const isSelected = date.format("YYYY-MM-DD") === selected.format("YYYY-MM-DD");
            const isToday = date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
            
            return (
              <button
                key={i}
                onClick={() => handleSelect(day)}
                className={`w-full aspect-square flex items-center justify-center rounded-xl text-[13px] font-semibold transition-all duration-200
                  ${isSelected 
                    ? "bg-blue-500 text-white shadow-md shadow-blue-500/30 scale-105" 
                    : isToday 
                      ? "border-2 border-blue-500 text-blue-600" 
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-600"}`}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Nút hành động */}
        <div className="mt-5 flex gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold text-slate-500 hover:bg-slate-100 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-bold bg-blue-500 text-white hover:bg-blue-600 shadow-md shadow-blue-500/20 transition-all"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatCalendarPopup;
