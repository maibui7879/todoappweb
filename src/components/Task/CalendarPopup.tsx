// src/components/Task/CalendarPopup.tsx
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, RefreshCw } from "lucide-react";
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

const RepeatPickerPopup = ({
  interval,
  unit,
  onIntervalChange,
  onUnitChange,
  onCancel,
  onSet,
}: any) => (
  <div
    className="absolute left-full ml-2 top-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50"
    style={{ width: 200 }}
  >
    <p className="text-sm font-bold text-gray-800 mb-3">Lặp lại</p>
    <div className="flex items-center gap-2 mb-3">
      <input
        type="number"
        min={1}
        max={99}
        value={interval}
        onChange={(e) => onIntervalChange(Number(e.target.value))}
        className="w-14 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center outline-none focus:border-[#8B5CF6]"
      />
      <div className="flex-1 flex flex-col gap-0.5">
        {REPEAT_UNITS.map((u) => (
          <button
            key={u.value}
            onClick={() => onUnitChange(u.value)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-all
              ${unit === u.value ? "text-[#8B5CF6] font-semibold bg-[#EDE9FE]" : "text-gray-500 hover:text-gray-700"}`}
          >
            {unit === u.value ? "✓" : <span className="w-3 inline-block" />}{" "}
            {u.label}
          </button>
        ))}
      </div>
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

export interface RepeatData {
  isMaster: boolean;
  repeatUnit: string;
  repeatInterval: number;
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
    repeatData.repeatInterval,
  );
  const [repeatUnit, setRepeatUnit] = useState(
    repeatData.repeatUnit === "NONE" ? "DAILY" : repeatData.repeatUnit,
  );

  const handleTimeSet = () => {
    let h = parseInt(hour);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    onChange(value.hour(h).minute(parseInt(minute)).second(0));
    setShowTime(false);
  };

  const handleRepeatSet = () => {
    onRepeatChange({ isMaster: true, repeatUnit, repeatInterval });
    setShowRepeat(false);
  };

  const handleRepeatCancel = () => {
    onRepeatChange({ isMaster: false, repeatUnit: "NONE", repeatInterval: 1 });
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
                  onIntervalChange={setRepeatInterval}
                  onUnitChange={setRepeatUnit}
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
