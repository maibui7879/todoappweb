import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../../api/task.api";
import { type Task } from "../../types/task.type";
import { AlertTriangle, RefreshCw } from "lucide-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const OverduePage = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", "overdue"],
    queryFn: () => taskApi.getOverdue(),
  });

  return (
    <div className="min-h-screen bg-[#F4F6FB] flex flex-col">
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-4 flex items-center gap-3">
        <AlertTriangle size={18} className="text-red-500" />

        <h1 className="text-base font-bold text-gray-800">Công việc quá hạn</h1>

        {tasks.length > 0 && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
            {tasks.length}
          </span>
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-8 py-8 max-w-2xl w-full mx-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            Đang tải...
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-32 h-32 mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={48} className="text-red-500" />
            </div>

            <p className="text-gray-600 font-medium mb-2">
              Không có công việc quá hạn
            </p>

            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              Tuyệt vời 🎉 Bạn đã hoàn thành đúng hạn tất cả công việc
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(tasks as Task[]).map((task) => (
              <div
                key={task._id}
                className="bg-white rounded-2xl px-5 py-4 shadow-sm flex items-start gap-3 border border-red-100"
              >
                {/* STATUS */}
                <div className="w-5 h-5 rounded-full border-2 border-red-400 flex-shrink-0 mt-0.5" />

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800">
                    {task.title}
                  </p>

                  {task.description && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">
                      {dayjs(task.dueDate).utcOffset(7).format("DD/MM/YYYY")}
                    </span>

                    <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full font-medium">
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

                {/* BADGE */}
                <div className="text-xs font-medium text-red-500 bg-red-50 px-2 py-1 rounded-lg">
                  Quá hạn
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverduePage;
