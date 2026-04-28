// src/pages/tasks/TasksPage.tsx
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../contexts/AuthContext";
import { categoryApi } from "../../api/category.api";
import { type Task } from "../../types/task.type";
import { type Category } from "../../types/category.type";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import CategoryCard from "../../components/Category/CategoryCard";
import CategoryModal from "../../components/Category/CategoryModal";
import AddTaskInput from "../../components/Task/AddTaskInput";
import { useTasksByRange } from "../../hooks/useTasksByRange";
dayjs.locale("vi");

type FilterStatus = "todo" | "done";
type RangeType = "day" | "week" | "month";

const RANGE_LABELS: Record<RangeType, string> = {
  day: "Ngày",
  week: "Tuần",
  month: "Tháng",
};

const getRangeLabel = (date: dayjs.Dayjs, range: RangeType): string => {
  const today = dayjs().format("YYYY-MM-DD");
  if (range === "day") {
    return date.format("YYYY-MM-DD") === today
      ? "Hôm nay"
      : date.format("DD/MM/YYYY");
  }
  if (range === "week") {
    const start = date.startOf("week");
    const end = date.endOf("week");
    return `${start.format("DD/MM")} – ${end.format("DD/MM")}`;
  }
  return date.format("MM/YYYY");
};

const TasksPage = () => {
  const { user, logout } = useAuth();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todo");
  const [range, setRange] = useState<RangeType>("week");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeCategoryName, setActiveCategoryName] = useState("");

  const isCompleted = filterStatus === "done";

  const { tasks, isLoading, startDate } = useTasksByRange(
    selectedDate,
    range,
    isCompleted,
  );

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAll(),
  });

  const getTasksByCategory = (categoryId: string) =>
    tasks.filter(
      (t: Task) =>
        t.categoryId?._id === categoryId || t.categoryId === categoryId,
    );

  const uncategorizedTasks = tasks.filter((t: Task) => !t.categoryId);

  const goPrev = () => {
    if (range === "day") setSelectedDate((d) => d.subtract(1, "day"));
    else if (range === "week") setSelectedDate((d) => d.subtract(1, "week"));
    else setSelectedDate((d) => d.subtract(1, "month"));
  };

  const goNext = () => {
    if (range === "day") setSelectedDate((d) => d.add(1, "day"));
    else if (range === "week") setSelectedDate((d) => d.add(1, "week"));
    else setSelectedDate((d) => d.add(1, "month"));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FB]">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-[#8B5CF6] tracking-wide">
          XIN CHÀO, {(user?.fullName || user?.email || "USER").toUpperCase()}
        </span>
        <button
          onClick={() => logout()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
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

      {/* HERO */}
      <div className="bg-[#ECEDF8]">
        <div className="w-full px-16 py-10 grid grid-cols-[1fr,1.3fr] gap-8 items-center">
          <div className="space-y-5">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              To-do list
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              Sắp xếp công việc, sắp xếp lại cả một ngày của bạn.
            </p>
            <button className="pt-2 text-base font-bold text-[#6366F1] hover:text-[#4F46E5] transition-colors">
              Hãy bắt đầu ngay →
            </button>
          </div>
          <div className="relative h-[300px]">
            <div className="absolute inset-x-0 top-10 bottom-10 bg-[#6366F1] rounded-[999px] z-0" />
            <div className="absolute z-30 top-0 left-8">
              <img
                src="/src/assets/man.jpg"
                alt="man"
                className="w-[100px] h-[100px] rounded-full object-cover shadow-xl border-[8px] border-[#E0E0F5]"
              />
            </div>
            <div className="absolute z-30 bottom-0 right-10">
              <img
                src="/src/assets/woman.jpg"
                alt="woman"
                className="w-[86px] h-[86px] rounded-full object-cover shadow-xl border-[8px] border-[#E0E0F5]"
              />
            </div>
            <div
              className="absolute z-20 left-6 top-[110px] bg-white rounded-3xl shadow-xl px-6 py-6 flex items-center gap-4"
              style={{ width: 280 }}
            >
              <img
                src="/src/assets/pink.jpg"
                alt="pink"
                className="w-12 h-12 object-contain flex-shrink-0"
              />
              <div>
                <p className="text-lg font-extrabold text-gray-900 leading-tight">
                  Small tasks.
                </p>
                <p className="text-lg font-extrabold text-gray-900 leading-tight mt-1">
                  Big results
                </p>
              </div>
            </div>
            <div
              className="absolute z-30 bg-white rounded-3xl shadow-xl px-5 py-4 flex items-center gap-3"
              style={{ right: 0, top: 55, width: 240 }}
            >
              <img
                src="/src/assets/orange.jpg"
                alt="orange"
                className="w-10 h-10 object-contain flex-shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  Get things done,
                </p>
                <p className="text-sm font-bold text-gray-900 leading-tight mt-0.5">
                  beautifully
                </p>
              </div>
            </div>
            <div
              className="absolute z-40 w-[60px] h-[60px] rounded-full bg-[#EC4899] flex items-center justify-center shadow-xl overflow-hidden"
              style={{ top: 18, right: -8 }}
            >
              <img
                src="/src/assets/bulb.jpg"
                alt="bulb"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="flex-1 w-full px-16 py-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-800">
              Danh sách công việc
            </h2>
            <button
              onClick={() => setShowCatModal(true)}
              title="Thêm danh mục"
              className="w-8 h-8 rounded-lg bg-[#8B5CF6] hover:bg-[#7C3AED] text-white flex items-center justify-center transition-colors"
            >
              <Plus size={15} />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Range selector */}
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
              {(["day", "week", "month"] as RangeType[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${range === r ? "bg-[#8B5CF6] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {RANGE_LABELS[r]}
                </button>
              ))}
            </div>

            {/* Date navigator */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl px-2 py-1">
              <button
                onClick={goPrev}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
              >
                <ChevronLeft size={14} className="text-gray-500" />
              </button>
              <button
                onClick={() => setSelectedDate(dayjs())}
                className="px-2 py-1 text-xs font-medium text-[#8B5CF6] hover:bg-[#EDE9FE] rounded-lg transition-colors min-w-[90px] text-center"
              >
                {getRangeLabel(selectedDate, range)}
              </button>
              <button
                onClick={goNext}
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100"
              >
                <ChevronRight size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Status filter */}
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
              {(
                [
                  { value: "todo", label: "Chưa hoàn thành" },
                  { value: "done", label: "Đã hoàn thành" },
                ] as { value: FilterStatus; label: string }[]
              ).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilterStatus(value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${filterStatus === value ? "bg-[#8B5CF6] text-white shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TASK GRID */}
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            Đang tải...
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-6">
            {categories.map((cat: Category) => (
              <CategoryCard
                key={cat._id}
                category={cat}
                tasks={getTasksByCategory(cat._id)}
                dateStr={startDate}
                onAddTask={() => {
                  setActiveCategoryName(cat.name);
                  setShowTaskModal(true);
                }}
                onEdit={() => setEditingCategory(cat)}
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
                dateStr={startDate}
                onAddTask={() => {
                  setActiveCategoryName("");
                  setShowTaskModal(true);
                }}
                onEdit={() => {}}
              />
            )}
            {categories.length === 0 && uncategorizedTasks.length === 0 && (
              <div className="col-span-3 flex flex-col items-center justify-center py-16 text-gray-400">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-sm mb-1">Không có công việc nào</p>
                <p className="text-xs">
                  Bấm nút <strong>+</strong> để tạo danh mục đầu tiên
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODALS */}
      {showCatModal && <CategoryModal onClose={() => setShowCatModal(false)} />}
      {editingCategory && (
        <CategoryModal
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
      {showTaskModal && (
        <AddTaskInput
          categoryName={activeCategoryName}
          selectedDate={selectedDate}
          onClose={() => setShowTaskModal(false)}
        />
      )}
    </div>
  );
};

export default TasksPage;
