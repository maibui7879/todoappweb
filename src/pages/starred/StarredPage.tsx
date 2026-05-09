// src/pages/starred/StarredPage.tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../api/task.api";
import { type Task } from "../../types/task.type";
import { Star, RefreshCw } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const StarredPage = () => {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", "important"],
    queryFn: () => taskApi.getImportant(),
  });

  // Bỏ gắn sao
  const unimportantMutation = useMutation({
    mutationFn: (taskId: string) => taskApi.markImportant(taskId, false),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      }),
  });

  // Đánh dấu hoàn thành
  const completeMutation = useMutation({
    mutationFn: ({
      taskId,
      isCompleted,
    }: {
      taskId: string;
      isCompleted: boolean;
    }) =>
      taskApi.update(taskId, {
        isCompleted,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
  });

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-4 flex items-center gap-3">
        <Star size={18} className="text-yellow-400" fill="currentColor" />

        <h1 className="text-base font-bold text-gray-800">
          Việc cần gắn dấu sao
        </h1>

        {tasks.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 px-8 py-8 max-w-2xl w-full mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            Đang tải...
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-32 h-32 mb-6 bg-[#EDE9FE] rounded-full flex items-center justify-center">
              <Star size={48} className="text-[#8B5CF6]" />
            </div>

            <p className="text-gray-600 font-medium mb-2">Chưa có việc nào</p>

            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Nhấn vào biểu tượng ⭐ trên task để gắn dấu sao và theo dõi những
              việc quan trọng
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(tasks as Task[]).map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-start gap-3"
              >
                {/* COMPLETE BUTTON */}
                <button
                  onClick={() =>
                    completeMutation.mutate({
                      taskId: task._id,
                      isCompleted: !task.isCompleted,
                    })
                  }
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                  ${
                    task.isCompleted
                      ? "border-[#8B5CF6] bg-[#8B5CF6]"
                      : "border-gray-300 hover:border-[#8B5CF6]"
                  }`}
                >
                  {task.isCompleted && (
                    <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold ${
                      task.isCompleted
                        ? "line-through text-gray-400"
                        : "text-gray-800"
                    }`}
                  >
                    {task.title}
                  </p>

                  {task.description && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
                      {dayjs(task.dueDate).utcOffset(7).format("DD/MM/YYYY")}
                    </span>

                    <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                      {dayjs(task.dueDate).utcOffset(7).format("HH:mm")}
                    </span>

                    {task.categoryId?.name && (
                      <span className="text-xs text-[#8B5CF6] bg-[#EDE9FE] px-2 py-0.5 rounded-full">
                        {task.categoryId.name}
                      </span>
                    )}

                    {task.isVirtual && (
                      <span className="flex items-center gap-0.5 text-xs text-amber-500">
                        <RefreshCw size={10} />
                        Lặp lại
                      </span>
                    )}
                  </div>
                </div>

                {/* STAR BUTTON */}
                <button
                  onClick={() => unimportantMutation.mutate(task._id)}
                  disabled={unimportantMutation.isPending}
                  className="text-yellow-400 hover:text-gray-300 transition-colors p-1 flex-shrink-0"
                  title="Bỏ gắn dấu sao"
                >
                  <Star size={16} fill="currentColor" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StarredPage;
