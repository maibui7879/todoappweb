export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  taskId?: string; // để điều hướng tới chi tiết task
  userId: string;
  createdAt: string;
  isImportant: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  unreadCount: number;
}
export interface NotificationQuery {
  keyword?: string;
  isImportant?: boolean;
  taskId?: string;
}