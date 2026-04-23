export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  taskId?: string;
  userId: string;
  createdAt: string;
}