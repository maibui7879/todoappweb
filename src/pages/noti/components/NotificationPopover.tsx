import { useState, useEffect, useRef } from "react";
import { Bell, Info, Volume2 } from "lucide-react";
import { useNotification} from "../../../hooks/useNotifications"; 
import { notificationApi } from "../../../api/notification.api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { toast } from "react-toastify";

dayjs.extend(relativeTime);
dayjs.locale("vi");

// Link âm thanh (bạn có thể thay bằng file trong public)
const normalSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3");
const importantSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");

const NotificationPopover = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [onlyImportant, setOnlyImportant] = useState(false);
  const { notifications, unreadCount, loadHistory } = useNotification(); // Custom hook xử lý socket & data
  const navigate = useNavigate();
  const popoverRef = useRef<HTMLDivElement>(null);

  // Đóng khi click ngoài
  useEffect(() => {
    console.log('🔍 Popover render:', { notifications: notifications.length, unreadCount });
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifications, unreadCount]);

  // Xử lý khi click vào thông báo
  const handleNotificationClick = async (noti: any) => {
    try {
      if (!noti.isRead) {
        await notificationApi.markRead(noti._id);
        loadHistory();
      }
      setIsOpen(false);
      // Chuyển hướng đến chi tiết task (giả sử route là /tasks/:id)
      navigate(`/tasks?taskId=${noti.taskId}`); 
    } catch (error) {
      console.error(error);
    }
  };

  const filteredNoti = onlyImportant 
    ? notifications.filter(n => n.isImportant) 
    : notifications.slice(0, 50);

  return (
    <div className="relative" ref={popoverRef}>
      {/* Icon chuông & Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] border-2 border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Pop-up danh sách */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header Pop-up */}
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Thông báo</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={onlyImportant}
                onChange={(e) => setOnlyImportant(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="text-xs font-medium text-gray-600">Quan trọng</span>
            </label>
          </div>

          {/* List nội dung */}
          <div className="max-h-[450px] overflow-y-auto">
            {filteredNoti.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">Không có thông báo nào</div>
            ) : (
              filteredNoti.map((noti) => (
                <div
                  key={noti._id}
                  onClick={() => handleNotificationClick(noti)}
                  className={`px-4 py-4 border-b border-gray-50 cursor-pointer transition-colors hover:bg-gray-50 flex gap-3 relative
                    ${!noti.isRead ? "bg-blue-50/30" : ""} 
                    ${noti.isImportant ? "border-l-4 border-l-purple-500" : "border-l-4 border-l-transparent"}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 
                    ${noti.isImportant ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                    {noti.isImportant ? <Volume2 size={18} /> : <Info size={18} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm leading-tight ${!noti.isRead ? "font-bold text-gray-900" : "text-gray-600"}`}>
                        {noti.message}
                      </p>
                      {!noti.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0 shadow-sm" />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {dayjs(noti.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 bg-gray-50 text-center">
            <button className="text-xs font-bold text-[#6366F1] hover:underline">Xem tất cả</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;