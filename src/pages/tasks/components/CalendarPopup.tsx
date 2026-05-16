// src/components/Task/CalendarPopup.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, RefreshCw, Clock } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";

dayjs.locale("vi");

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const REPEAT_UNITS = [
  { label: "Ngày", value: "DAILY" },
  { label: "Tuần", value: "WEEKLY" },
  { label: "Tháng", value: "MONTHLY" },
  { label: "Năm", value: "YEARLY" },
];

// ---------------- SCROLL COLUMN ----------------
const ScrollCol = ({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const ITEM_H = 40;

  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScroll = useRef(0);

  useEffect(() => {
    const idx = items.indexOf(value);

    if (ref.current) {
      ref.current.scrollTop = idx * ITEM_H;
    }
  }, []);

  const handleScroll = () => {
    if (!ref.current) return;

    const idx = Math.round(ref.current.scrollTop / ITEM_H);

    const clamped = Math.max(0, Math.min(idx, items.length - 1));

    if (items[clamped] !== value) {
      onChange(items[clamped]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!ref.current) return;

    isDragging.current = true;

    startY.current = e.clientY;

    startScroll.current = ref.current.scrollTop;

    ref.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !ref.current) return;

    e.preventDefault();

    const delta = e.clientY - startY.current;

    ref.current.scrollTop = startScroll.current - delta;
  };

  const stopDragging = () => {
    isDragging.current = false;

    if (ref.current) {
      ref.current.style.cursor = "grab";

      const idx = Math.round(ref.current.scrollTop / ITEM_H);

      ref.current.scrollTo({
        top: idx * ITEM_H,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative" style={{ width: 52 }}>
      {/* vùng highlight */}
      <div
        className="absolute inset-x-0 pointer-events-none z-10"
        style={{
          top: ITEM_H,
          height: ITEM_H,
          borderTop: "1.5px solid #8B5CF6",
          borderBottom: "1.5px solid #8B5CF6",
        }}
      />

      <div
        ref={ref}
        onScroll={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className="overflow-y-auto select-none"
        style={{
          height: ITEM_H * 3,
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          cursor: "grab",
          scrollBehavior: "smooth",
        }}
      >
        <div style={{ height: ITEM_H }} />

        {items.map((item) => (
          <div
            key={item}
            onClick={() => onChange(item)}
            style={{
              height: ITEM_H,
              scrollSnapAlign: "center",
            }}
            className={`flex items-center justify-center text-sm font-medium transition-colors
              ${item === value ? "text-[#8B5CF6] font-bold" : "text-gray-400"}`}
          >
            {item}
          </div>
        ))}

        <div style={{ height: ITEM_H }} />
      </div>
    </div>
  );
};

// ---------------- TIME PICKER ----------------
const TimePickerPopup = ({
  hour,
  minute,
  ampm,
  onHourChange,
  onMinuteChange,
  onAmpmChange,
  onCancel,
  onSet,
}: any) => {
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0"),
  );

  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  return (
    <div
      className="absolute left-full ml-2 top-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50"
      style={{ width: 200 }}
    >
      <p className="text-sm font-bold text-gray-800 mb-3">Đặt giờ</p>

      <div className="flex items-center gap-1 justify-center mb-4">
        <ScrollCol items={hours} value={hour} onChange={onHourChange} />

        <span className="text-gray-300 text-lg">:</span>

        <ScrollCol items={minutes} value={minute} onChange={onMinuteChange} />

        <ScrollCol items={["AM", "PM"]} value={ampm} onChange={onAmpmChange} />
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-1.5 rounded-xl text-xs text-gray-500 hover:bg-gray-100 border border-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={onSet}
          className="flex-1 py-1.5 rounded-xl text-xs bg-[#8B5CF6] text-white hover:bg-[#7C3AED]"
        >
          Set
        </button>
      </div>
    </div>
  );
};

// ---------------- MINI CALENDAR ----------------
const MiniCalendar = ({
  value,
  onChange,
}: {
  value: dayjs.Dayjs;
  onChange: (d: dayjs.Dayjs) => void;
}) => {
  const [view, setView] = useState(value);

  const startWeekday = (view.startOf("month").day() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array(startWeekday).fill(null),
    ...Array.from({ length: view.daysInMonth() }, (_, i) => i + 1),
  ];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-gray-800">
          {view.format("MMMM YYYY")}
        </span>

        <div className="flex gap-1">
          <button
            onClick={() => setView((v) => v.subtract(1, "month"))}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
          >
            <ChevronLeft size={13} />
          </button>

          <button
            onClick={() => setView((v) => v.add(1, "month"))}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs text-[#8B5CF6] font-semibold py-1"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;

          const date = view.date(day);

          const isSelected =
            date.format("YYYY-MM-DD") === value.format("YYYY-MM-DD");

          const isToday =
            date.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");

          return (
            <button
              key={i}
              onClick={() => onChange(date)}
              className={`w-full aspect-square flex items-center justify-center rounded-lg text-xs font-medium transition-all
                ${
                  isSelected
                    ? "bg-[#8B5CF6] text-white"
                    : isToday
                      ? "border border-[#8B5CF6] text-[#8B5CF6]"
                      : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MiniCalendar;
