import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { notificationApi } from '../api/notification.api';
import { type Notification, type NotificationQuery } from '../types/notification.type';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const SOCKET_URL = 'https://sybausuzuka-todoapp.hf.space';
const NORMAL_SOUND = '/sounds/normal-notification.mp3';
const IMPORTANT_SOUND = '/sounds/important-notification.mp3';

export const useNotification = () => {
  const { user, isLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const playSound = (isImportant: boolean) => {
    const audio = new Audio(isImportant ? IMPORTANT_SOUND : NORMAL_SOUND);
    audio.play().catch(() => {}); // Tránh lỗi nếu trình duyệt chặn autoplay
  };

  const loadHistory = useCallback(async (query?: NotificationQuery) => {
    try {
      console.log('📲 Đang tải lịch sử thông báo...', query);
      const response = await notificationApi.getAll(query);
      console.log('✅ Lịch sử thông báo:', response);
      setNotifications(response.notifications);
      // Tính unreadCount từ mảng notifications (backend không return)
      const unread = response.notifications.filter((n: Notification) => !n.isRead).length;
      setUnreadCount(unread);
      console.log('📊 Tổng thông báo:', response.notifications.length, '| Chưa đọc:', unread);
    } catch (error) {
      console.error('❌ Lỗi khi tải lịch sử thông báo:', error);
    }
  }, []);

  useEffect(() => {
    // Đợi cho tới khi auth đã load xong
    if (isLoading) {
      console.log('⏳ Đang chờ auth load...');
      return;
    }
    
    if (!user?.id) {
      console.log('❌ Không có user, bỏ qua notification');
      return;
    }
    
    console.log('👤 User đã login, tải thông báo...', user.id);
    loadHistory({ limit: 50 });

    const socketInstance = io(SOCKET_URL, {
      query: { userId: user.id },
    });
    console.log('🔌 Socket kết nối...');

    socketInstance.on('new-notification', (newNotif: Notification) => {
      console.log('🔔 Thông báo mới:', newNotif);
      setNotifications((prev) => [newNotif, ...prev]);
      if (!newNotif.isRead) setUnreadCount((prev) => prev + 1);
      
      playSound(newNotif.isImportant);

      toast(`${newNotif.title}: ${newNotif.message}`, {
        type: newNotif.isImportant ? 'error' : 'info',
        position: 'bottom-right'
      });

    });

    return () => { 
      console.log('❌ Socket ngắt kết nối');
      socketInstance.disconnect(); 
    };
  }, [user?.id, isLoading, loadHistory]);

  const readNotification = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await notificationApi.markRead(id);
    } catch (error) {
      console.error('Lỗi khi đánh dấu đã đọc:', error);
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    try {
      await notificationApi.markAllRead();
    } catch (error) {
      console.error('Lỗi khi đánh dấu đọc tất cả:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    readNotification,
    markAllAsRead,
    loadHistory,
  };
};