import { useState, useEffect, useRef } from "react";
import { Bell, Clock, Info, Volume2 } from "lucide-react";
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
  const { notifications, unreadCount, loadHistory ,markAllAsRead } = useNotification(); // Custom hook xử lý socket & data
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

  // Xóa bớt 1 thông báo “Sắp đến hạn” nhưng giữ nguyên logic hiển thị còn lại
  const displayNoti = (() => {
    const deadlineIndex = filteredNoti.findIndex(n => n.message.toLowerCase().includes("đến hạn"));
    if (deadlineIndex !== -1) {
      return filteredNoti.filter((_, index) => index !== deadlineIndex);
    }
    return filteredNoti;
  })();

  return (
    <div className="relative" ref={popoverRef}>
      {/* Icon chuông & Badge */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
      >
        <Bell size={36} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] border-2 border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Pop-up danh sách thông báo */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-[380px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-gray-100 z-[999] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Header Pop-up */}
          <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-white">
            <div>
              <h3 className="text-xl font-black text-indigo-700">Thông báo</h3>
              <p className="text-[11px] text-violet-300 font-medium italic">Bạn có {unreadCount} tin nhắn chưa đọc</p>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-violet-50 px-3 py-1.5 rounded-xl hover:bg-violet-100 transition-colors border border-violet-100">
              <input 
                type="checkbox" 
                checked={onlyImportant}
                onChange={(e) => setOnlyImportant(e.target.checked)}
                className="w-4 h-4 rounded-md text-[#8B5CF6] focus:ring-[#8B5CF6] border-violet-300 cursor-pointer"
              />
              <span className="text-xs font-bold text-violet-600">
                Quan trọng
              </span>
            </label>
          </div>

          {/* List nội dung thông báo */}
          <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
            {filteredNoti.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                  <Bell size={32} />
                </div>
                <p className="text-gray-400 text-sm font-medium italic">Hộp thư trống trải quá...</p>
              </div>
            ) : (
              displayNoti.map((noti) => (
                <div
                  key={noti._id}
                  onClick={() => handleNotificationClick(noti)}
                  className={`px-5 py-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-[#F8F9FD] flex gap-4 relative group
                    ${!noti.isRead ? "bg-[#F4F7FF]/50" : "bg-white"}`}
                >
                  {/* Icon trạng thái bên trái */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm
                    ${noti.isImportant ? "bg-[#8B5CF6] text-white" : "bg-[#E0E7FF] text-[#4F46E5]"}`}>
                    {noti.isImportant ? <Volume2 size={20} /> : <Info size={20} />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      {/* Tiêu đề thông báo */}
                      <h4 className={`text-lg font-extrabold truncate pr-2 ${noti.isImportant ? "text-[#7C3AED]" : "text-gray-900"}`}>
                        {noti.title}
                      </h4>
                      {/* Dấu chấm xanh trạng thái chưa đọc */}
                      {!noti.isRead && (
                        <div className="w-2.5 h-2.5 bg-[#3B82F6] rounded-full mt-1 flex-shrink-0 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                      )}
                    </div>

                    {/* Dòng nhãn trạng thái: Ưu tiên cao & Sắp đến hạn được đẩy lên trên */}
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {noti.isImportant && (
                        <span className="text-[10px] bg-[#EDE9FE] text-[#7C3AED] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <span className="w-1 h-1 bg-[#7C3AED] rounded-full"></span>
                          Ưu tiên cao
                        </span>
                      )}
                      {/* Logic hiển thị nhãn Sắp đến hạn dựa trên nội dung tin nhắn
                      {noti.message.toLowerCase().includes("đến hạn") && (
                        <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm border border-red-100">
                          <Clock size={8} /> GẤP
                        </span>
                      )} */}
                    </div>
                    
                    {/* Nội dung tin nhắn rút gọn */}
                    <p className={`text-sm leading-relaxed mb-2 line-clamp-2 ${!noti.isRead ? "text-gray-700 font-medium" : "text-gray-500"}`}>
                      {noti.message}
                    </p>

                    {/* Thời gian hiển thị dưới cùng */}
                    <div className="flex items-center">
                      <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                        <Clock size={10} /> {dayjs(noti.createdAt).fromNow()}
                      </span>
                    </div>
                  </div>

                  {/* Viền tím báo hiệu thông báo quan trọng khi hover */}
                  {noti.isImportant && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8B5CF6] rounded-r-full" />
                  )}
                </div>
              ))
            )}
          </div>
          
          {/* Footer Pop-up */}
          <div className="p-4 bg-white border-t border-gray-50">
            <button 
              onClick={markAllAsRead}
              className="w-full py-2.5 rounded-xl text-xs font-black text-[#6366F1] bg-[#EEF2FF] hover:bg-[#6366F1] hover:text-white transition-all duration-300"
            >
              ĐÁNH DẤU TẤT CẢ LÀ ĐÃ ĐỌC
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPopover;