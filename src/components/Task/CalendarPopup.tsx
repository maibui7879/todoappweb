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
  useEffect(() => {
    const idx = items.indexOf(value);
    if (ref.current) ref.current.scrollTop = idx * ITEM_H;
  }, []);
  const handleScroll = () => {
    if (!ref.current) return;
    const idx = Math.round(ref.current.scrollTop / ITEM_H);
    const c = Math.max(0, Math.min(idx, items.length - 1));
    if (items[c] !== value) onChange(items[c]);
  };
  return (
    <div className="relative" style={{ width: 52 }}>
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
        className="overflow-y-auto"
        style={{
          height: ITEM_H * 3,
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
        }}
      >
        <div style={{ height: ITEM_H }} />
        {items.map((item) => (
          <div
            key={item}
            onClick={() => onChange(item)}
            style={{ height: ITEM_H, scrollSnapAlign: "center" }}
            className={`flex items-center justify-center text-sm font-medium cursor-pointer transition-colors
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

// ---- TIME PICKER POPUP ----
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

// ---- MINI CALENDAR (reusable) ----
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
                ${isSelected ? "bg-[#8B5CF6] text-white" : isToday ? "border border-[#8B5CF6] text-[#8B5CF6]" : "text-gray-700 hover:bg-gray-100"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ---- REPEAT PICKER POPUP ----
const RepeatPickerPopup = ({
  interval,
  unit,
  endType,
  endDate,
  onIntervalChange,
  onUnitChange,
  onEndTypeChange,
  onEndDateChange,
  onCancel,
  onSet,
}: any) => {
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const endDateDayjs = dayjs(endDate);

  return (
    // anchor bottom so popup grows upward — tránh bị cắt khi gần đáy màn hình
    <div
      className="absolute left-full ml-2 bottom-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50"
      style={{ width: 240 }}
    >
      <p className="text-sm font-bold text-gray-800 mb-3">Lặp lại</p>

      {/* Interval + Unit */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onIntervalChange(Math.max(1, interval - 1))}
            className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 text-sm"
          >
            −
          </button>
          <span className="px-3 py-1.5 text-sm font-medium min-w-[32px] text-center">
            {interval}
          </span>
          <button
            onClick={() => onIntervalChange(Math.min(99, interval + 1))}
            className="px-2 py-1.5 text-gray-500 hover:bg-gray-100 text-sm"
          >
            +
          </button>
        </div>
        <select
          value={unit}
          onChange={(e) => onUnitChange(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#8B5CF6] bg-white"
        >
          {REPEAT_UNITS.map((u) => (
            <option key={u.value} value={u.value}>
              {u.label}
            </option>
          ))}
        </select>
      </div>

      {/* Kết thúc */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-600 mb-2">Kết thúc</p>
        <div className="flex flex-col gap-2">
          {/* Never */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
              ${endType === "never" ? "border-[#8B5CF6] bg-[#8B5CF6]" : "border-gray-300 group-hover:border-[#8B5CF6]"}`}
              onClick={() => {
                onEndTypeChange("never");
                setShowEndCalendar(false);
              }}
            >
              {endType === "never" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <span className="text-xs text-gray-700">Không bao giờ</span>
          </label>

          {/* On date */}
          <label className="flex items-center gap-2 cursor-pointer group">
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0
              ${endType === "date" ? "border-[#8B5CF6] bg-[#8B5CF6]" : "border-gray-300 group-hover:border-[#8B5CF6]"}`}
              onClick={() => onEndTypeChange("date")}
            >
              {endType === "date" && (
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </div>
            <span className="text-xs text-gray-700 flex-shrink-0">Vào</span>
            {endType === "date" && (
              <button
                onClick={() => setShowEndCalendar((v) => !v)}
                className={`flex-1 text-xs px-2 py-1 rounded-lg border transition-colors text-left font-medium
                  ${showEndCalendar ? "border-[#8B5CF6] bg-[#EDE9FE] text-[#8B5CF6]" : "border-gray-200 text-gray-700 hover:border-[#8B5CF6]"}`}
              >
                {endDateDayjs.format("DD/MM/YYYY")}
              </button>
            )}
          </label>
        </div>

        {/* End date calendar — bên phải RepeatPopup, anchor bottom để mở lên trên */}
        {endType === "date" && showEndCalendar && (
          <div
            className="absolute left-full ml-2 bottom-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50"
            style={{ width: 260 }}
          >
            <p className="text-xs font-semibold text-[#8B5CF6] mb-3">
              Chọn ngày kết thúc
            </p>
            <MiniCalendar
              value={endDateDayjs}
              onChange={(d) => {
                onEndDateChange(d.format("YYYY-MM-DD"));
                setShowEndCalendar(false);
              }}
            />
          </div>
        )}
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

export interface RepeatData {
  isMaster: boolean;
  repeatUnit: string;
  repeatInterval: number;
  endDate?: string;
}

interface CalendarPopupProps {
  value: dayjs.Dayjs;
  onChange: (d: dayjs.Dayjs) => void;
  onClose: () => void;
  repeatData: RepeatData;
  onRepeatChange: (data: RepeatData) => void;
}

const CalendarPopup = ({
  value,
  onChange,
  onClose,
  repeatData,
  onRepeatChange,
}: CalendarPopupProps) => {
  const [hour, setHour] = useState(
    value.hour() === 0 ? "12" : value.format("hh"),
  );
  const [minute, setMinute] = useState(value.format("mm"));
  const [ampm, setAmpm] = useState(value.hour() >= 12 ? "PM" : "AM");
  const [showTime, setShowTime] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [repeatInterval, setRepeatInterval] = useState(
    repeatData.repeatInterval || 1,
  );
  const [repeatUnit, setRepeatUnit] = useState(
    repeatData.repeatUnit === "NONE" ? "DAILY" : repeatData.repeatUnit,
  );
  const [endType, setEndType] = useState<"never" | "date">(
    repeatData.endDate ? "date" : "never",
  );
  const [endDate, setEndDate] = useState(
    repeatData.endDate || dayjs().add(1, "month").format("YYYY-MM-DD"),
  );

  const handleTimeSet = () => {
    let h = parseInt(hour);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    onChange(value.hour(h).minute(parseInt(minute)).second(0));
    setShowTime(false);
  };

  const handleRepeatSet = () => {
    onRepeatChange({
      isMaster: true,
      repeatUnit,
      repeatInterval,
      endDate: endType === "date" ? endDate : undefined,
    });
    setShowRepeat(false);
  };

  const handleRepeatCancel = () => {
    onRepeatChange({
      isMaster: false,
      repeatUnit: "NONE",
      repeatInterval: 1,
      endDate: undefined,
    });
    setShowRepeat(false);
  };

  const repeatLabel = repeatData.isMaster
    ? `Mỗi ${repeatData.repeatInterval} ${REPEAT_UNITS.find((u) => u.value === repeatData.repeatUnit)?.label.toLowerCase()}`
    : "Lặp lại";

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative z-50" onClick={(e) => e.stopPropagation()}>
        <div
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-5"
          style={{ width: 280 }}
        >
          <MiniCalendar
            value={value}
            onChange={(d) =>
              onChange(d.hour(value.hour()).minute(value.minute()))
            }
          />
          <div className="border-t border-gray-100 mt-3 pt-3 flex flex-col gap-1">
            {/* Time picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowTime((v) => !v);
                  setShowRepeat(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-colors
                  ${showTime ? "bg-[#EDE9FE] text-[#8B5CF6]" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <Clock size={14} /> {`${hour}:${minute} ${ampm}`}
              </button>
              {showTime && (
                <TimePickerPopup
                  hour={hour}
                  minute={minute}
                  ampm={ampm}
                  onHourChange={setHour}
                  onMinuteChange={setMinute}
                  onAmpmChange={setAmpm}
                  onCancel={() => setShowTime(false)}
                  onSet={handleTimeSet}
                />
              )}
            </div>
            {/* Repeat picker */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowRepeat((v) => !v);
                  setShowTime(false);
                }}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-colors
                  ${repeatData.isMaster || showRepeat ? "bg-[#EDE9FE] text-[#8B5CF6]" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <RefreshCw size={14} /> {repeatLabel}
              </button>
              {showRepeat && (
                <RepeatPickerPopup
                  interval={repeatInterval}
                  unit={repeatUnit}
                  endType={endType}
                  endDate={endDate}
                  onIntervalChange={setRepeatInterval}
                  onUnitChange={setRepeatUnit}
                  onEndTypeChange={setEndType}
                  onEndDateChange={setEndDate}
                  onCancel={handleRepeatCancel}
                  onSet={handleRepeatSet}
                />
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium py-2 rounded-xl transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarPopup;
