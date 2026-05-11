import axiosClient from './axiosClient';
import { 
  type Notification, 
  type NotificationResponse, 
  type NotificationQuery 
} from '../types/notification.type';

export const notificationApi = {
  // Lấy danh sách thông báo (hỗ trợ lọc quan trọng, giới hạn số lượng tin)
  getAll: (params?: NotificationQuery): Promise<NotificationResponse> => 
    axiosClient.get('/notifications', { params }),

  // Đánh dấu 1 thông báo đã đọc khi click vào
  markRead: (id: string): Promise<Notification> => 
    axiosClient.patch(`/notifications/${id}/read`),

  // API thứ 3: Đánh dấu tất cả là đã đọc
  markAllRead: (): Promise<{ message: string }> => 
    axiosClient.patch('/notifications/read-all'),
};