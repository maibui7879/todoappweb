import axiosClient from './axiosClient';
import { type Task } from '../types/task.type';

export const taskApi = {
  // Lấy danh sách task kèm nội suy ảo
  getTasks: (date?: string, isCompleted?: boolean): Promise<Task[]> => {
    const params: any = {};
    if (date) params.date = date;
    if (isCompleted !== undefined) params.isCompleted = isCompleted;
    return axiosClient.get('/tasks', { params });
  },

  getOne: (id: string): Promise<Task> => axiosClient.get(`/tasks/${id}`),

  create: (data: any): Promise<Task> => axiosClient.post('/tasks', data),

  update: (id: string, data: any): Promise<Task> => axiosClient.patch(`/tasks/${id}`, data),

  delete: (id: string) => axiosClient.delete(`/tasks/${id}`),

  // Biến task ảo thành thật khi user tương tác
  realize: (masterId: string, dueDate: string, data: any): Promise<Task> => 
    axiosClient.post(`/tasks/realize/${masterId}?dueDate=${dueDate}`, data),
};