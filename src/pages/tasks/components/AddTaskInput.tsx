import { useState } from "react";
import { X, CalendarDays, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "../../../api/task.api";
import CalendarPopup, { type RepeatData } from "./CalendarPopup";
import dayjs from "dayjs";

interface AddTaskInputProps {
  categoryName: string;
  selectedDate: dayjs.Dayjs;
  onClose: () => void;
}

const AddTaskInput = ({
  categoryName,
  selectedDate,
  onClose,
}: AddTaskInputProps) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const [date, setDate] = useState(dayjs().hour(8).minute(0).second(0));

  const [showCalendar, setShowCalendar] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [repeatData, setRepeatData] = useState<RepeatData>({
    isMaster: false,
    repeatUnit: "NONE",
    repeatInterval: 1,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => taskApi.create(data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });

      onClose();
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Có lỗi xảy ra khi tạo công việc";

      setErrorMessage(message);
    },
  });

  // Chuyển local time sang UTC+7 đúng cách
  const toUTC7ISOString = (d: dayjs.Dayjs) => {
    return d.format("YYYY-MM-DDTHH:mm:ss") + "+07:00";
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const dueDate = toUTC7ISOString(date);

    createMutation.mutate({
      title,
      description: desc || undefined,
      dueDate,
      categoryName: categoryName || undefined,

      isMaster: repeatData.isMaster,
      repeatUnit: repeatData.repeatUnit,
      repeatInterval: repeatData.repeatInterval,

      endRepeatDate: repeatData.endDate
        ? new Date(repeatData.endDate).toISOString()
        : undefined,
    });
  };

  const REPEAT_LABEL: Record<string, string> = {
    DAILY: "ngày",
    WEEKLY: "tuần",
    MONTHLY: "tháng",
    YEARLY: "năm",
  };

  return (
    <>
      {/* MODAL THÊM TASK */}
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
                {categoryName}
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
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
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
                <span>{date.format("DD/MM/YYYY HH:mm")}</span>

                <CalendarDays size={16} className="text-gray-400" />
              </button>

              {repeatData.isMaster && (
                <p className="text-xs text-[#8B5CF6] mt-1">
                  Lặp lại mỗi {repeatData.repeatInterval}{" "}
                  {REPEAT_LABEL[repeatData.repeatUnit]}
                </p>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!title.trim() || createMutation.isPending}
              className="w-full bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium py-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? "Đang tạo..." : "Thêm công việc"}
            </button>
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

      {/* ERROR MODAL */}
      {errorMessage && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setErrorMessage("")}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#F5F3FF] px-6 py-3 border-b border-[#E9D5FF]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6] flex items-center justify-center">
                  <AlertCircle size={18} className="text-white" />
                </div>

                <h3 className="font-bold text-gray-900 text-base">
                  Không thể tạo công việc
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Không thể tạo công việc đã quá hạn.
              </p>
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 flex justify-end">
              <button
                onClick={() => setErrorMessage("")}
                className="px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-medium transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTaskInput;
