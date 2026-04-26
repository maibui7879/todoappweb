// src/pages/tasks/TasksPage.tsx
import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { taskApi } from "../../api/task.api";
import { categoryApi } from "../../api/category.api";
import { type Task } from "../../types/task.type";
import { type Category } from "../../types/category.type";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Clock,
} from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

type FilterStatus = "all" | "todo" | "done";
type FilterView = "day" | "week";

const getWeekDays = (baseDate: dayjs.Dayjs) => {
  const start = baseDate.startOf("week");
  return Array.from({ length: 7 }, (_, i) => start.add(i, "day"));
};

const COLORS = [
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#06B6D4",
  "#84CC16",
];
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ---- SCROLL COLUMN ----
const ScrollCol = ({
  items,
  value,
  onChange,
}: {
  items: string[];
  value: string;
  onChange: (v: string) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const ITEM_H = 40;

  useEffect(() => {
    const idx = items.indexOf(value);
    if (containerRef.current) {
      containerRef.current.scrollTop = idx * ITEM_H;
    }
  }, []);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const idx = Math.round(containerRef.current.scrollTop / ITEM_H);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    if (items[clamped] !== value) onChange(items[clamped]);
  };

  return (
    <div className="relative" style={{ width: 52 }}>
      {/* highlight bar */}
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
        ref={containerRef}
        onScroll={handleScroll}
        className="overflow-y-auto"
        style={{
          height: ITEM_H * 3,
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
        }}
      >
        {/* padding top & bottom so first/last items can center */}
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
  const ampmItems = ["AM", "PM"];

  return (
    <div
      className="absolute left-full ml-2 top-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50"
      style={{ width: 200 }}
    >
      <p className="text-sm font-bold text-gray-800 mb-3">Đặt giờ</p>
      <div className="flex items-center gap-1 justify-center mb-4">
        <ScrollCol items={hours} value={hour} onChange={onHourChange} />
        <span className="text-gray-300 text-lg font-light">:</span>
        <ScrollCol items={minutes} value={minute} onChange={onMinuteChange} />
        <ScrollCol items={ampmItems} value={ampm} onChange={onAmpmChange} />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 py-1.5 rounded-xl text-xs text-gray-500 hover:bg-gray-100 transition-colors border border-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={onSet}
          className="flex-1 py-1.5 rounded-xl text-xs bg-[#8B5CF6] text-white hover:bg-[#7C3AED] transition-colors"
        >
          Set
        </button>
      </div>
    </div>
  );
};

// ---- MINI CALENDAR ----
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

// ---- CALENDAR POPUP ----
const CalendarPopup = ({
  value,
  onChange,
  onClose,
}: {
  value: dayjs.Dayjs;
  onChange: (d: dayjs.Dayjs) => void;
  onClose: () => void;
}) => {
  const [hour, setHour] = useState(
    value.format("hh") === "00" ? "12" : value.format("hh"),
  );
  const [minute, setMinute] = useState(value.format("mm"));
  const [ampm, setAmpm] = useState(value.hour() >= 12 ? "PM" : "AM");
  const [showTime, setShowTime] = useState(false);

  const handleTimeSet = () => {
    let h = parseInt(hour);
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    onChange(value.hour(h).minute(parseInt(minute)).second(0));
    setShowTime(false);
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="relative z-50 flex items-start gap-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Calendar card */}
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
                onClick={() => setShowTime((v) => !v)}
                className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm transition-colors
                  ${showTime ? "bg-[#EDE9FE] text-[#8B5CF6]" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <Clock size={14} />
                {`${hour}:${minute} ${ampm}`}
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
            <button className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                <path
                  d="M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Lặp lại
            </button>
          </div>
          <button
            onClick={onClose}
            className="w-full mt-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium py-2 rounded-xl transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

// ---- TASK MODAL ----
const TaskModal = ({
  categoryName,
  selectedDate,
  onClose,
  onSubmit,
  isLoading,
}: {
  categoryName: string;
  selectedDate: dayjs.Dayjs;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(selectedDate.hour(8).minute(0).second(0));
  const [showCalendar, setShowCalendar] = useState(false);

  const dateLabel = date.format("DD/MM/YYYY HH:mm");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      title,
      description: desc || undefined,
      dueDate: date.toISOString(),
      categoryName: categoryName || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-[360px]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h3 className="font-bold text-gray-800">Thêm công việc</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 pb-5 flex flex-col gap-3">
          {categoryName && (
            <span className="text-xs text-[#8B5CF6] bg-[#EDE9FE] px-3 py-1 rounded-full w-fit">
              📁 {categoryName}
            </span>
          )}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Tên công việc *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Ôn bài môn Toán..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#8B5CF6]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <input
              type="text"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Thêm mô tả..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#8B5CF6]"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Ngày & giờ
            </label>
            <button
              onClick={() => setShowCalendar(true)}
              className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 hover:border-[#8B5CF6] transition-colors"
            >
              <span>{dateLabel}</span>
              <CalendarDays size={16} className="text-gray-400" />
            </button>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim() || isLoading}
            className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50 mt-1"
          >
            {isLoading ? "Đang tạo..." : "Thêm công việc"}
          </button>
        </div>
      </div>

      {/* Calendar popup (z-index cao hơn modal) */}
      {showCalendar && (
        <CalendarPopup
          value={date}
          onChange={(d) => setDate(d)}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </div>
  );
};

// ---- MAIN PAGE ----
const TasksPage = () => {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [filterView, setFilterView] = useState<FilterView>("day");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [showCatModal, setShowCatModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState("#8B5CF6");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeCategoryName, setActiveCategoryName] = useState("");

  const dateStr = selectedDate.format("YYYY-MM-DD");
  const isCompleted =
    filterStatus === "all" ? undefined : filterStatus === "done" ? true : false;

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", dateStr, isCompleted],
    queryFn: () => taskApi.getTasks(dateStr, isCompleted),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll(),
  });

  const weekDays = getWeekDays(selectedDate);
  const getTasksByCategory = (categoryId: string) =>
    tasks.filter(
      (t: Task) =>
        t.categoryId?._id === categoryId || t.categoryId === categoryId,
    );
  const uncategorizedTasks = tasks.filter((t: Task) => !t.categoryId);

  const goPrev = () =>
    filterView === "day"
      ? setSelectedDate((d) => d.subtract(1, "day"))
      : setSelectedDate((d) => d.subtract(1, "week"));
  const goNext = () =>
    filterView === "day"
      ? setSelectedDate((d) => d.add(1, "day"))
      : setSelectedDate((d) => d.add(1, "week"));

  const createCategoryMutation = useMutation({
    mutationFn: () => categoryApi.create({ name: catName, color: catColor }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setShowCatModal(false);
      setCatName("");
      setCatColor("#8B5CF6");
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: any) => taskApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setShowTaskModal(false);
    },
  });

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col overflow-y-auto">
      <div className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <span className="text-sm font-semibold text-[#8B5CF6] tracking-wide">
          XIN CHÀO,{" "}
          {(user?.fullName || user?.email || "TÊN USER").toUpperCase()}
        </span>
        <button
          onClick={() => logout()}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
        >
          Đăng xuất
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path
                d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
                stroke="#666"
                strokeWidth="2"
              />
              <circle cx="12" cy="7" r="4" stroke="#666" strokeWidth="2" />
            </svg>
          </div>
        </button>
      </div>

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-8 py-10 flex items-center justify-between">
          <div className="max-w-xs">
            <h1 className="text-4xl font-black text-gray-900 mb-3">
              To-do list
            </h1>
            <p className="text-sm text-gray-400 mb-6 leading-relaxed">
              Sắp xếp công việc, sắp xếp lại cả một ngày của bạn.
            </p>
            <span className="text-sm text-[#8B5CF6] font-medium">
              Hãy bắt đầu ngay
            </span>
          </div>
          <div className="relative w-80 h-48 flex-shrink-0">
            <div className="absolute inset-0 bg-[#8B5CF6] rounded-[40px] opacity-15" />
            <div className="absolute top-4 right-8 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#EDE9FE] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <path
                    d="M9 11l3 3L22 4"
                    stroke="#8B5CF6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">
                  Get things done,
                </p>
                <p className="text-xs text-gray-400">beautifully</p>
              </div>
            </div>
            <div className="absolute bottom-6 left-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2">
              <div className="w-8 h-8 bg-[#EDE9FE] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                  <rect
                    x="3"
                    y="3"
                    width="7"
                    height="7"
                    rx="1"
                    fill="#8B5CF6"
                  />
                  <rect
                    x="14"
                    y="3"
                    width="7"
                    height="7"
                    rx="1"
                    fill="#C4B5FD"
                  />
                  <rect
                    x="3"
                    y="14"
                    width="7"
                    height="7"
                    rx="1"
                    fill="#C4B5FD"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="7"
                    height="7"
                    rx="1"
                    fill="#8B5CF6"
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">
                  Small tasks.
                </p>
                <p className="text-xs text-gray-400">Big results</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-8 py-8">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">
              Danh sách công việc
            </h2>
            <button
              onClick={() => setShowCatModal(true)}
              className="w-7 h-7 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
              {(["day", "week"] as FilterView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setFilterView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterView === v ? "bg-[#8B5CF6] text-white" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {v === "day" ? "Ngày" : "Tuần"}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2 py-1">
              <button
                onClick={goPrev}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <ChevronLeft size={14} className="text-gray-500" />
              </button>
              <button
                onClick={() => setSelectedDate(dayjs())}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 font-medium hover:text-[#8B5CF6]"
              >
                <CalendarDays size={12} />
                {filterView === "day"
                  ? selectedDate.format("DD/MM")
                  : `${weekDays[0].format("DD/MM")} – ${weekDays[6].format("DD/MM")}`}
              </button>
              <button
                onClick={goNext}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <ChevronRight size={14} className="text-gray-500" />
              </button>
            </div>
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
              {(
                [
                  { value: "all", label: "Tất cả" },
                  { value: "todo", label: "Đang làm" },
                  { value: "done", label: "Đã xong" },
                ] as { value: FilterStatus; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilterStatus(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filterStatus === value ? "bg-[#8B5CF6] text-white" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filterView === "week" && (
          <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
            {weekDays.map((day) => {
              const isSelected =
                day.format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD");
              const isToday =
                day.format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD");
              return (
                <button
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[52px] ${isSelected ? "bg-[#8B5CF6] text-white" : isToday ? "bg-[#EDE9FE] text-[#8B5CF6]" : "bg-white text-gray-600 hover:bg-gray-50"}`}
                >
                  <span className="text-xs font-medium uppercase">
                    {day.format("ddd")}
                  </span>
                  <span className="text-base font-bold mt-0.5">
                    {day.format("DD")}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-3 gap-4">
          {categories.map((cat: Category) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              tasks={getTasksByCategory(cat._id)}
              onAddTask={() => {
                setActiveCategoryName(cat.name);
                setShowTaskModal(true);
              }}
            />
          ))}
          {uncategorizedTasks.length > 0 && (
            <CategoryCard
              category={{
                _id: "uncategorized",
                name: "TO DO",
                color: "#8B5CF6",
                userId: "",
              }}
              tasks={uncategorizedTasks}
              onAddTask={() => {
                setActiveCategoryName("");
                setShowTaskModal(true);
              }}
            />
          )}
          {categories.length === 0 && uncategorizedTasks.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-sm mb-1">Chưa có danh mục nào</p>
              <p className="text-xs">
                Bấm nút <strong>+</strong> để tạo danh mục đầu tiên
              </p>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-[#C4B5FD] py-4 text-center text-xs text-white mt-4">
        © 2026 Brand, Inc. • Privacy • Terms • Sitemap
      </footer>

      {/* MODAL TẠO CATEGORY */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Tạo danh mục mới</h3>
              <button
                onClick={() => setShowCatModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-500 mb-1 block">
                Tên danh mục
              </label>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="VD: Học tập, Sức khỏe..."
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#8B5CF6]"
              />
            </div>
            <div className="mb-5">
              <label className="text-xs text-gray-500 mb-2 block">
                Màu sắc
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCatColor(c)}
                    className={`w-7 h-7 rounded-full transition-all ${catColor === c ? "ring-2 ring-offset-2 ring-gray-400 scale-110" : ""}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => createCategoryMutation.mutate()}
              disabled={!catName.trim() || createCategoryMutation.isPending}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {createCategoryMutation.isPending
                ? "Đang tạo..."
                : "Tạo danh mục"}
            </button>
          </div>
        </div>
      )}

      {/* MODAL TẠO TASK */}
      {showTaskModal && (
        <TaskModal
          categoryName={activeCategoryName}
          selectedDate={selectedDate}
          onClose={() => setShowTaskModal(false)}
          onSubmit={(data) => createTaskMutation.mutate(data)}
          isLoading={createTaskMutation.isPending}
        />
      )}
    </div>
  );
};

const CategoryCard = ({
  category,
  tasks,
  onAddTask,
}: {
  category: Category;
  tasks: Task[];
  onAddTask: () => void;
}) => (
  <div className="bg-[#EDE9FE] rounded-2xl p-4 flex flex-col gap-2 min-h-[180px]">
    <div className="flex items-center justify-between mb-1">
      <div className="flex items-center gap-2">
        <div
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: category.color || "#8B5CF6" }}
        />
        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
          {category.name}
        </span>
      </div>
      <button className="text-gray-400 hover:text-gray-600">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
    </div>
    {tasks.length === 0 && (
      <div className="text-xs text-gray-400 text-center py-3">
        Chưa có công việc nào
      </div>
    )}
    {tasks.slice(0, 3).map((task: Task) => (
      <div
        key={task._id}
        className="bg-white rounded-xl px-3 py-2.5 flex items-start gap-2 shadow-sm"
      >
        <div
          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${task.isCompleted ? "border-[#8B5CF6] bg-[#8B5CF6]" : "border-gray-300"}`}
        >
          {task.isCompleted && (
            <svg width="8" height="8" fill="none" viewBox="0 0 24 24">
              <path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-medium truncate ${task.isCompleted ? "line-through text-gray-400" : "text-gray-700"}`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="text-xs text-gray-400 truncate">{task.description}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button className="text-gray-300 hover:text-gray-500">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
              <path
                d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <button className="text-gray-300 hover:text-yellow-400">
            <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    ))}
    <button
      onClick={onAddTask}
      className="flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:text-[#7C3AED] mt-auto pt-1 mx-auto transition-colors"
    >
      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 8v8M8 12h8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      Thêm công việc
    </button>
  </div>
);

export default TasksPage;
