import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { notificationApi } from '../api/notification.api';
import { type Notification, type NotificationQuery } from '../types/notification.type';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const SOCKET_URL = 'https://sybausuzuka-todoapp.hf.space';
// Link âm thanh (bạn có thể thay bằng file trong public)
const normalSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2353/2353-preview.mp3");
const importantSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");

export const useNotification = () => {
  const { user, isLoading } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const playSound = (isImportant: boolean) => {
    const audio = isImportant ? importantSound : normalSound;
    audio.play().catch(() => {}); // Tránh lỗi nếu trình duyệt chặn autoplay
  };

  const loadHistory = useCallback(async (query?: NotificationQuery) => {
    try {
      const response = await notificationApi.getAll(query);
      
      // Handle 2 case: response là array hoặc object có property notifications
      let notifData: Notification[] = [];
      if (Array.isArray(response)) {
        notifData = response;
      } else if (response?.notifications) {
        notifData = response.notifications;
      }
      
      setNotifications(notifData);
      const unread = notifData.filter((n: Notification) => !n.isRead).length;
      setUnreadCount(unread);
      console.log('📊 Tổng thông báo:', notifData.length, '| Chưa đọc:', unread);
    } catch (error) {
    }
  }, []);

  useEffect(() => {
    // Đợi cho tới khi auth đã load xong
    if (isLoading) {
      return;
    }
    
    if (!user?.id) {
      return;
    }
    
    loadHistory({ limit: 50 });
    // Kết nối Socket.IO
    const socketInstance = io(SOCKET_URL, {
      query: { userId: user.id },
    });
    console.log('🔌 Socket kết nối...');

    socketInstance.on('new-notification', (newNotif: Notification) => {
      setNotifications((prev) => [newNotif, ...prev]);
      if (!newNotif.isRead) setUnreadCount((prev) => prev + 1);
      
      playSound(newNotif.isImportant);

      toast(`${newNotif.title}: ${newNotif.message}`, {
        type: newNotif.isImportant ? 'error' : 'info',
        position: 'bottom-right'
      });

    });

    return () => { 
      socketInstance.disconnect(); 
    };
  }, [user?.id, isLoading, loadHistory]);
  //đánh dấu đọc khi click vào thông báo 
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
  // Đánh dấu tất cả là đã đọc
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