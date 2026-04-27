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
  const [range, setRange] = useState<RangeType>("day");
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [activeCategoryName, setActiveCategoryName] = useState("");

  const dateStr = selectedDate.format("YYYY-MM-DD");
  const isCompleted = filterStatus === "done";

  const { tasks, isLoading } = useTasksByRange(
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
      <div className="bg-[#ECEBFA]">
        <div className="w-full px-14 py-8 grid grid-cols-[1fr,1.15fr] gap-6 items-center">
          {/* LEFT */}
          <div className="pl-6">
            <h1 className="text-[54px] font-extrabold text-[#2F3542] leading-none mb-5">
              To-do list
            </h1>

            <p className="text-[15px] text-gray-500 leading-6 max-w-[260px] mb-8">
              Sắp xếp công việc, sắp xếp lại cả một ngày của bạn.
            </p>

            <button className="text-[15px] font-semibold text-[#5B67F2] hover:text-[#4752db] transition-colors">
              Hãy bắt đầu ngay
            </button>
          </div>

          {/* RIGHT */}
          <div className="relative h-[260px]">
            {/* Purple pill */}
            <div className="absolute left-8 right-8 top-8 bottom-8 rounded-[999px] bg-[#5C67E8]" />

            {/* Avatar top */}
            <div className="absolute top-0 left-20 z-30">
              <img
                src="/src/assets/man.jpg"
                alt="man"
                className="w-[74px] h-[74px] rounded-full object-cover border-[6px] border-[#DDDDF8]"
              />
            </div>

            {/* Avatar bottom */}
            <div className="absolute bottom-0 right-16 z-30">
              <img
                src="/src/assets/woman.jpg"
                alt="woman"
                className="w-[68px] h-[68px] rounded-full object-cover border-[6px] border-[#DDDDF8]"
              />
            </div>

            {/* Big card */}
            <div className="absolute left-20 top-[96px] z-20 bg-white rounded-2xl shadow-lg w-[255px] h-[86px] px-5 flex items-center gap-4">
              <img
                src="/src/assets/pink.jpg"
                alt="pink"
                className="w-9 h-9 object-contain"
              />

              <div>
                <p className="text-[14px] font-extrabold text-[#222] leading-tight">
                  Small tasks.
                </p>
                <p className="text-[14px] font-extrabold text-[#222] leading-tight mt-1">
                  Big results
                </p>
              </div>
            </div>

            {/* Small card */}
            <div className="absolute right-8 top-[58px] z-30 bg-white rounded-2xl shadow-lg w-[225px] h-[72px] px-4 flex items-center gap-3">
              <img
                src="/src/assets/orange.jpg"
                alt="orange"
                className="w-8 h-8 object-contain"
              />

              <div>
                <p className="text-[12px] font-bold text-[#222] leading-tight">
                  Get things done,
                </p>
                <p className="text-[12px] font-bold text-[#222] leading-tight mt-1">
                  beautifully
                </p>
              </div>
            </div>

            {/* Dots */}
            <div className="absolute top-[54px] left-[286px] z-20 flex gap-1">
              <span className="w-1 h-1 rounded-full bg-[#F0C55A]" />
              <span className="w-1 h-1 rounded-full bg-[#F0C55A]" />
              <span className="w-1 h-1 rounded-full bg-[#F0C55A]" />
            </div>

            {/* Bulb */}
            <div className="absolute top-[30px] right-0 z-40 w-[48px] h-[48px] rounded-full bg-[#F04E8A] shadow-lg overflow-hidden">
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
        {/* TOP BAR */}
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
            {/* RANGE */}
            <div className="flex bg-white border border-gray-200 rounded-xl p-1 gap-1">
              {(["day", "week", "month"] as RangeType[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    range === r
                      ? "bg-[#8B5CF6] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {RANGE_LABELS[r]}
                </button>
              ))}
            </div>

            {/* DATE NAV */}
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

            {/* STATUS */}
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

        {/* GRID */}
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
                dateStr={dateStr}
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
                dateStr={dateStr}
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
