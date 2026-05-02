// src/components/Category/CategoryCard.tsx
import { useState, useRef } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../../api/category.api";
import { taskApi } from "../../api/task.api";
import { type Category } from "../../types/category.type";
import { type Task } from "../../types/task.type";
import TaskList from "../../pages/tasks/Task/TaskList";
import TaskDetail from "../../pages/tasks/Task/TaskDetail";
import CategoryDetailModal from "./CategoryDetailModal";

interface CategoryCardProps {
  category: Category;
  tasks: Task[];
  dateStr: string;
  onAddTask: () => void;
  onEdit: () => void;
}

const CategoryCard = ({
  category,
  tasks,
  dateStr,
  onAddTask,
  onEdit,
}: CategoryCardProps) => {
  const queryClient = useQueryClient();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      // Xóa tất cả task thuộc category này trước
      // Virtual task thì xóa masterId, task thật thì xóa _id
      const idsToDelete = [
        ...new Set(
          tasks.map((t) =>
            t.isVirtual && t.masterId ? t.masterId.toString() : t._id,
          ),
        ),
      ];
      await Promise.all(idsToDelete.map((id) => taskApi.delete(id)));
      // Sau đó mới xóa category
      return categoryApi.delete(category._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const handleMenuClick = () => {
    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + 4, left: rect.left - 100 });
    }
    setShowMenu((v) => !v);
  };

  return (
    <>
      <div className="bg-[#EDE9FE] rounded-2xl p-4 flex flex-col gap-2 min-h-[180px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: category.color || "#8B5CF6" }}
            />
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide truncate">
              {category.name}
            </span>
            {tasks.length > 0 && (
              <span className="text-xs text-gray-400 bg-white/70 px-1.5 py-0.5 rounded-full flex-shrink-0">
                {tasks.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {category._id !== "uncategorized" && (
              <button
                ref={menuBtnRef}
                onClick={handleMenuClick}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-white/50"
              >
                <MoreHorizontal size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />
            <div
              className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-100 py-1 w-44"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              <button
                onClick={() => {
                  onEdit();
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Pencil size={13} /> Sửa danh mục
              </button>
              <button
                onClick={() => {
                  deleteMutation.mutate();
                  setShowMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <Trash2 size={13} /> Xóa danh mục
              </button>
            </div>
          </>
        )}

        {/* Task list */}
        <TaskList
          tasks={tasks}
          dateStr={dateStr}
          onTaskClick={(task) => setSelectedTask(task)}
          onShowAll={() => setShowDetail(true)}
        />

        {/* Add task button */}
        <button
          onClick={onAddTask}
          className="flex items-center gap-1.5 text-xs text-[#8B5CF6] hover:text-[#7C3AED] mt-auto pt-1 mx-auto transition-colors"
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
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

      {/* Task detail modal */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          dateStr={dateStr}
          onClose={() => setSelectedTask(null)}
        />
      )}

      {/* Category detail modal - tất cả task */}
      {showDetail && (
        <CategoryDetailModal
          category={category}
          tasks={tasks}
          dateStr={dateStr}
          onClose={() => setShowDetail(false)}
        />
      )}
    </>
  );
};

export default CategoryCard;
