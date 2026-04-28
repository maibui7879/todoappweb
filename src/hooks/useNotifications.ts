import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { notificationApi } from '../api/notification.api';
import { type Notification } from '../types/notification.type';
import { useAuth } from '../contexts/AuthContext'; // Giả định bạn có AuthContext chứa thông tin user
 
const SOCKET_URL = 'https://sybausuzuka-todoapp.hf.space'; // Đổi thành URL backend thực tế khi deploy

export const useNotification = () => {
  const { user } = useAuth(); // Lấy user hiện tại để trích xuất _id
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      const history = await notificationApi.getAll();
      setNotifications(history);
      setUnreadCount(history.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error('Lỗi khi tải lịch sử thông báo:', error);
    }
  }, []);

  useEffect(() => {
    // Chỉ kết nối khi user đã đăng nhập
    if (!user?._id) return;

    loadHistory();

    // Khởi tạo Socket, nhét userId vào query để Gateway backend bắt được
    const socketInstance = io(SOCKET_URL, {
      query: { userId: user._id },
    });

    setSocket(socketInstance);

    // Lắng nghe sự kiện trùng tên với event server emit
    socketInstance.on('new-notification', (newNotif: Notification) => {
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    // Cleanup: Ngắt kết nối khi component unmount hoặc user đăng xuất
    return () => {
      socketInstance.disconnect();
    };
  }, [user?._id, loadHistory]);

  const readNotification = async (id: string) => {
    // Tối ưu UX: Cập nhật state UI ngay lập tức (Optimistic Update)
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // Gọi API ngầm phía sau
    try {
      await notificationApi.markRead(id);
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    readNotification,
  };
};