import { X, CalendarDays, RefreshCw, AlertCircle, Info } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { taskApi } from "../../api/task.api"; 
import { type Task } from "../../types/task.type";
import dayjs from "dayjs";


interface TaskInfoModalProps {
  taskId?: string;     
  taskData?: Task;     
  onClose: () => void;
}

const TaskInfoModal = ({ taskId, taskData, onClose }: TaskInfoModalProps) => {
  // 1. KIỂM TRA XEM CÓ PHẢI LÀ TASK ẢO TỪ NOTIFICATION KHÔNG
  const isVirtualNotif = taskId?.startsWith("virtual_");
  
  // Tách lấy masterId để gọi API (nếu là task ảo)
  const queryId = isVirtualNotif ? taskId?.split("_")[1] : taskId;

  // 2. FETCH DỮ LIỆU
  // Nếu là task thường -> Fetch task thường. 
  // Nếu là task ảo -> Fetch task gốc (master task)
  const { data: fetchedData, isLoading, isError } = useQuery({
    queryKey: ["task", queryId],
    queryFn: () => taskApi.getOne(queryId!),
    enabled: !!queryId && !taskData,
    retry: false,
  });

  // 3. LẮP RÁP DATA
  let taskToDisplay = taskData;

  if (!taskData && fetchedData) {
    if (isVirtualNotif) {
      const timestamp = parseInt(taskId!.split("_")[2], 10);
      const masterDate = new Date(fetchedData.dueDate);
      
      const virtualDueDate = new Date(timestamp);
      virtualDueDate.setHours(masterDate.getHours(), masterDate.getMinutes(), 0, 0);

      taskToDisplay = {
        ...fetchedData,
        _id: taskId!,
        dueDate: virtualDueDate.toISOString(),
        isCompleted: false, 
        isVirtual: true,
        masterId: fetchedData._id,
      };
    } else {
      taskToDisplay = fetchedData;
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[1000] p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-xl w-[380px] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-bold text-gray-800">Thông tin công việc</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Trạng thái 1: Đang tải */}
        {!taskData && isLoading ? (
          <div className="p-10 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
            <div className="w-5 h-5 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
            Đang tải thông tin...
          </div>
        ) : 

        isError || !taskToDisplay ? (
          <div className="px-6 py-10 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-1">
              <AlertCircle size={24} />
            </div>
            <p className="text-gray-800 font-bold text-base">Không tìm thấy công việc</p>
            <p className="text-gray-500 text-sm leading-relaxed">
              Công việc này có thể đã bị xóa khỏi hệ thống.
            </p>
            <button 
              onClick={onClose}
              className="mt-3 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
            >
              Đóng
            </button>
          </div>
        ) : 
        
        /* Trạng thái 3: Hiển thị (Task Thật, Task Ảo, hoặc Master) */
        (
          <div className="px-5 py-5 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
            {/* Cảnh báo nếu đang xem Master Task thuần túy */}
            {(!taskToDisplay.isVirtual && taskToDisplay.isMaster) && (
              <div className="bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-xl text-xs text-indigo-700 flex items-start gap-2">
                <Info size={14} className="flex-shrink-0 mt-0.5" />
                <span>Đây là thông tin của <strong>quy tắc lặp lại gốc</strong>.</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${taskToDisplay.isCompleted ? "bg-green-400" : "bg-orange-400"}`} />
              <span className="text-sm font-medium text-gray-600">
                {taskToDisplay.isCompleted ? "Đã hoàn thành" : "Chưa hoàn thành"}
              </span>
              {(taskToDisplay.isVirtual || !!taskToDisplay.masterId) && (
                <span className="flex items-center gap-1 text-xs text-amber-500 ml-auto font-medium">
                  <RefreshCw size={12} /> Lặp lại
                </span>
              )}
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">{taskToDisplay.title}</h4>
              {taskToDisplay.description ? (
                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 whitespace-pre-wrap">
                  {taskToDisplay.description}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">Không có mô tả</p>
              )}
            </div>

            <div className="flex items-center gap-3 mt-1">
              <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center flex-shrink-0">
                <CalendarDays className="text-[#8B5CF6]" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Thời hạn</p>
                <p className="text-sm font-bold text-gray-800">
                  {dayjs(taskToDisplay.dueDate).format("DD/MM/YYYY - HH:mm")}
                </p>
              </div>
            </div>

            {taskToDisplay.categoryId?.name && (
              <div className="flex items-center gap-2 mt-2 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">Danh mục:</span>
                <span className="text-xs font-semibold text-[#8B5CF6] bg-[#EDE9FE] px-2.5 py-1 rounded-full uppercase tracking-wide">
                  {taskToDisplay.categoryId.name}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskInfoModal;