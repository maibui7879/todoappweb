import { useState, useEffect, useRef } from "react";
import { Bell, Clock, Info, Volume2 } from "lucide-react";
import { useNotification } from "../../../hooks/useNotifications";
import { notificationApi } from "../../../api/notification.api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

import TaskInfoModal from "../../../components/Modals/TaskInfoModal";

dayjs.extend(relativeTime);
dayjs.locale("vi");

const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [onlyImportant, setOnlyImportant] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  // Lấy dữ liệu từ Hook
  const { notifications, unreadCount, loadHistory, markAllAsRead } = useNotification();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    loadHistory({ limit: 50, isImportant: onlyImportant ? true : undefined });
  }, [isOpen, onlyImportant, loadHistory]);

  const handleNotificationClick = async (noti: any) => {
    try {
      if (!noti.isRead) {
        await notificationApi.markRead(noti._id);
        loadHistory({ limit: 100, isImportant: onlyImportant ? true : undefined });
      }
      setIsOpen(false);
      if (noti.taskId) setSelectedTaskId(noti.taskId);
    } catch (error) {
      console.error(error);
    }
  };

  // --- SỬA LOGIC HIỂN THỊ Ở ĐÂY ---
  // 1. Không dùng slice(0, 50) hay bất kỳ hàm cắt mảng nào ở đây nữa.
  // 2. Chỉ lọc theo điều kiện "Quan trọng" nếu User tích chọn.
  const displayNoti = onlyImportant 
    ? notifications.filter(n => n.isImportant === true) 
    : notifications;

  return (
    <>
      <div className="relative" ref={popoverRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Bell size={36} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] border-2 border-white">
              {unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-3 w-[380px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 z-[999] overflow-hidden">
            
            <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
              <div>
                <h3 className="text-xl font-black text-indigo-700">Thông báo</h3>
                <p className="text-[11px] text-violet-300 font-medium italic">Hiện có {displayNoti.length} thông báo</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer bg-violet-50 px-3 py-1.5 rounded-xl border border-violet-100">
                <input 
                  type="checkbox" 
                  checked={onlyImportant}
                  onChange={(e) => setOnlyImportant(e.target.checked)}
                  className="w-4 h-4 rounded-md text-[#8B5CF6]"
                />
                <span className="text-xs font-bold text-violet-600">Quan trọng</span>
              </label>
            </div>

            <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
              {displayNoti.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center gap-3 text-gray-300">
                  <Bell size={32} />
                  <p className="text-sm font-medium italic">Không có thông báo nào...</p>
                </div>
              ) : (
                /* MAP TRỰC TIẾP DISPLAYNOTI - KHÔNG BỎ SÓT PHẦN TỬ NÀO */
                displayNoti.map((noti) => (
                  <div
                    key={noti._id}
                    onClick={() => handleNotificationClick(noti)}
                    className={`px-5 py-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-[#F8F9FD] flex gap-4 relative
                      ${!noti.isRead ? "bg-[#F4F7FF]/50" : "bg-white"}`}
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0
                      ${noti.isImportant ? "bg-[#8B5CF6] text-white" : "bg-[#E0E7FF] text-[#4F46E5]"}`}>
                      {noti.isImportant ? <Volume2 size={20} /> : <Info size={20} />}
                    </div>
                    
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex justify-between items-start">
                        <h4 className={`text-lg font-extrabold truncate ${noti.isImportant ? "text-[#7C3AED]" : "text-gray-900"}`}>
                          {noti.title}
                        </h4>
                        {!noti.isRead && <div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full mt-1 animate-pulse" />}
                      </div>
                      
                      <p className={`text-sm leading-relaxed mb-1 line-clamp-2 ${!noti.isRead ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                        {noti.message}
                      </p>

                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                        <Clock size={10} /> {dayjs(noti.createdAt).fromNow()}
                      </span>
                    </div>

                    {noti.isImportant && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8B5CF6] rounded-r-full" />
                    )}
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 bg-white border-t border-gray-50">
              <button 
                onClick={markAllAsRead}
                className="w-full py-2.5 rounded-xl text-xs font-black text-[#6366F1] bg-[#EEF2FF] hover:bg-[#6366F1] hover:text-white transition-all"
              >
                ĐÁNH DẤU TẤT CẢ LÀ ĐÃ ĐỌC
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedTaskId && (
        <TaskInfoModal 
          taskId={selectedTaskId} 
          onClose={() => setSelectedTaskId(null)} 
        />
      )}
    </>
  );
};

export default NotificationPopover;