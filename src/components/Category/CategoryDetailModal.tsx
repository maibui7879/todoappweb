// src/components/Category/CategoryDetailModal.tsx
import { useState } from "react";
import { X } from "lucide-react";
import { type Category } from "../../types/category.type";
import { type Task } from "../../types/task.type";
import TaskItem from "../Task/TaskItem";
import TaskDetail from "../Task/TaskDetail";

interface CategoryDetailModalProps {
  category: Category;
  tasks: Task[];
  dateStr: string;
  onClose: () => void;
}

const CategoryDetailModal = ({
  category,
  tasks,
  dateStr,
  onClose,
}: CategoryDetailModalProps) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-[420px] max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: category.color || "#8B5CF6" }}
              />
              <h3 className="font-bold text-gray-800 uppercase tracking-wide text-sm">
                {category.name}
              </h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {tasks.length} công việc
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Task list - scrollable */}
          <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2 min-h-0">
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="text-3xl mb-2">📋</div>
                <p className="text-sm">Chưa có công việc nào</p>
              </div>
            ) : (
              tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  task={task}
                  dateStr={dateStr}
                  onClick={() => setSelectedTask(task)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Task detail nested modal */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          dateStr={dateStr}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  );
};

export default CategoryDetailModal;
