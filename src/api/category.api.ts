import axiosClient from './axiosClient';
import { type Category } from '../types/category.type';

export const categoryApi = {
  getAll: (): Promise<Category[]> => axiosClient.get('/categories'),
  getOne: (id: string): Promise<Category> => axiosClient.get(`/categories/${id}`),
  create: (data: any): Promise<Category> => axiosClient.post('/categories', data),
  update: (id: string, data: any): Promise<Category> => axiosClient.patch(`/categories/${id}`, data),
  delete: (id: string) => axiosClient.delete(`/categories/${id}`),
};