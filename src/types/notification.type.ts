export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  isImportant: boolean; // Để phân biệt màu sắc và nhạc
  taskId?: string;      // Dùng để điều hướng khi click
  userId: string;
  createdAt: string;
}
export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
export interface NotificationQuery {
  isImportant?: boolean;
  isRead?: boolean;
  limit?: number; 
  keyword?: string; 
  taskId?: string;
}