// src/pages/tasks/TasksPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { taskApi } from "../../api/task.api";
import { categoryApi } from "../../api/category.api";
import { type Task } from "../../types/task.type";
import { type Category } from "../../types/category.type";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

type FilterStatus = "all" | "todo" | "done";
type FilterView = "day" | "week";

const getWeekDays = (baseDate: dayjs.Dayjs) => {
  const start = baseDate.startOf("week");
  return Array.from({ length: 7 }, (_, i) => start.add(i, "day"));
};

const TasksPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [filterView, setFilterView] = useState<FilterView>("day");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

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

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-8 py-3 bg-white border-b border-gray-100">
        <span className="text-sm font-semibold text-[#8B5CF6] tracking-wide">
          XIN CHÀO,{" "}
          {(user?.fullName || user?.email || "TÊN USER").toUpperCase()}
        </span>
        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
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

      {/* HERO SECTION */}
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
          {/* Illustration */}
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

      {/* TASK GRID */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-8 py-8">
        {/* TITLE + FILTER cùng 1 hàng */}
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="text-xl font-bold text-gray-800">
            Danh sách công việc
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Day / Week toggle */}
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
              {(["day", "week"] as FilterView[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setFilterView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterView === v
                      ? "bg-[#8B5CF6] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {v === "day" ? "Ngày" : "Tuần"}
                </button>
              ))}
            </div>

            {/* Date navigator */}
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

            {/* Status filter */}
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterStatus === value
                      ? "bg-[#8B5CF6] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Week day picker */}
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
                  className={`flex flex-col items-center px-3 py-2 rounded-xl transition-all min-w-[52px] ${
                    isSelected
                      ? "bg-[#8B5CF6] text-white"
                      : isToday
                        ? "bg-[#EDE9FE] text-[#8B5CF6]"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
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

        {/* GRID 3 CỘT */}
        <div className="grid grid-cols-3 gap-4">
          {categories.length > 0 ? (
            <>
              {categories.map((cat: Category) => (
                <CategoryCard
                  key={cat._id}
                  title={cat.name}
                  tasks={getTasksByCategory(cat._id)}
                />
              ))}
              {uncategorizedTasks.length > 0 && (
                <CategoryCard title="TO DO" tasks={uncategorizedTasks} />
              )}
            </>
          ) : (
            <>
              {tasks.length > 0 ? (
                <CategoryCard title="TO DO" tasks={tasks} />
              ) : (
                [1, 2, 3, 4, 5, 6].map((i) => <EmptyCard key={i} />)
              )}
            </>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#C4B5FD] py-4 text-center text-xs text-white mt-4">
        © 2026 Brand, Inc. • Privacy • Terms • Sitemap
      </footer>
    </div>
  );
};

const CategoryCard = ({ title, tasks }: { title: string; tasks: Task[] }) => (
  <div className="bg-[#EDE9FE] rounded-2xl p-4 flex flex-col gap-2 min-h-[180px]">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
        {title}
      </span>
      <button className="text-gray-400 hover:text-gray-600">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
    </div>
    {tasks.slice(0, 3).map((task: Task) => (
      <div
        key={task._id}
        className="bg-white rounded-xl px-3 py-2.5 flex items-start gap-2 shadow-sm"
      >
        <div
          className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center
          ${task.isCompleted ? "border-[#8B5CF6] bg-[#8B5CF6]" : "border-gray-300"}`}
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
    <button className="flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:text-[#7C3AED] mt-auto pt-1 mx-auto transition-colors">
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

const EmptyCard = () => (
  <div className="bg-[#EDE9FE] rounded-2xl p-4 flex flex-col gap-2 min-h-[180px]">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
        TO DO
      </span>
      <button className="text-gray-400">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
    </div>
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-white rounded-xl px-3 py-2.5 flex items-center gap-2 shadow-sm"
      >
        <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
        <span className="text-xs text-gray-300">Task Name</span>
        <div className="ml-auto flex gap-1">
          <div className="w-3 h-3 rounded bg-gray-100" />
          <div className="w-3 h-3 rounded bg-gray-100" />
        </div>
      </div>
    ))}
    <button className="flex items-center gap-1.5 text-xs text-[#8B5CF6] mt-auto pt-1 mx-auto">
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
