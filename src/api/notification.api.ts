import axiosClient from './axiosClient';
import { type Notification } from '../types/notification.type';

export const notificationApi = {
  getAll: (): Promise<Notification[]> => axiosClient.get('/notifications'),
  markRead: (id: string): Promise<Notification> => axiosClient.patch(`/notifications/${id}/read`),
};