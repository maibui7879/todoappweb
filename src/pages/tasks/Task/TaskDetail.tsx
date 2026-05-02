// src/components/Task/TaskDetail.tsx
import { useState } from "react";
import { X, CalendarDays, Trash2, RefreshCw } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../../api/task.api";
import { type Task } from "../../../types/task.type";
import CalendarPopup, { type RepeatData } from "./CalendarPopup";
import dayjs from "dayjs";

interface TaskDetailProps {
  task: Task;
  dateStr: string;
  onClose: () => void;
}

const REPEAT_LABEL: Record<string, string> = {
  DAILY: "ngày",
  WEEKLY: "tuần",
  MONTHLY: "tháng",
  YEARLY: "năm",
};

const TaskDetail = ({ task, dateStr, onClose }: TaskDetailProps) => {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description || "");
  const [date, setDate] = useState(dayjs(task.dueDate));
  const [showCalendar, setShowCalendar] = useState(false);
  const [repeatData, setRepeatData] = useState<RepeatData>({
    isMaster: task.isMaster || task.isVirtual || false,
    repeatUnit: task.repeatUnit || "DAILY",
    repeatInterval: task.repeatInterval || 1,
  });

  // Cập nhật master task (cho cả virtual task)
  const updateMutation = useMutation({
    mutationFn: (data: any) => {
      if (task.isVirtual) {
        // Sửa master task thay vì realize
        return taskApi.update(task.masterId!.toString(), data);
      }
      return taskApi.update(task._id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (task.isVirtual) return taskApi.delete(task.masterId!.toString());
      return taskApi.delete(task._id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
  });

  const handleSave = () => {
    if (!title.trim()) return;
    updateMutation.mutate({
      title,
      description: desc || undefined,
      dueDate: date.format("YYYY-MM-DDTHH:mm:ss") + "+07:00",
      isMaster: repeatData.isMaster,
      repeatUnit: repeatData.repeatUnit,
      repeatInterval: repeatData.repeatInterval,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-30 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-[380px]">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Chi tiết công việc</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title={
                task.isVirtual ? "Xóa toàn bộ quy tắc lặp lại" : "Xóa task"
              }
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="px-5 py-4 flex flex-col gap-3">
          {/* Status */}
          <div className="flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${task.isCompleted ? "bg-green-400" : "bg-orange-400"}`}
            />
            <span className="text-xs text-gray-500">
              {task.isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
            </span>
            {task.isVirtual && (
              <span className="flex items-center gap-1 text-xs text-amber-500 ml-auto">
                <RefreshCw size={10} /> Task lặp lại
              </span>
            )}
          </div>

          {task.isVirtual && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-700">
              Sửa/xóa task này sẽ ảnh hưởng{" "}
              <strong>toàn bộ quy tắc lặp lại</strong>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Tên công việc
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#8B5CF6]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={2}
              placeholder="Thêm mô tả..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#8B5CF6] resize-none"
            />
          </div>

          {/* Date + Repeat */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              Ngày & giờ
            </label>
            <button
              onClick={() => setShowCalendar(true)}
              className="w-full flex items-center justify-between border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 hover:border-[#8B5CF6] transition-colors"
            >
              <span>{date.format("DD/MM/YYYY HH:mm")}</span>
              <CalendarDays size={16} className="text-gray-400" />
            </button>
            {repeatData.isMaster && repeatData.repeatUnit !== "NONE" && (
              <p className="text-xs text-[#8B5CF6] mt-1">
                 Lặp lại mỗi {repeatData.repeatInterval}{" "}
                {REPEAT_LABEL[repeatData.repeatUnit]}
              </p>
            )}
          </div>

          {/* Category */}
          {task.categoryId?.name && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Danh mục:</span>
              <span className="text-xs text-[#8B5CF6] bg-[#EDE9FE] px-2 py-0.5 rounded-full">
                {task.categoryId.name}
              </span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 mt-1">
            <button
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim() || updateMutation.isPending}
              className="flex-1 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium py-2 rounded-xl transition-colors disabled:opacity-50"
            >
              {updateMutation.isPending ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </div>
      </div>

      {showCalendar && (
        <CalendarPopup
          value={date}
          onChange={setDate}
          onClose={() => setShowCalendar(false)}
          repeatData={repeatData}
          onRepeatChange={setRepeatData}
        />
      )}
    </div>
  );
};

export default TaskDetail;
