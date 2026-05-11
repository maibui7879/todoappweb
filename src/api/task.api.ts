import axiosClient from "./axiosClient";
import { type Task } from "../types/task.type";

export const taskApi = {
  // Lấy tasks theo khoảng ngày (startDate + endDate)
  getTasks: (
    startDate?: string,
    endDate?: string,
    isCompleted?: boolean,
  ): Promise<Task[]> => {
    const params: any = {};

    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    // Ẩn task quá hạn khỏi trang task chính
    params.isOverdue = false;

    if (isCompleted !== undefined) {
      params.isCompleted = isCompleted;
    }

    return axiosClient.get("/tasks", { params });
  },

  // Lấy task gắn sao
  getImportant: (): Promise<Task[]> =>
    axiosClient.get("/tasks", {
      params: { isImportant: true },
    }),

  // Lấy task quá hạn
  getOverdue: (): Promise<Task[]> =>
    axiosClient.get("/tasks", {
      params: { isOverdue: true },
    }),

  getOne: (id: string): Promise<Task> => axiosClient.get(`/tasks/${id}`),

  create: (data: any): Promise<Task> => axiosClient.post("/tasks", data),

  update: (id: string, data: any): Promise<Task> =>
    axiosClient.patch(`/tasks/${id}`, data),

  // Đánh dấu quan trọng (tự động realize nếu là task ảo)
  markImportant: (id: string, isImportant: boolean): Promise<Task> =>
    axiosClient.patch(`/tasks/${id}/important`, {
      isImportant,
    }),

  delete: (id: string) => axiosClient.delete(`/tasks/${id}`),

  realize: (masterId: string, dueDate: string, data: any): Promise<Task> =>
    axiosClient.post(`/tasks/realize/${masterId}?dueDate=${dueDate}`, data),
};
