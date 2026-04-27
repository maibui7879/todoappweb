// src/components/Task/TaskItem.tsx
import { Trash2, RefreshCw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../api/task.api";
import { type Task } from "../../types/task.type";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface TaskItemProps {
  task: Task;
  dateStr: string;
  onClick?: () => void;
}

const TaskItem = ({ task, dateStr, onClick }: TaskItemProps) => {
  const queryClient = useQueryClient();

  const toggleMutation = useMutation({
    mutationFn: () => {
      if (task.isVirtual) {
        return taskApi.realize(task.masterId!.toString(), dateStr, {
          isCompleted: !task.isCompleted,
        });
      }
      return taskApi.update(task._id, { isCompleted: !task.isCompleted });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      // Virtual task → xóa master task (xóa toàn bộ quy tắc lặp)
      if (task.isVirtual) {
        return taskApi.delete(task.masterId!.toString());
      }
      return taskApi.delete(task._id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
  });

  return (
    <div
      className="bg-white rounded-xl px-3 py-2.5 flex items-start gap-2 shadow-sm group cursor-pointer"
      onClick={onClick}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleMutation.mutate();
        }}
        disabled={toggleMutation.isPending}
        className="mt-0.5 flex-shrink-0"
      >
        <div
          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all
          ${task.isCompleted ? "border-[#8B5CF6] bg-[#8B5CF6]" : "border-gray-300 hover:border-[#8B5CF6]"}`}
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
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-xs font-bold truncate ${task.isCompleted ? "line-through text-gray-400" : "text-gray-800"}`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-400 truncate mt-0.5">
            {task.description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
            {dayjs(task.dueDate).utcOffset(7).format("DD/MM")}
          </span>
          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
            {dayjs(task.dueDate).utcOffset(7).format("HH:mm")}
          </span>
          {task.isVirtual && (
            <span className="flex items-center gap-0.5 text-xs text-amber-500">
              <RefreshCw size={10} /> Lặp lại
            </span>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteMutation.mutate();
        }}
        disabled={deleteMutation.isPending}
        className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all p-0.5 flex-shrink-0"
        title={task.isVirtual ? "Xóa toàn bộ quy tắc lặp" : "Xóa task"}
      >
        <Trash2 size={11} />
      </button>
    </div>
  );
};

export default TaskItem;
